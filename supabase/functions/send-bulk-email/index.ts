
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BulkEmailRequest {
  subject: string
  message: string
  fromName?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Bulk email function called')
    
    // Validate Resend API key
    if (!Deno.env.get('RESEND_API_KEY')) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { subject, message, fromName = 'Raw Smith Coffee' }: BulkEmailRequest = await req.json()
    
    // Validate request data
    if (!subject?.trim()) {
      throw new Error('Subject is required')
    }
    if (!message?.trim()) {
      throw new Error('Message is required')
    }
    if (!fromName?.trim()) {
      throw new Error('From name is required')
    }
    
    console.log('Email request:', { subject, fromName, messageLength: message.length })

    // Get all users from the database
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('email, first_name')
      .not('email', 'is', null)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw new Error('Failed to fetch user profiles')
    }

    if (!profiles || profiles.length === 0) {
      console.log('No users found to send emails to')
      return new Response(
        JSON.stringify({ success: false, message: 'No users found' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log(`Found ${profiles.length} users to send emails to`)

    // Send emails with rate limiting (5 emails per batch with delays)
    const results = []
    const batchSize = 5
    const delayBetweenBatches = 1000 // 1 second delay

    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize)
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}, users ${i + 1}-${Math.min(i + batchSize, profiles.length)}`)

      const batchPromises = batch.map(async (profile) => {
        try {
          // Validate profile data
          if (!profile.email) {
            return { email: 'invalid', success: false, error: 'Missing email address' }
          }
          
          const personalizedMessage = message.replace(/\{firstName\}/g, profile.first_name || 'Valued Customer')
          
          const { data, error } = await resend.emails.send({
            from: `${fromName} <noreply@raw-smith-loyalty.com>`,
            to: [profile.email],
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
                <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Raw Smith Coffee</h1>
                </div>
                <div style="padding: 30px; background: #fff;">
                  <h2 style="color: #92400e; margin-top: 0; font-size: 24px;">Hello ${profile.first_name || 'Valued Customer'}!</h2>
                  <div style="color: #374151; line-height: 1.8; font-size: 16px; margin: 20px 0;">
                    ${personalizedMessage.replace(/\n/g, '<br>')}
                  </div>
                  <div style="margin-top: 40px; padding: 25px; background: #fef3c7; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 16px;">
                      <strong>Thank you for being part of the Raw Smith Coffee community!</strong>
                    </p>
                  </div>
                </div>
                <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 5px 0;">Raw Smith Coffee Loyalty Program</p>
                  <p style="margin: 5px 0;">Visit us at raw-smith-loyalty.com</p>
                </div>
              </div>
            `,
          })

          if (error) {
            console.error(`Failed to send email to ${profile.email}:`, error)
            return { email: profile.email, success: false, error: error.message || 'Email sending failed' }
          }

          console.log(`Email sent successfully to ${profile.email}`)
          return { email: profile.email, success: true, messageId: data?.id }
        } catch (error: any) {
          console.error(`Exception sending email to ${profile.email}:`, error)
          return { 
            email: profile.email || 'unknown', 
            success: false, 
            error: error.message || 'Unknown error occurred'
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Add delay between batches to respect rate limits
      if (i + batchSize < profiles.length) {
        console.log(`Waiting ${delayBetweenBatches}ms before next batch...`)
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    console.log(`Email sending complete. Success: ${successful}, Failed: ${failed}`)

    return new Response(
      JSON.stringify({
        success: true,
        total: profiles.length,
        successful,
        failed,
        results
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )

  } catch (error: any) {
    console.error('Error in bulk email function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send bulk emails'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
})
