
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://egeufofnkpvwbmffgoxw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXVmb2Zua3B2d2JtZmZnb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODE3NDUsImV4cCI6MjA2MTc1Nzc0NX0.rQbKbndK2BB-oDfp0_v4xrpYAXizNgpFOQMfxbzhQ-A";

// Create the Supabase client with enhanced security configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // More secure authentication flow
    },
    global: {
      // Implement rate limiting protection
      headers: {
        'X-Client-Info': 'raw-smith-loyalty@1.0.0',
      },
    },
    // Safe defaults for data transfers
    realtime: {
      params: {
        eventsPerSecond: 5, // Rate limiting for realtime events
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Thorough cleanup function for auth state
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Secure sign out function to prevent session issues
export const secureSignOut = async () => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out for complete logout
    await supabase.auth.signOut({ scope: 'global' });
    
    // Force page reload for a clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Error during secure sign out:', error);
    // Fallback: force reload anyway for safety
    window.location.href = '/auth';
  }
};

// Input sanitization for protection against injection
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Basic sanitization (can be enhanced with a dedicated library)
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Enhanced function to increment points that supports community features
export async function incrementPointsWithReason(
  userId: string, 
  pointAmount: number, 
  reason: string, 
  communityEventId?: string
) {
  if (!userId || typeof pointAmount !== 'number' || isNaN(pointAmount)) {
    return { error: new Error('Invalid user ID or point amount') };
  }

  // Sanitize input for security
  const sanitizedReason = sanitizeInput(reason);
  const sanitizedPointAmount = Math.max(0, pointAmount);
  
  // Create a transaction record with more details
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      points: sanitizedPointAmount,
      transaction_type: 'earn',
      notes: sanitizedReason,
      community_event_id: communityEventId || null
    });
    
  if (transactionError) {
    console.error('Error creating transaction record:', transactionError);
    return { error: transactionError };
  }
  
  // Call the existing incrementPoints function for database update
  const { error } = await incrementPointsInDB(userId, sanitizedPointAmount);
  
  return { error };
}

// Renamed to avoid naming conflict
async function incrementPointsInDB(userId: string, pointAmount: number) {
  if (!userId || typeof pointAmount !== 'number' || isNaN(pointAmount)) {
    return { error: new Error('Invalid user ID or point amount') };
  }

  // Sanitize input - ensure pointAmount is a positive number
  const sanitizedPointAmount = Math.max(0, pointAmount);
  
  // Get current profile data
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('current_points, visits')
    .eq('id', userId)
    .single();
  
  if (fetchError || !profile) {
    console.error('Error fetching profile:', fetchError);
    return { error: fetchError || new Error('User not found') };
  }
  
  // Calculate new values
  const newPoints = profile.current_points + sanitizedPointAmount;
  const newVisits = sanitizedPointAmount > 0 ? profile.visits + 1 : profile.visits;
  
  // Determine tier based on new points using the correct type
  let newTier: Database['public']['Enums']['membership_tier'] = 'bronze';
  if (newPoints >= 550) {
    newTier = 'gold';
  } else if (newPoints >= 200) {
    newTier = 'silver';
  }
  
  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      current_points: newPoints,
      visits: newVisits,
      membership_tier: newTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  return { error: updateError };
}

// Export additional helper functions from functions.ts
export { 
  getUserPoints,
  getUserVisits,
  incrementPoints,
  decrementPoints
} from './functions';
