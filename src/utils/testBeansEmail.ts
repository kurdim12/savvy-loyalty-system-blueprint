
import { supabase } from '@/integrations/supabase/client';

export const sendTestBeansEmail = async (testEmail: string) => {
  try {
    console.log('Sending test beans email to:', testEmail);
    
    const { data, error } = await supabase.functions.invoke('send-beans-announcement', {
      body: { 
        testEmail: testEmail 
      }
    });
    
    if (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
    
    console.log('Test email response:', data);
    return data;
    
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
};

// Call the function immediately to test
sendTestBeansEmail('abdelrhmankurdi12@gmail.com')
  .then((result) => {
    console.log('Test email sent successfully:', result);
  })
  .catch((error) => {
    console.error('Test email failed:', error);
  });
