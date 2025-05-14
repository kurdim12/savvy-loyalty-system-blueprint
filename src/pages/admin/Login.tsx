
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { verifyAdminCredentials } from '@/integrations/supabase/functions';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema for admin login
const loginFormSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Admin credentials for first login
const ADMIN_EMAIL = "rawsmith@admin.com";
const ADMIN_PASSWORD = "rawsmith123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAdmin, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [authCheckComplete, setAuthCheckComplete] = useState<boolean>(false);

  // Form definition
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check authentication status once
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      if (isAdmin && user) {
        navigate('/admin', { replace: true });
      } else {
        if (mounted) {
          setAuthCheckComplete(true);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, [isAdmin, user, navigate]);

  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleCreateAdmin = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Call the edge function to create an admin user
      const { data, error } = await supabase.functions.invoke('create-admin', {
        method: 'POST',
      });
      
      if (error) {
        throw error;
      }
      
      if (data.success) {
        setAccountCreated(true);
        toast.success('Admin account created successfully!');
        
        // Pre-fill login form with admin credentials
        form.setValue('email', ADMIN_EMAIL);
        form.setValue('password', ADMIN_PASSWORD);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setError('Failed to create admin account. Please try again.');
      toast.error('Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values: z.infer<typeof loginFormSchema>) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Try to sign in with these credentials
      let result = await verifyAdminCredentials(values.email, values.password);
      
      // If admin login fails due to invalid credentials, try to create the account
      // but only if using the default admin credentials
      if (!result.success && 
          values.email === ADMIN_EMAIL && 
          values.password === ADMIN_PASSWORD) {
        
        // Try to create the admin account
        const { data, error } = await supabase.functions.invoke('create-admin', {
          method: 'POST',
        });
        
        if (!error && data.success) {
          toast.success('Admin account created! Logging you in...');
          
          // Try logging in again after account creation
          result = await verifyAdminCredentials(ADMIN_EMAIL, ADMIN_PASSWORD);
        }
      }
      
      if (result.success) {
        // Refresh profile to ensure admin status is reflected
        await refreshProfile();
        toast.success('Logged in as admin');
        
        // Use location.href for complete page refresh
        window.location.href = '/admin';
      } else {
        console.error('Login error:', result.error);
        setError(result.error || 'Invalid credentials');
        toast.error(result.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    await handleLogin(values);
  };

  const loginWithAdminCredentials = () => {
    if (loading) return;
    
    form.setValue("email", ADMIN_EMAIL);
    form.setValue("password", ADMIN_PASSWORD);
    handleLogin({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
  };
  
  // Show loading spinner while checking auth
  if (!authCheckComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FAF6F0] to-[#FFF8DC]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FAF6F0] to-[#FFF8DC] p-4">
      <Card className="w-full max-w-md shadow-lg border-[#8B4513]/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Raw Smith Coffee" 
              className="h-24 md:h-28 w-auto" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#8B4513]">Admin Login</CardTitle>
          <CardDescription className="text-[#6F4E37]">
            {accountCreated 
              ? "Admin account created! Log in with the credentials below." 
              : "Secure access for Raw Smith Coffee administrators"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#6F4E37]">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="rawsmith@admin.com" 
                        {...field} 
                        type="email"
                        autoComplete="username"
                        className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#6F4E37]">Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        autoComplete="current-password" 
                        className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit"
                className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </form>
          </Form>
          
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#8B4513]/20"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#FAF6F0] px-2 text-[#6F4E37]">or</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleCreateAdmin}
              disabled={loading}
              className="border-[#8B4513]/20 hover:bg-[#8B4513]/10"
            >
              {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </Button>
            
            <Button
              variant="outline"
              onClick={loginWithAdminCredentials}
              disabled={loading}
              className="border-[#8B4513]/20 hover:bg-[#8B4513]/10"
            >
              Use Default Admin Credentials
            </Button>
          </div>
          
          <div className="text-center text-xs text-[#6F4E37] mt-4">
            <p>Default admin credentials:</p>
            <p className="font-medium">rawsmith@admin.com / rawsmith123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
