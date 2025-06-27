
import { supabase } from '@/integrations/supabase/client';

// Send test email directly
export const sendTestEmailNow = async () => {
  try {
    console.log('🚀 Sending test beans email...');
    
    const { data, error } = await supabase.functions.invoke('send-beans-announcement', {
      body: { 
        testEmail: 'abdalrhmankurdi12@gmail.com'
      }
    });
    
    if (error) {
      console.error('❌ Email send failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('💥 Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Execute immediately when this file is imported
console.log('📧 Executing email send...');
sendTestEmailNow().then(result => {
  if (result.success) {
    console.log('🎉 Test email sent successfully to abdalrhmankurdi12@gmail.com');
  } else {
    console.error('🚨 Failed to send test email:', result.error);
  }
});
