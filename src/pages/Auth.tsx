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
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cleanupAuthState } from '@/lib/auth-utils';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  // Password reset states
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  // Get referral code from URL params
  const urlParams = new URLSearchParams(location.search);
  const referralCode = urlParams.get('ref');
  
  // Redirect tracking
  const hasRedirected = useRef(false);
  
  // Check for password reset tokens on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hash = location.hash;
    
    // Check URL params for recovery tokens
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const type = urlParams.get('type');
    
    // Check hash for recovery tokens (alternative format)
    const hashParams = new URLSearchParams(hash.replace('#', ''));
    const hashAccessToken = hashParams.get('access_token');
    const hashRefreshToken = hashParams.get('refresh_token');
    const hashType = hashParams.get('type');
    
    const isRecovery = type === 'recovery' || hashType === 'recovery';
    const token = accessToken || hashAccessToken;
    const refresh = refreshToken || hashRefreshToken;
    
    if (isRecovery && token && refresh) {
      console.log('Password reset tokens detected');
      setIsPasswordReset(true);
      
      // Set the session with recovery tokens
      supabase.auth.setSession({
        access_token: token,
        refresh_token: refresh,
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting recovery session:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
          setIsPasswordReset(false);
        } else {
          console.log('Recovery session set successfully');
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }
  }, [location.search, location.hash]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading && !hasRedirected.current && !isPasswordReset) {
      console.log('Auth: User already authenticated, redirecting');
      hasRedirected.current = true;
      
      // Get intended destination or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    
    if (!user) {
      hasRedirected.current = false;
    }
  }, [user, loading, navigate, location.state, isPasswordReset]);

  // Password validation effect
  useEffect(() => {
    if (activeTab === 'signup') {
      setPasswordValidation({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
      });
    }
  }, [password, activeTab]);

  // Clear errors when switching tabs or typing
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [activeTab, email, password]);

  const validateSignUpForm = () => {
    if (!firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Clean up any existing auth state before signing in
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout attempt completed');
      }
      
      console.log('Auth: Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.error('Auth: Sign in error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned from sign in');
      }
      
      console.log('Auth: Sign in successful');
      setSuccess('Signed in successfully! Redirecting...');
      toast.success('Welcome back!');
      
      // Force a page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (error: any) {
      console.error('Auth: Sign in error:', error);
      
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
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
    
    if (!validateSignUpForm()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      console.log('Auth: Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      
      if (error) {
        console.error('Auth: Sign up error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned from sign up');
      }
      
      // Process referral if provided
      if (referralCode && data.user) {
        try {
          console.log('Processing referral code:', referralCode);
          
          const { data: referrer, error: referrerError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('referral_code', referralCode)
            .maybeSingle();
          
          if (referrerError) {
            console.log('Referral code lookup error:', referrerError);
          } else if (referrer) {
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
                status: 'completed',
              });
            
            if (!referralError) {
              // Award points to both users
              await Promise.all([
                supabase.functions.invoke('earn-points', {
                  body: {
                    uid: referrer.id,
                    points: 15,
                    notes: `Referral bonus for inviting ${firstName} ${lastName}`,
                  },
                }),
                supabase.functions.invoke('earn-points', {
                  body: {
                    uid: data.user.id,
                    points: 10,
                    notes: `Welcome bonus (referred by ${referrer.first_name})`,
                  },
                }),
              ]);
              
              console.log('Referral processed successfully');
            }
          }
        } catch (error) {
          console.error('Error processing referral:', error);
          // Continue even if referral fails
        }
      }
      
      console.log('Auth: Sign up successful');
      setSuccess('Account created successfully! Please check your email to verify your account before signing in.');
      toast.success('Account created! Check your email for verification.');
      
      // Clear form and switch to sign in
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setActiveTab('signin');
      
    } catch (error: any) {
      console.error('Auth: Sign up error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
        setActiveTab('signin');
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message?.includes('Signup is disabled')) {
        errorMessage = 'New registrations are currently disabled. Please contact support.';
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
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsResettingPassword(true);
    
    try {
      console.log('Sending password reset email to:', forgotPasswordEmail.trim());
      
      // Use the custom edge function for better email delivery
      const { error } = await supabase.functions.invoke('send-password-reset', {
        body: {
          email: forgotPasswordEmail.trim()
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent! Please check your inbox.');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
      setSuccess('Password reset email sent! Please check your inbox and follow the instructions.');
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      
      let errorMessage = 'Failed to send password reset email';
      if (error.message?.includes('For security purposes')) {
        errorMessage = 'For security purposes, we cannot confirm if this email exists. If you have an account, you will receive a reset email.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsUpdatingPassword(true);
    setError(null);
    
    try {
      console.log('Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Password updated successfully');
      toast.success('Password updated successfully! You can now sign in with your new password.');
      setSuccess('Password updated successfully! Redirecting to dashboard...');
      
      // Clear password reset state
      setIsPasswordReset(false);
      setNewPassword('');
      setConfirmNewPassword('');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (error.message?.includes('session_not_found')) {
        errorMessage = 'Your password reset session has expired. Please request a new password reset link.';
        setIsPasswordReset(false);
      } else if (error.message?.includes('same_password')) {
        errorMessage = 'Please choose a different password from your current one.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-amber-200">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-6" />
          <p className="text-amber-800 text-lg font-medium">Loading...</p>
          <p className="text-amber-600 text-sm mt-2">Initializing authentication</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/3065d86c-e6b8-4d0f-b9d5-c9b3445ce445.png" 
                alt="Raw Smith Coffee" 
                className="h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <CardTitle className="text-3xl font-bold text-amber-800">Raw Smith Coffee</CardTitle>
            <CardDescription className="text-amber-600">
              {referralCode ? "Join via referral and earn bonus points!" : "Access your loyalty account"}
            </CardDescription>
            {referralCode && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  🎉 Referral detected! Sign up to earn welcome bonus points.
                </p>
              </div>
            )}
          </CardHeader>

          {isPasswordReset ? (
            <form onSubmit={handlePasswordReset}>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">Set New Password</h3>
                  <p className="text-sm text-amber-600">
                    Please enter your new password below.
                  </p>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                    <Input 
                      id="newPassword" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password" 
                      className="pl-11 pr-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isUpdatingPassword}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-amber-500 hover:text-amber-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                    <Input 
                      id="confirmNewPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password" 
                      className="pl-11 pr-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      disabled={isUpdatingPassword}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-amber-500 hover:text-amber-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => {
                    setIsPasswordReset(false);
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={isUpdatingPassword}
                >
                  Cancel
                </Button>
              </CardFooter>
            </form>
          ) : showForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">Reset Password</h3>
                  <p className="text-sm text-amber-600">
                    Enter your email address and we'll send you a secure link to reset your password.
                  </p>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                    <Input 
                      id="resetEmail" 
                      type="email" 
                      placeholder="your@email.com" 
                      className="pl-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      disabled={isResettingPassword}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={isResettingPassword}
                >
                  Back to Sign In
                </Button>
              </CardFooter>
            </form>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full h-12 bg-amber-100">
                <TabsTrigger value="signin" className="h-10 data-[state=active]:bg-white data-[state=active]:text-amber-800">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="h-10 data-[state=active]:bg-white data-[state=active]:text-amber-800">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-0">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-6 pt-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                        <Input 
                          id="signin-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          className="pl-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm text-amber-600 hover:text-amber-700"
                          onClick={() => {
                            setShowForgotPassword(true);
                            setError(null);
                            setSuccess(null);
                          }}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                        <Input 
                          id="signin-password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password" 
                          className="pl-11 pr-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-amber-500 hover:text-amber-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-0">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-6 pt-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                          <Input 
                            id="firstName" 
                            placeholder="John" 
                            className="pl-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            disabled={isLoading}
                            autoComplete="given-name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          className="pl-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                        <Input 
                          id="signup-password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password" 
                          className="pl-11 pr-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-amber-500 hover:text-amber-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      
                      {password && (
                        <div className="mt-2 space-y-1 text-sm">
                          <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-amber-600'}`}>
                            <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.length ? 'text-green-600' : 'text-gray-400'}`} />
                            At least 8 characters
                          </div>
                          <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-amber-600'}`}>
                            <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-400'}`} />
                            One uppercase letter
                          </div>
                          <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-amber-600'}`}>
                            <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-400'}`} />
                            One lowercase letter
                          </div>
                          <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-amber-600'}`}>
                            <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.number ? 'text-green-600' : 'text-gray-400'}`} />
                            One number
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
                        <Input 
                          id="confirm-password" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password" 
                          className="pl-11 pr-11 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-amber-500 hover:text-amber-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-sm text-red-600">Passwords do not match</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </Card>
        
        <div className="mt-6 text-center text-sm text-amber-600">
          <p>
            By signing up, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;