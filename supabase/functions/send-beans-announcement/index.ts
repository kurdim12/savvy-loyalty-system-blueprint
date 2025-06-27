
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  testEmail?: string;
  sendToAll?: boolean;
}

const createEmailTemplate = (firstName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fresh Beans Arriving Tomorrow!</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #FAF6F0;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      color: #8B4513;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .beans-emoji {
      font-size: 48px;
      margin: 20px 0;
    }
    .title {
      color: #8B4513;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .content {
      font-size: 16px;
      margin: 20px 0;
    }
    .highlight {
      background: linear-gradient(120deg, #8B4513 0%, #D2691E 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 25px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #8B4513;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .cta {
      background: #8B4513;
      color: white;
      padding: 15px 30px;
      border-radius: 25px;
      text-decoration: none;
      display: inline-block;
      margin: 20px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">☕ Raw Smith Coffee</div>
      <div class="beans-emoji">🌱☕🌱</div>
    </div>
    
    <h1 class="title">Fresh Beans Arriving Tomorrow!</h1>
    
    <div class="content">
      <p>Dear ${firstName},</p>
      
      <p>We're thrilled to announce that our freshest batch of premium coffee beans is arriving <strong>tomorrow</strong>!</p>
      
      <div class="highlight">
        <h3 style="margin: 0 0 10px 0;">🎉 What's Coming Tomorrow 🎉</h3>
        <p style="margin: 0;">Freshly roasted, premium quality beans that will transform your coffee experience!</p>
      </div>
      
      <p>As a valued member of our Raw Smith Coffee loyalty program, you'll be among the first to experience these exceptional beans. Whether you're a fan of our smooth medium roasts or prefer the bold intensity of our dark roasts, we have something special waiting for you.</p>
      
      <p><strong>Why you'll love these beans:</strong></p>
      <ul>
        <li>🌟 Freshly roasted for maximum flavor</li>
        <li>🌍 Ethically sourced from premium coffee regions</li>
        <li>☕ Perfect for your loyalty program points redemption</li>
        <li>🎯 Carefully selected for the Raw Smith Coffee experience</li>
      </ul>
      
      <p>Visit us tomorrow to get the first taste of these amazing beans. Don't forget - as a loyalty member, you'll earn points with every purchase!</p>
    </div>
    
    <div class="footer">
      <p><strong>Raw Smith Coffee</strong><br>
      Where every cup tells a story</p>
      <p>Thank you for being part of our coffee community!</p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testEmail, sendToAll }: EmailRequest = await req.json();
    
    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let recipients: Array<{email: string, firstName: string}> = [];
    let results = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    if (testEmail) {
      // Test mode - send to specific email
      console.log(`Sending test email to: ${testEmail}`);
      recipients = [{
        email: testEmail,
        firstName: 'Coffee Lover' // Default name for test
      }];
    } else if (sendToAll) {
      // Production mode - send to all customers
      console.log('Fetching all customer emails...');
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email, first_name')
        .eq('role', 'customer')
        .not('email', 'is', null);

      if (error) {
        throw new Error(`Failed to fetch customer emails: ${error.message}`);
      }

      recipients = profiles.map(profile => ({
        email: profile.email,
        firstName: profile.first_name || 'Coffee Lover'
      }));
      
      console.log(`Found ${recipients.length} customers to email`);
    } else {
      throw new Error('Must specify either testEmail or sendToAll=true');
    }

    results.total = recipients.length;

    // Send emails
    for (const recipient of recipients) {
      try {
        console.log(`Sending email to: ${recipient.email}`);
        
        const emailResponse = await resend.emails.send({
          from: "Raw Smith Coffee <onboarding@resend.dev>",
          to: [recipient.email],
          subject: "🌱 Fresh Beans Arriving Tomorrow at Raw Smith Coffee!",
          html: createEmailTemplate(recipient.firstName),
        });

        console.log(`Email sent successfully to ${recipient.email}:`, emailResponse);
        results.successful++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (emailError: any) {
        console.error(`Failed to send email to ${recipient.email}:`, emailError);
        results.failed++;
        results.errors.push(`${recipient.email}: ${emailError.message}`);
      }
    }

    console.log('Email sending completed:', results);

    return new Response(JSON.stringify({
      success: true,
      message: testEmail ? 'Test email sent successfully!' : 'Bulk email campaign completed!',
      results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-beans-announcement function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
