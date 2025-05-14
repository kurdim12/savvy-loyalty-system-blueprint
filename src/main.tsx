
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { Toaster as SonnerToaster } from 'sonner';
import { supabase } from './integrations/supabase/client';
import { BrowserRouter } from 'react-router-dom';

// Create a client
const queryClient = new QueryClient();

console.log('Main.tsx: Application initializing');

// Initialize error logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Listen for auth events to award welcome bonus
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state change detected:', event);
  
  // Check if the event is a sign-in event
  if (event === 'SIGNED_IN' && session?.user) {
    try {
      console.log('User signed in, checking for welcome bonus eligibility');
      
      // Defer execution to avoid potential deadlocks
      setTimeout(async () => {
        try {
          // Check if this might be a new signup by looking for an existing profile
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();
            
          if (!existingProfile) {
            console.log('New user signed up, awarding welcome bonus');
            
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
          }
        } catch (error) {
          console.error('Error in deferred welcome bonus process:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error handling sign-in event:', error);
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SonnerToaster position="top-right" expand={false} richColors />
          <Toaster />
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
