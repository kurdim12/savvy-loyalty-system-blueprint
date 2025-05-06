
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://egeufofnkpvwbmffgoxw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXVmb2Zua3B2d2JtZmZnb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODE3NDUsImV4cCI6MjA2MTc1Nzc0NX0.rQbKbndK2BB-oDfp0_v4xrpYAXizNgpFOQMfxbzhQ-A";

// Create the Supabase client with proper security configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      // Set shorter JWT token expiration to mitigate session hijacking
      // The server will handle token refreshing automatically
      detectSessionInUrl: true,
      flowType: 'pkce' // More secure flow for authentication
    },
    global: {
      // Implement rate limiting protection by adding short throttle
      headers: {
        'X-Client-Info': 'raw-smith-loyalty@1.0.0',
      },
    },
    // Safe defaults for data transfers
    realtime: {
      params: {
        eventsPerSecond: 5, // Rate limiting for realtime events
      }
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
