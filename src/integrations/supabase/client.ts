
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration
const SUPABASE_URL = "https://egeufofnkpvwbmffgoxw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXVmb2Zua3B2d2JtZmZnb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODE3NDUsImV4cCI6MjA2MTc1Nzc0NX0.rQbKbndK2BB-oDfp0_v4xrpYAXizNgpFOQMfxbzhQ-A";

// Get the app URL for auth redirects (defaults to current URL in production or localhost in dev)
const getRedirectURL = () => {
  if (typeof window !== 'undefined') {
    // Use current origin in production
    return window.location.origin;
  }
  // Fallback for non-browser environments
  return 'http://localhost:8080';
};

// Create the Supabase client with enhanced security and persistence configuration
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
  console.log("Cleaning up auth state");
  
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`Removing auth key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Try to remove from sessionStorage if it exists
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          console.log(`Removing session key: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log("Auth state cleanup complete");
  } catch (err) {
    console.error("Error during auth state cleanup:", err);
  }
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

// Export additional helper functions from functions.ts
export { 
  getUserPoints,
  getUserVisits,
  incrementPoints,
  decrementPoints
} from './functions';
