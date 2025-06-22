
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Mail, AlertTriangle } from 'lucide-react';

const UserActions = () => {
  const [email, setEmail] = useState('alisameer.abdelhafez@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteUser = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, get the user ID from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .single();

      if (profileError || !profile) {
        throw new Error('User not found');
      }

      // Delete the user profile first (this should cascade to related tables)
      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (deleteProfileError) {
        throw deleteProfileError;
      }

      // Call admin API to delete the auth user
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(profile.id);

      if (deleteAuthError) {
        console.error('Auth user deletion error:', deleteAuthError);
        // The profile is already deleted, so we'll just log this error
      }

      toast.success('User deleted successfully');
      setEmail('');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(`Failed to delete user: ${err.message}`);
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent successfully');
    } catch (err: any) {
      console.error('Error sending password reset:', err);
      setError(`Failed to send password reset: ${err.message}`);
      toast.error('Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          User Management Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">User Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleSendPasswordReset}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Password Reset Email'}
          </Button>

          <Button
            onClick={handleDeleteUser}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Deleting a user is permanent and cannot be undone. 
            Consider sending a password reset email first.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default UserActions;
