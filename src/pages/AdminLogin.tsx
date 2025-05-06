
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);

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
  
  const handleLogin = async () => {
    if (!credentials) return;
    
    setLoading(true);
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out before new sign in
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      toast.success('Logged in as admin');
      // Force page reload for clean state
      window.location.href = '/admin';
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error('Login failed. Please try manually.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-900">Admin Account Setup</CardTitle>
          <CardDescription>Create a default admin account for Raw Smith Coffee</CardDescription>
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
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Go to Login Page
                </Button>
                
                <Button 
                  onClick={handleLogin}
                  disabled={loading}
                >
                  Login Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-amber-700">
                This will create a default admin account with predefined credentials.
              </p>
              
              <Button
                className="w-full bg-amber-700 hover:bg-amber-800"
                onClick={handleCreateAdmin}
                disabled={loading}
              >
                {loading ? 'Creating Admin...' : 'Create Admin Account'}
              </Button>
              
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/auth')}
                >
                  Return to Login
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
