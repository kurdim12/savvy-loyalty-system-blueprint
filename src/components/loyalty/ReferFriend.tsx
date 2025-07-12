
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, sanitizeInput } from '@/integrations/supabase/client';
import { Share2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

export default function ReferFriend() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your friend's email address");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to refer a friend");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize input for security
      const sanitizedEmail = sanitizeInput(email);
      
      // Check if the email is already registered
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', sanitizedEmail as string)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingUser) {
        toast.error("This user is already registered with Raw Smith Coffee");
        return;
      }
      
      // Create a referral record
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referee_id: user.id, // Temporary, will be updated when friend signs up
          referee_email: sanitizedEmail,
          bonus_points: 15,
          status: 'pending'
        })
        .select('id')
        .single();
        
      if (referralError) throw referralError;
      
      // Send email invitation
      const { error: inviteError } = await supabase.functions.invoke('send-referral-invitation', {
        body: {
          referrerUserId: user.id,
          friendEmail: sanitizedEmail
        }
      });
      
      if (inviteError) {
        console.error('Email invitation failed:', inviteError);
        // Don't throw here - referral is still created, just email failed
        toast.warning("Referral created but email failed to send. You can share your link manually.");
      }
      
      toast.success("Invitation sent to your friend! You'll receive 15 points when they sign up.");
      setEmail('');
    } catch (error) {
      console.error('Error referring friend:', error);
      toast.error("Unable to send invitation. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareLink = async () => {
    if (!user) {
      toast.error("You must be logged in to share a referral link");
      return;
    }
    
    try {
      // Generate a unique referral code using user's referral code
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();
      
      if (!userProfile?.referral_code) {
        throw new Error('User referral code not found');
      }
      
      // Create a shareable URL with the user's referral code
      const referralLink = `${window.location.origin}/auth?ref=${userProfile.referral_code}`;
      
      // Try to use the Web Share API if available and supported
      if (navigator.share && navigator.canShare) {
        try {
          await navigator.share({
            title: 'Join Raw Smith Coffee Loyalty Program',
            text: 'Sign up for Raw Smith Coffee and we both earn loyalty points!',
            url: referralLink
          });
          return; // Successfully shared
        } catch (shareError) {
          // Web Share failed, fall back to clipboard
          console.log('Web Share failed, falling back to clipboard:', shareError);
        }
      }
      
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied to clipboard!");
      } catch (clipboardError) {
        // If clipboard API fails, create a text input and select it
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast.success("Referral link copied to clipboard!");
        } catch (copyError) {
          toast.error("Unable to copy link. Please try again.");
        }
        
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Error generating sharing link:', error);
      toast.error("Unable to create sharing link. Please try again.");
    }
  };
  
  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Share2 className="h-5 w-5 text-[#8B4513]" />
          Refer a Friend
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Invite friends to join Raw Smith Coffee and earn 15 bonus points when they sign up!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#6F4E37]">Friend's Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              required
              className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#8B4513] hover:bg-[#6F4E37] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-0">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#8B4513]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-[#6F4E37]">Or</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-[#8B4513]/20 text-[#8B4513] hover:bg-[#FFF8DC] hover:text-[#6F4E37]" 
          onClick={handleShareLink}
        >
          Share Referral Link
        </Button>
      </CardFooter>
    </Card>
  );
}
