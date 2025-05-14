
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CoffeeIcon, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  
  // Emergency debug
  console.log('Auth page rendering', { 
    user: user ? 'exists' : 'null', 
    pathname: location.pathname 
  });

  // Set a maximum wait time for initial auth check
  useEffect(() => {
    console.log('Setting up auth check timeout');
    const timeout = setTimeout(() => {
      console.log('Auth check timeout reached, allowing page to render');
      setAuthChecked(true);
      setInitialCheckDone(true);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Check if we're already logged in
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Auth page: Checking if already authenticated");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session and a user, we're already logged in
        if (session?.user) {
          console.log("Auth page: User already authenticated, will redirect");
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        }
      } catch (error) {
        console.error("Auth page: Error checking session:", error);
      } finally {
        setAuthChecked(true);
        setInitialCheckDone(true);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && initialCheckDone) {
      console.log("Auth page: User state detected, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, initialCheckDone]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Auth page: Attempting to sign in");
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      toast.success("Signed in successfully");
      console.log("Auth page: Sign in successful, will refresh profile and redirect");
      
      // Refresh profile to ensure we have the latest data
      if (refreshProfile) {
        try {
          await refreshProfile();
        } catch (err) {
          console.error("Error refreshing profile:", err);
        }
      }
      
      // Use window.location for a full page refresh to clear any stale state
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!firstName || !lastName) {
      toast.error("Please provide your first and last name");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Auth page: Attempting to sign up");
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully! You can now sign in.");
      console.log("Auth page: Sign up successful");
      
      // Clear form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Emergency debugging mode - show info while page is loading
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6 max-w-md">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] mb-4">Verifying authentication status...</p>
          <div className="mt-6 p-4 bg-[#f0f0f0] rounded text-left text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Current URL: {window.location.pathname}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
            <p>Auth Checked: {authChecked ? 'Yes' : 'No'}</p>
          </div>
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
