import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { referrerUserId, friendEmail } = await req.json();

    if (!referrerUserId || !friendEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get referrer details
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, referral_code')
      .eq('id', referrerUserId)
      .single();

    if (referrerError || !referrer) {
      console.error('Error fetching referrer:', referrerError);
      return new Response(
        JSON.stringify({ error: 'Referrer not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Send email invitation using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const emailData = {
      from: 'Raw Smith Coffee <noreply@rawsmithcoffee.com>',
      to: [friendEmail],
      subject: `${referrer.first_name} invited you to Raw Smith Coffee!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">You're invited to Raw Smith Coffee!</h2>
          <p>Hi there!</p>
          <p><strong>${referrer.first_name} ${referrer.last_name}</strong> has invited you to join the Raw Smith Coffee loyalty program.</p>
          <p>Join now and both of you will earn bonus loyalty points!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://your-app.lovable.app'}/auth?ref=${referrer.referral_code}" 
               style="background-color: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Join Raw Smith Coffee
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            When you sign up using this link, you'll get welcome bonus points and ${referrer.first_name} will earn referral points too!
          </p>
          <p style="font-size: 12px; color: #999;">
            This invitation was sent to ${friendEmail}. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error('Email sending failed:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send invitation email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Referral invitation sent to ${friendEmail} from ${referrer.email}`);

    return new Response(
      JSON.stringify({ 
        message: 'Invitation sent successfully',
        referrer: referrer.first_name 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-referral-invitation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});