
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThrottledNavigate } from '@/hooks/useThrottledNavigate';

const Auth = () => {
  const navigate = useNavigate();
  const throttledNavigate = useThrottledNavigate(500);
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  // Get referral code from URL params
  const urlParams = new URLSearchParams(location.search);
  const referralCode = urlParams.get('ref');
  
  console.log('Auth page rendering', { 
    user: user ? 'exists' : 'null', 
    pathname: location.pathname,
    loading 
  });
  
  // Redirect if user is already logged in - throttled to prevent infinite loops
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (user && !loading && !hasRedirected.current) {
      console.log("Auth: User already authenticated, redirecting to dashboard");
      hasRedirected.current = true;
      throttledNavigate('/dashboard', { replace: true });
    }
    
    // Reset redirect flag when user changes
    if (!user) {
      hasRedirected.current = false;
    }
  }, [user, loading, throttledNavigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Auth: Attempting to sign in");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      
      if (error) {
        console.error('Auth: Sign in error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error("No user returned from sign in");
      }
      
      console.log("Auth: Sign in successful");
      toast.success("Signed in successfully");
      
    } catch (error: any) {
      console.error('Auth: Error signing in:', error);
      let errorMessage = "Failed to sign in. Please check your credentials.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link before signing in.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    if (!firstName.trim() || !lastName.trim()) {
      const errorMessage = "Please provide your first and last name";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Auth: Attempting to sign up");
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('Auth: Sign up error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error("No user returned from sign up");
      }
      
      // Process referral code if provided
      if (referralCode) {
        try {
          console.log("Processing referral code:", referralCode);
          
          // Find the referrer by referral code
          const { data: referrer, error: referrerError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('referral_code', referralCode)
            .single();
          
          if (referrerError || !referrer) {
            console.log("Referral code not found or error:", referrerError);
          } else {
            // Create referral record
            const { error: referralError } = await supabase
              .from('referrals')
              .insert({
                referrer_id: referrer.id,
                referee_id: data.user.id,
                referee_email: email.trim(),
                bonus_points: 15,
                completed: true,
                completed_at: new Date().toISOString(),
                status: 'completed'
              });
            
            if (referralError) {
              console.error("Failed to create referral record:", referralError);
            } else {
              // Award points to referrer
              await supabase.functions.invoke('earn-points', {
                body: {
                  uid: referrer.id,
                  points: 15,
                  notes: `Referral bonus for inviting ${firstName} ${lastName}`
                }
              });
              
              // Award welcome bonus to new user
              await supabase.functions.invoke('earn-points', {
                body: {
                  uid: data.user.id,
                  points: 10,
                  notes: `Welcome bonus (referred by ${referrer.first_name})`
                }
              });
              
              console.log("Referral processed successfully");
            }
          }
        } catch (error) {
          console.error("Error processing referral:", error);
          // Don't fail signup if referral processing fails
        }
      }
      
      console.log("Auth: Sign up successful");
      toast.success("Account created successfully! Please check your email to verify your account.");
      
      // Clear form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      
    } catch (error: any) {
      console.error('Auth: Error signing up:', error);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsResettingPassword(true);
    
    try {
      console.log('Sending password reset email to:', forgotPasswordEmail.trim());
      
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail.trim(), {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent! Please check your inbox.');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6 max-w-md">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/3065d86c-e6b8-4d0f-b9d5-c9b3445ce445.png" 
              alt="Raw Smith Coffee" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#8B4513]">Raw Smith Coffee</CardTitle>
          <CardDescription>
            {referralCode ? "Join via referral - You'll earn bonus points!" : "Loyalty program sign in"}
          </CardDescription>
          {referralCode && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                🎉 Referral code detected! Sign up to earn welcome bonus points.
              </p>
            </div>
          )}
        </CardHeader>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4 pt-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-[#8B4513]">Reset Your Password</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="resetEmail" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="pl-10"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    disabled={isResettingPassword}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                  setError(null);
                }}
                disabled={isResettingPassword}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </form>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto font-normal text-[#8B4513] hover:text-[#6F4E37]"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setError(null);
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          className="pl-10"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signupEmail" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signupPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password should be at least 6 characters long
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default Auth;
