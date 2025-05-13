
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create the admin user with new credentials
    const email = 'rawsmith@admin.com';
    const password = 'rawsmith123';
    
    // Check if user already exists
    const { data: existingUsers, error: lookupError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
    
    if (lookupError) {
      console.error('Error checking for existing user:', lookupError);
      return new Response(
        JSON.stringify({ error: 'Failed to check for existing user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // If admin already exists, return success with credentials
    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Admin user already exists', 
          success: true,
          credentials: { email, password }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: 'Admin', last_name: 'User' },
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create admin user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // The handle_new_user trigger should automatically create the profile
    // with admin role due to the email containing 'admin'
    
    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully', 
        success: true,
        credentials: { email, password }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
