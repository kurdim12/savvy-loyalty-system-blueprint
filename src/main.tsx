
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { supabase } from './integrations/supabase/client';
import { toast } from 'sonner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// Listen for signup events to award welcome bonus
supabase.auth.onAuthStateChange(async (event, session) => {
  // Fix the type comparison - compare as strings
  if (event === 'SIGNED_UP' && session?.user) {
    try {
      // Defer the execution to avoid potential deadlocks
      setTimeout(async () => {
        // Check if this is a new signup (not an existing user)
        const { data: existingTransactions, error: checkError } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', session.user!.id)
          .eq('notes', 'Welcome bonus')
          .maybeSingle();
          
        if (!existingTransactions && !checkError) {
          // Create a welcome bonus transaction
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: session.user.id,
              transaction_type: 'earn',
              points: 10,
              notes: 'Welcome bonus'
            });
            
          if (!transactionError) {
            // Update user's points
            await supabase.rpc('increment_points', { 
              user_id: session.user.id, 
              point_amount: 10 
            });
            
            // Show success message
            toast.success('Welcome! You received 10 bonus points for signing up!');
          }
        }
      }, 0);
    } catch (error) {
      console.error('Error processing signup bonus:', error);
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
