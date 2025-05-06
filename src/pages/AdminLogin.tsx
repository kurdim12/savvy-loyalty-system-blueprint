
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

// Helper function to clean up auth state completely
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

// Form schema for admin login
const loginFormSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);

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

  const handleCreateAdmin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Call the edge function to create an admin user
      const { data, error } = await supabase.functions.invoke('create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.success) {
        setCreated(true);
        if (data.credentials) {
          setCredentials(data.credentials);
        }
        toast.success('Admin user created successfully');
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
    setLoading(true);
    setError(null);

    try {
      // Clean up existing state
      cleanupAuthState();
      
      const result = await verifyAdminCredentials(values.email, values.password);
      
      if (result.success) {
        toast.success('Logged in as admin');
        navigate('/admin');
      } else {
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
  
  const handleDefaultLogin = async () => {
    if (!credentials) return;
    
    form.setValue('email', credentials.email);
    form.setValue('password', credentials.password);
    
    await handleLogin({
      email: credentials.email,
      password: credentials.password
    });
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
          
          {created ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Admin account created successfully! Use these credentials to log in:
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <p><strong>Email:</strong> {credentials?.email}</p>
                    <p><strong>Password:</strong> {credentials?.password}</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleDefaultLogin}
                className="w-full bg-amber-700 hover:bg-amber-800"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login with Created Admin'}
              </Button>
              
              <div className="text-center text-sm text-amber-700">
                <p>Make sure to save these credentials in a secure place.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
              
              <div className="text-center">
                <p className="text-sm text-amber-700 mb-2">No admin account yet?</p>
                <Button
                  variant="outline"
                  onClick={handleCreateAdmin}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating Admin...' : 'Create Admin Account'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
