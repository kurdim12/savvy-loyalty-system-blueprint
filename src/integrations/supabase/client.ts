
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://egeufofnkpvwbmffgoxw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXVmb2Zua3B2d2JtZmZnb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODE3NDUsImV4cCI6MjA2MTc1Nzc0NX0.rQbKbndK2BB-oDfp0_v4xrpYAXizNgpFOQMfxbzhQ-A";

// Create the Supabase client with proper configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
