
import { supabase } from '@/integrations/supabase/client';

export const sendTestBeansEmail = async (testEmail: string) => {
  try {
    console.log('🚀 Starting test beans email send to:', testEmail);
    console.log('📧 Supabase client available:', !!supabase);
    
    // Test if we can reach the edge function first
    console.log('🔍 Testing edge function connectivity...');
    
    const { data, error } = await supabase.functions.invoke('send-beans-announcement', {
      body: { 
        testEmail: testEmail 
      }
    });
    
    console.log('📊 Function invoke result:', { data, error });
    
    if (error) {
      console.error('❌ Supabase function invoke error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Function invoke failed: ${error.message}`);
    }
    
    if (!data) {
      console.warn('⚠️ No data returned from function');
      throw new Error('No response data from email function');
    }
    
    console.log('✅ Test email response:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Failed to send test email:', error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

// Enhanced test with better error reporting
console.log('🎯 About to send test beans email...');
console.log('🔧 Environment check - Supabase URL available:', !!import.meta.env?.VITE_SUPABASE_URL);

sendTestBeansEmail('abdalrhmankurdi12@gmail.com')
  .then((result) => {
    console.log('🎉 SUCCESS - Test email sent successfully!');
    console.log('📋 Result details:', JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('🚨 FAILURE - Test email failed!');
    console.error('🔍 Error message:', error.message);
    console.error('🔍 Full error:', JSON.stringify(error, null, 2));
    
    // Additional debugging info
    if (error.message?.includes('Function not found')) {
      console.error('💡 HINT: The edge function might not be deployed or named incorrectly');
    }
    if (error.message?.includes('API key')) {
      console.error('💡 HINT: Check if RESEND_API_KEY is properly set in Supabase secrets');
    }
    if (error.message?.includes('network')) {
      console.error('💡 HINT: Network connectivity issue to Supabase edge functions');
    }
  });
