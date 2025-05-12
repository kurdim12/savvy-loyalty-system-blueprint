
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, cleanupAuthState, sanitizeInput } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  // Check if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Already logged in, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  // Input validation function
  const validateInputs = (isSignUp = false) => {
    const errors: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
    } = {};
    
    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // First and last name validation for signup only
    if (isSignUp) {
      if (!firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      
      if (!lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);

    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out before new sign in
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sanitize inputs for security
      const sanitizedEmail = sanitizeInput(email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
      } else if (data?.user) {
        toast.success('Signed in successfully');
        // Force page reload for clean state
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs(true)) {
      return;
    }
    
    setLoading(true);

    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Sanitize inputs for security
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedFirstName = sanitizeInput(firstName);
      const sanitizedLastName = sanitizeInput(lastName);
      
      // Rate limiting - add slight delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail.trim(),
        password,
        options: {
          data: {
            first_name: sanitizedFirstName.trim(),
            last_name: sanitizedLastName.trim(),
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email for verification.');
        // Reset form fields after successful signup
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] p-4">
      <Card className="w-full max-w-md shadow-lg border-[#8B4513]/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Raw Smith Coffee" 
              className="h-24 md:h-28 w-auto" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#8B4513]">Raw Smith Coffee</CardTitle>
          <CardDescription className="text-[#6F4E37]">Loyalty Program</CardDescription>
        </CardHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#FFF8DC]">
            <TabsTrigger 
              value="signin" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-[#6F4E37]">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    aria-invalid={validationErrors.email ? 'true' : 'false'}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-[#6F4E37]">Password</Label>
                  <Input 
                    id="signin-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    aria-invalid={validationErrors.password ? 'true' : 'false'}
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="flex w-full justify-center">
                  <Link 
                    to="/admin/login" 
                    className="text-sm text-[#8B4513] hover:text-[#6F4E37] hover:underline"
                  >
                    Admin Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-[#6F4E37]">First Name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="John" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                      className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      aria-invalid={validationErrors.firstName ? 'true' : 'false'}
                    />
                    {validationErrors.firstName && (
                      <p className="text-sm text-red-500">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-[#6F4E37]">Last Name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Doe" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                      className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      aria-invalid={validationErrors.lastName ? 'true' : 'false'}
                    />
                    {validationErrors.lastName && (
                      <p className="text-sm text-red-500">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[#6F4E37]">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    aria-invalid={validationErrors.email ? 'true' : 'false'}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-[#6F4E37]">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={6}
                    className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    aria-invalid={validationErrors.password ? 'true' : 'false'}
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                
                <div className="flex w-full justify-center">
                  <Link 
                    to="/admin/login" 
                    className="text-sm text-[#8B4513] hover:text-[#6F4E37] hover:underline"
                  >
                    Admin Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
