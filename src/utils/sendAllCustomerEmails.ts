
import { supabase } from '@/integrations/supabase/client';

export const sendBeansArrivedEmailToAll = async () => {
  try {
    console.log('🚀 Sending beans arrived email to all customers...');
    
    const { data, error } = await supabase.functions.invoke('send-beans-announcement', {
      body: { 
        sendToAll: true
      }
    });
    
    if (error) {
      console.error('❌ Email send failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Bulk email sent successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('💥 Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Execute immediately when this file is imported
console.log('📧 Executing bulk email send to all customers...');
sendBeansArrivedEmailToAll().then(result => {
  if (result.success) {
    console.log('🎉 Bulk email campaign completed successfully!');
    console.log('📊 Results:', result.data);
  } else {
    console.error('🚨 Failed to send bulk emails:', result.error);
  }
});
