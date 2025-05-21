
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isUser: boolean;
  refreshProfile: () => Promise<void>;
  membershipTier: Database['public']['Enums']['membership_tier'];
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AUTH_CHECK_TIMEOUT_MS = 5000; // 5 seconds max for auth check

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  
  const membershipTier = profile?.membership_tier || 'bronze';
  const isAdmin = profile?.role === 'admin';
  const isUser = profile?.role === 'customer';

  // Initialize authentication
  useEffect(() => {
    console.log('AuthContext: Initializing authentication...');
    
    // Force auth resolution after timeout
    const timeoutId = setTimeout(() => {
      console.log('AuthContext: Force completing auth check after timeout');
      setLoading(false);
      setAuthInitialized(true);
    }, AUTH_CHECK_TIMEOUT_MS);
    
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('AuthContext: Auth event received:', event);
        
        if (!mounted) return;
        
        // Update session and user state
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Using setTimeout to avoid deadlocks with Supabase client
        if (newSession?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(newSession.user.id);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('AuthContext: Getting initial session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('AuthContext: Initial session found:', currentSession ? 'Yes' : 'No');
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
        
        setLoading(false);
        setAuthInitialized(true);
      } catch (error) {
        console.error('AuthContext: Error getting initial session:', error);
        
        if (!mounted) return;
        
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error fetching profile:', error);
        
        // Check if the error is because the profile wasn't found
        if (error.code === 'PGRST116') {
          console.log('AuthContext: Profile not found, attempting to create it');
          await createUserProfile(userId);
        }
        return;
      }

      if (data) {
        console.log('AuthContext: Profile fetched successfully');
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error fetching profile:', error);
    }
  };
  
  // Create a user profile if it doesn't exist
  const createUserProfile = async (userId: string) => {
    try {
      // Get user data from auth
      const { data: userData } = await supabase.auth.getUser(userId);
      
      if (!userData?.user) {
        console.error('AuthContext: Could not get user data for profile creation');
        return;
      }
      
      // Create new profile with default values
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.user.email || '',
          first_name: userData.user.user_metadata?.first_name || '',
          last_name: userData.user.user_metadata?.last_name || '',
          role: 'customer',
          current_points: 0,
          membership_tier: 'bronze',
          visits: 0
        })
        .select()
        .single();
        
      if (error) {
        console.error('AuthContext: Error creating user profile:', error);
        toast.error('Could not create user profile. Please try again or contact support.');
        return;
      }
      
      if (newProfile) {
        console.log('AuthContext: New profile created');
        setProfile(newProfile as Profile);
        toast.success('Welcome! Your profile has been created.');
      }
    } catch (error) {
      console.error('AuthContext: Error in profile creation:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
      
    if (error) {
      throw error;
    }
    
    // Refresh the profile after updating
    await refreshProfile();
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out user...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear state
      setProfile(null);
      setUser(null);
      setSession(null);
      
      console.log('AuthContext: Signed out successfully, redirecting...');
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('AuthContext: Error during sign out:', error);
      
      // Force reload anyway as fallback
      window.location.href = '/auth';
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    isAdmin,
    isUser,
    refreshProfile,
    membershipTier,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
