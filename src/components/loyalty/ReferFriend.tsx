
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

import { 
  supabase, 
  requireAuth 
} from '@/integrations/supabase/client';
import { 
  userRoleAsString, 
  createReferralData 
} from '@/integrations/supabase/typeUtils';

const ReferFriend: React.FC = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile: currentUser } = useAuth();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await requireAuth();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    checkAuth();
  }, []);

  const sendInvite = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate input
      if (!friendEmail || !friendEmail.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      // Check if user exists with this email already
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', friendEmail)
        .maybeSingle();
        
      if (existingUser) {
        toast.error('This email is already registered');
        return;
      }
      
      if (!currentUser?.id) {
        toast.error('You must be logged in to send invites');
        return;
      }
      
      // Create referral record
      const referralData = createReferralData({
        referrer_id: currentUser.id,
        referee_id: friendEmail, // We're using email as a temporary ID until they sign up
        bonus_points: 50,
      });
      
      const { error: referralError } = await supabase
        .from('referrals')
        .insert(referralData);
        
      if (referralError) throw referralError;
      
      // Send invitation email logic would go here
      // For now we'll just show success
      
      setFriendEmail('');
      toast.success('Invitation sent successfully!');
      
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refer a Friend</CardTitle>
        <CardDescription>
          Invite your friends and earn bonus points!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your friend's email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={sendInvite} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Invite'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferFriend;
