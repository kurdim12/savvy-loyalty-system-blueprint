
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { type, points } = await req.json()

    // Validate input
    if (!type || !points || points <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting for chat messages (1 point per minute)
    if (type === 'chat') {
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      
      const { data: recentChatPoints } = await supabaseClient
        .from('transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earn')
        .ilike('notes', '%chat%')
        .gte('created_at', oneMinuteAgo)
      
      if (recentChatPoints && recentChatPoints.length > 0) {
        return new Response(
          JSON.stringify({ error: 'Rate limited. Wait 1 minute between chat rewards.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Map interaction types to descriptions
    const descriptions = {
      chill: 'Sit & Chill reward - took time to relax in the café',
      chat: 'Community chat participation',
      song_request: 'Song request interaction',
      photo_upload: 'Photo contest participation'
    }

    const description = descriptions[type as keyof typeof descriptions] || 'Community interaction'

    // Insert transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'earn',
        points: points,
        notes: description
      })

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      return new Response(
        JSON.stringify({ error: 'Failed to record transaction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get updated user profile to check for tier changes
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('current_points, membership_tier, first_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }

    console.log(`✅ ${type} reward: +${points} points for user ${user.id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        points_earned: points,
        total_points: profile?.current_points || 0,
        tier: profile?.membership_tier || 'bronze',
        user_name: profile?.first_name || 'Coffee Lover'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
