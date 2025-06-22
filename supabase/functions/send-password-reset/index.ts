
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { Resend } from "npm:resend@4.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Simple password reset email template
const PasswordResetEmailSimple = ({ resetLink, userEmail }: { resetLink: string, userEmail: string }) => 
  `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset your Raw Smith Coffee password</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAF6F0;">
  <div style="text-align: center; margin-bottom: 40px;">
    <img src="https://raw-smith-loyalty.lovable.app/logo.png" alt="Raw Smith Coffee" style="width: 120px; height: 120px;">
  </div>
  
  <h1 style="color: #8B4513; text-align: center; font-size: 32px; margin-bottom: 30px;">Reset Your Password</h1>
  
  <p style="color: #6F4E37; font-size: 16px; line-height: 24px;">Hello,</p>
  
  <p style="color: #6F4E37; font-size: 16px; line-height: 24px;">
    We received a request to reset the password for your Raw Smith Coffee account (${userEmail}).
  </p>
  
  <div style="text-align: center; margin: 32px 0;">
    <a href="${resetLink}" style="background-color: #8B4513; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
  </div>
  
  <p style="color: #6F4E37; font-size: 16px; line-height: 24px;">This link will expire in 24 hours for security reasons.</p>
  
  <p style="color: #6F4E37; font-size: 16px; line-height: 24px;">
    If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
  </p>
  
  <p style="color: #6F4E37; font-size: 16px; line-height: 24px; margin-top: 32px;">
    Best regards,<br>
    The Raw Smith Coffee Team
  </p>
  
  <div style="border-top: 1px solid #eaeaea; padding-top: 16px; margin-top: 32px; text-align: center;">
    <p style="color: #8a8a8a; font-size: 12px;">
      This email was sent to ${userEmail}. If you have any questions, please contact us at support@rawsmithcoffee.com
    </p>
  </div>
</body>
</html>`

interface PasswordResetRequest {
  email: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email }: PasswordResetRequest = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    console.log('Sending password reset email to:', email)

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate password reset link with correct deployed domain
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `https://raw-smith-loyalty.lovable.app/auth`
      }
    })

    if (error) {
      console.error('Error generating reset link:', error)
      throw error
    }

    if (!data.properties?.action_link) {
      throw new Error('Failed to generate reset link')
    }

    const resetLink = data.properties.action_link
    console.log('Generated reset link:', resetLink)

    // Send email using Resend with verified domain
    const emailHtml = PasswordResetEmailSimple({ resetLink, userEmail: email })

    const emailResponse = await resend.emails.send({
      from: "Raw Smith Coffee <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your Raw Smith Coffee password",
      html: emailHtml,
    })

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error)
      throw emailResponse.error
    }

    console.log("Password reset email sent successfully:", emailResponse.data)

    return new Response(JSON.stringify({ success: true, message: "Password reset email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send password reset email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
}

serve(handler)
