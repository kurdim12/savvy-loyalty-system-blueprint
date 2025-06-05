
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration
const SUPABASE_URL = "https://egeufofnkpvwbmffgoxw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXVmb2Zua3B2d2JtZmZnb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODE3NDUsImV4cCI6MjA2MTc1Nzc0NX0.rQbKbndK2BB-oDfp0_v4xrpYAXizNgpFOQMfxbzhQ-A";

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
      flowType: 'pkce',
      debug: false, // Disable debug logs to reduce noise
    },
    global: {
      headers: {
        'X-Client-Info': 'raw-smith-loyalty@1.0.0',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 5,
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Enhanced cleanup function for auth state
export const cleanupAuthState = () => {
  console.log("Cleaning up auth state");
  
  try {
    // Get all storage keys first to avoid modification during iteration
    const localStorageKeys = Object.keys(localStorage);
    
    // Remove all Supabase auth keys from localStorage
    localStorageKeys.forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-egeufofnkpvwbmffgoxw')) {
        console.log(`Removing auth key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Try to remove from sessionStorage if it exists
    if (typeof sessionStorage !== 'undefined') {
      const sessionStorageKeys = Object.keys(sessionStorage);
      sessionStorageKeys.forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-egeufofnkpvwbmffgoxw')) {
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
    console.log("Starting secure sign out process");
    
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out for complete logout
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error('Error during sign out:', error);
    }
    
    // Additional cleanup after sign out
    setTimeout(() => {
      cleanupAuthState();
      // Force page reload for a clean state
      window.location.href = '/auth';
    }, 100);
  } catch (error) {
    console.error('Error during secure sign out:', error);
    // Fallback: force reload anyway for safety
    cleanupAuthState();
    window.location.href = '/auth';
  }
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

export const requireAdmin = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Admin access required');
  }
};

export const requireAuth = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
};

export { 
  getUserPoints,
  getUserVisits,
  incrementPoints,
  decrementPoints
} from './functions';
