
import { useState } from 'react';
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
import { useEffect } from 'react';

// Form schema for admin login
const loginFormSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Hardcoded admin credentials as per requirements
const DEFAULT_ADMIN_EMAIL = "admin@rawsmithcoffee.com";
const DEFAULT_ADMIN_PASSWORD = "RawSmith2024!";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAdmin, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form definition
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If user is already an admin, redirect to admin dashboard
  useEffect(() => {
    if (isAdmin && user) {
      navigate('/admin');
    }
  }, [isAdmin, user, navigate]);

  const handleLogin = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    setError(null);

    try {
      // Clean up existing state
      const cleanupAuthState = () => {
        localStorage.removeItem('supabase.auth.token');
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      cleanupAuthState();
      
      // Check if using default admin credentials
      const isDefaultAdmin = 
        values.email === DEFAULT_ADMIN_EMAIL && 
        values.password === DEFAULT_ADMIN_PASSWORD;
      
      let result;
      
      if (isDefaultAdmin) {
        // For default admin, we'll always try to authenticate and create if needed
        try {
          // First try to sign in with default credentials
          result = await verifyAdminCredentials(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
          
          // If login fails but it's because the user doesn't exist, create the admin account
          if (!result.success && result.error?.includes("Invalid login credentials")) {
            // Create default admin account
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: DEFAULT_ADMIN_EMAIL,
              password: DEFAULT_ADMIN_PASSWORD,
              options: {
                data: {
                  first_name: "Admin",
                  last_name: "User",
                }
              }
            });
            
            if (signUpError) {
              console.error("Error creating default admin:", signUpError);
              throw signUpError;
            }
            
            if (signUpData.user) {
              // Set the user's role to admin
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', signUpData.user.id);
                
              if (updateError) {
                console.error("Error setting admin role:", updateError);
                throw updateError;
              }
              
              // Try logging in again
              result = await verifyAdminCredentials(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
            }
          }
        } catch (err) {
          console.error("Error with default admin:", err);
          result = { success: false, error: "Error processing default admin" };
        }
      } else {
        // Regular login attempt
        result = await verifyAdminCredentials(values.email, values.password);
      }
      
      if (result.success) {
        // Refresh profile to ensure admin status is reflected
        await refreshProfile();
        toast.success('Logged in as admin');
        
        // Short delay to allow profile refresh to complete
        setTimeout(() => {
          navigate('/admin');
        }, 500);
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

  const loginWithDefaultAdmin = () => {
    form.setValue("email", DEFAULT_ADMIN_EMAIL);
    form.setValue("password", DEFAULT_ADMIN_PASSWORD);
    handleLogin({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD
    });
  };
  
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
          <CardDescription className="text-[#6F4E37]">Secure access for Raw Smith Coffee administrators</CardDescription>
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
                        placeholder="admin@rawsmithcoffee.com" 
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
              
              <div className="text-center mt-2">
                <Button
                  type="button"
                  variant="link"
                  className="text-[#8B4513] hover:text-[#6F4E37]"
                  onClick={loginWithDefaultAdmin}
                  disabled={loading}
                >
                  Use Default Admin Credentials
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="text-center text-sm text-[#6F4E37] mt-4">
            <p>Default credentials:</p>
            <p>Email: admin@rawsmithcoffee.com</p>
            <p>Password: RawSmith2024!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
