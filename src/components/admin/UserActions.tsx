
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

      const userId = profile.id;

      // Delete related data in the correct order to avoid foreign key constraints
      console.log('Deleting user-related data...');

      // Delete transactions
      const { error: transactionsError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId);

      if (transactionsError) {
        console.error('Error deleting transactions:', transactionsError);
      }

      // Delete redemptions
      const { error: redemptionsError } = await supabase
        .from('redemptions')
        .delete()
        .eq('user_id', userId);

      if (redemptionsError) {
        console.error('Error deleting redemptions:', redemptionsError);
      }

      // Delete notifications
      const { error: notificationsError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (notificationsError) {
        console.error('Error deleting notifications:', notificationsError);
      }

      // Delete messages
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', userId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
      }

      // Delete other user-related data
      await supabase.from('community_goal_contributions').delete().eq('user_id', userId);
      await supabase.from('song_votes').delete().eq('user_id', userId);
      await supabase.from('photo_contest_votes').delete().eq('user_id', userId);
      await supabase.from('coffee_journey').delete().eq('user_id', userId);
      await supabase.from('coffee_education_progress').delete().eq('user_id', userId);
      await supabase.from('user_connections').delete().eq('user_id', userId);
      await supabase.from('user_connections').delete().eq('connected_user_id', userId);
      await supabase.from('challenge_participants').delete().eq('user_id', userId);
      await supabase.from('referrals').delete().eq('referrer_id', userId);
      await supabase.from('referrals').delete().eq('referee_id', userId);

      // Finally, delete the profile
      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (deleteProfileError) {
        throw deleteProfileError;
      }

      // Try to delete the auth user (this might fail if already deleted, which is ok)
      try {
        const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteAuthError) {
          console.log('Auth user deletion note:', deleteAuthError.message);
        }
      } catch (authError) {
        console.log('Auth user may have already been deleted');
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
      console.log('Sending custom password reset email to:', email.trim());
      
      // Use our custom edge function instead of Supabase's default
      const { data, error: functionError } = await supabase.functions.invoke('send-password-reset', {
        body: { email: email.trim() }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success('Password reset email sent successfully with custom branding!');
    } catch (err: any) {
      console.error('Error sending custom password reset:', err);
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
            This will remove all user data including transactions, messages, and profile information.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default UserActions;
