
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      
      // Use the improved verifyAdminCredentials function
      const result = await verifyAdminCredentials(values.email, values.password);
      
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
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-900">Admin Login</CardTitle>
          <CardDescription>Secure access for Raw Smith Coffee administrators</CardDescription>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@rawsmith.coffee" 
                        {...field} 
                        type="email"
                        autoComplete="username"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        autoComplete="current-password" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
