
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CoffeeIcon, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  console.log('Auth page rendering', { 
    user: user ? 'exists' : 'null', 
    pathname: location.pathname,
    loading 
  });

  // Set a maximum wait time for initial auth check
  useEffect(() => {
    console.log('Auth: Setting up auth check timeout');
    const timeout = setTimeout(() => {
      console.log('Auth: Auth check timeout reached, allowing page to render');
      setAuthChecked(true);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Mark auth as checked when loading completes
  useEffect(() => {
    if (!loading) {
      console.log('Auth: Loading complete, marking auth as checked');
      setAuthChecked(true);
    }
  }, [loading]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log("Auth: User already authenticated, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Auth: Attempting to sign in");
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Sign in
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
      
      // Don't manually navigate - let the auth state change handle it
      
    } catch (error: any) {
      console.error('Auth: Error signing in:', error);
      const errorMessage = error.message || "Failed to sign in. Please check your credentials.";
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
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Sign up
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Auth: Sign up error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error("No user returned from sign up");
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
      const errorMessage = error.message || "Failed to create account. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (!authChecked || (loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6 max-w-md">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] mb-4">Verifying authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CoffeeIcon className="h-12 w-12 text-[#8B4513]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#8B4513]">Raw Smith Coffee</CardTitle>
          <CardDescription>Loyalty program sign in</CardDescription>
        </CardHeader>
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
      </Card>
    </div>
  );
};

export default Auth;
