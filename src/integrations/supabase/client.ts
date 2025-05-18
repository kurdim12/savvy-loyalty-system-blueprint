import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { 
  UserRole, 
  MembershipTier, 
  TransactionType, 
  TransactionInsert,
} from './typeUtils';

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
      // We disable email confirmation by using immediate redirect
      redirectTo: getRedirectURL() + "/auth"
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

// Re-export type aliases from typeUtils
export { 
  UserRole,
  MembershipTier,
  TransactionType,
  TransactionInsert,
};

// Helper types for Supabase enum values (making them properly typed)
export type UserRole = Database['public']['Enums']['user_role'];
export type MembershipTier = Database['public']['Enums']['membership_tier'];
export type TransactionType = Database['public']['Enums']['transaction_type'];

// Helper type for transaction inserts to avoid TypeScript errors
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

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

/**
 * Sanitize input to prevent XSS and injection attacks
 * @param input The input to sanitize
 * @returns Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Basic sanitization for XSS prevention
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Utility function to require admin role, throws error if not admin
 * @throws Error if user is not an admin
 */
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

/**
 * Utility function to require authentication, throws error if not authenticated
 * @throws Error if user is not authenticated
 */
export const requireAuth = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
};

// Export additional helper functions from functions.ts
export { 
  getUserPoints,
  getUserVisits,
  incrementPoints,
  decrementPoints
} from './functions';
