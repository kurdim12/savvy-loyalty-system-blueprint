
import { supabase } from '@/integrations/supabase/client';

export const sendTestBeansEmail = async (testEmail: string) => {
  try {
    console.log('Starting test beans email send to:', testEmail);
    console.log('Supabase client available:', !!supabase);
    
    const { data, error } = await supabase.functions.invoke('send-beans-announcement', {
      body: { 
        testEmail: testEmail 
      }
    });
    
    if (error) {
      console.error('Supabase function invoke error:', error);
      throw error;
    }
    
    console.log('Test email response:', data);
    return data;
    
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
};

// Call the function immediately to test with better error handling
console.log('About to send test beans email...');
sendTestBeansEmail('abdalrhmankurdi12@gmail.com')
  .then((result) => {
    console.log('✅ Test email sent successfully:', result);
  })
  .catch((error) => {
    console.error('❌ Test email failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  });
