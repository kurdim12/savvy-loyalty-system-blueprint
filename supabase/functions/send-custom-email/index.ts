
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { PasswordResetEmail } from './_templates/password-reset.tsx'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Custom email function called')
    
    const payload = await req.text()
    console.log('Webhook payload received:', payload)
    
    // Parse the webhook payload
    let webhookData
    try {
      webhookData = JSON.parse(payload)
    } catch (parseError) {
      console.error('Failed to parse webhook payload:', parseError)
      return new Response('Invalid JSON payload', { status: 400, headers: corsHeaders })
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type, site_url },
    } = webhookData

    console.log('Email action type:', email_action_type)
    console.log('User email:', user.email)

    let emailHtml: string
    let subject: string
    let fromEmail = 'Raw Smith Coffee <noreply@rawsmithcoffee.com>'

    // Handle different types of auth emails
    if (email_action_type === 'recovery') {
      // Password reset email
      const resetLink = `https://raw-smith-loyalty.lovable.app/auth?token=${token_hash}&type=recovery&redirect_to=${redirect_to}`
      
      emailHtml = await renderAsync(
        React.createElement(PasswordResetEmail, {
          resetLink,
          userEmail: user.email,
        })
      )
      subject = 'Reset your Raw Smith Coffee password'
      
    } else if (email_action_type === 'signup' || email_action_type === 'email_change') {
      // Welcome/confirmation email
      const confirmationLink = `https://raw-smith-loyalty.lovable.app/auth?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`
      
      emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, {
          confirmationLink,
          userEmail: user.email,
          userName: user.user_metadata?.first_name || '',
        })
      )
      subject = email_action_type === 'signup' 
        ? 'Welcome to Raw Smith Coffee - Confirm your account'
        : 'Confirm your email change - Raw Smith Coffee'
        
    } else {
      console.log('Unhandled email action type:', email_action_type)
      return new Response('Unhandled email type', { status: 400, headers: corsHeaders })
    }

    console.log('Sending email with subject:', subject)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })

  } catch (error: any) {
    console.error('Error in send-custom-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to send email',
          details: error,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
