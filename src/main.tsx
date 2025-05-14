
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { Toaster as SonnerToaster } from 'sonner';
import { supabase } from './integrations/supabase/client';

// Create a client
const queryClient = new QueryClient();

// Listen for auth events to award welcome bonus
supabase.auth.onAuthStateChange(async (event, session) => {
  // Check if the event is a sign-in event - valid events in Supabase v2
  if (event === 'SIGNED_IN' && session?.user) {
    try {
      // Check if this might be a new signup by looking for an existing profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();
        
      if (!existingProfile) {
        console.log('New user signed up, awarding welcome bonus');
        
        // Defer the execution to avoid potential deadlocks
        setTimeout(async () => {
          // Add welcome bonus points
          await supabase.rpc('increment_points', {
            user_id: session.user.id,
            point_amount: 10
          });
          
          // Create a transaction record for the bonus
          await supabase.from('transactions').insert({
            user_id: session.user.id,
            points: 10,
            transaction_type: 'earn',
            notes: 'Welcome bonus'
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error awarding welcome bonus:', error);
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SonnerToaster position="top-right" expand={false} richColors />
        <Toaster />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
