
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

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

const AUTH_SESSION_CHECK_INTERVAL = 60000; // 1 minute

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const membershipTier = profile?.membership_tier || 'bronze';
  const isAdmin = profile?.role === 'admin';
  // Explicit check for user role
  const isUser = profile?.role === 'customer';

  // Emergency auth initialization
  useEffect(() => {
    console.log('EMERGENCY AUTH: Attempting to initialize authentication...');
    
    // Force auth resolution after timeout
    const timeoutId = setTimeout(() => {
      console.log('EMERGENCY TIMEOUT: Force completing auth check after 3 seconds');
      setLoading(false);
      setAuthInitialized(true);
    }, 3000);
    
    // Cleanup Supabase auth state to prevent conflicts
    cleanupAuthState();
    
    let subscribed = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth event received:', event);
        
        // Only update if component is still mounted
        if (!subscribed) return;
        
        // Update session and user state
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Using setTimeout with 0ms delay to avoid deadlocks with Supabase client
        if (newSession?.user) {
          setTimeout(() => {
            if (subscribed) {
              fetchUserProfile(newSession.user.id);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Get initial session once
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session found:', currentSession ? 'Yes' : 'No');
        
        if (subscribed) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id);
          }
          
          setTimeout(() => {
            if (subscribed) {
              setLoading(false);
              setAuthInitialized(true);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setAuthError(error instanceof Error ? error.message : 'Unknown auth error');
        
        if (subscribed) {
          setTimeout(() => {
            setLoading(false);
            setAuthInitialized(true);
          }, 500);
        }
      }
    };

    getInitialSession();

    return () => {
      subscribed = false;
      subscription?.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Use a separate effect for redirects to avoid race conditions
  useEffect(() => {
    if (!loading && authInitialized) {
      console.log('Auth state ready, current path:', location.pathname);
      
      // Handle public routes that should redirect logged in users
      const isPublicRoute = location.pathname === '/auth' || location.pathname === '/admin/login';
      
      if (isPublicRoute && user && profile) {
        console.log('User is logged in on a public route, redirecting');
        if (isAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else if (isUser) {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [loading, user, profile, location.pathname, isAdmin, isUser, navigate, authInitialized]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // Check if the error is because the profile wasn't found
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create it');
          await createUserProfile(userId);
          return;
        }
        return;
      }

      if (data) {
        console.log('Profile fetched successfully');
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };
  
  // Create a user profile if it doesn't exist
  const createUserProfile = async (userId: string) => {
    try {
      // Get user data from auth
      const { data: userData } = await supabase.auth.getUser(userId);
      
      if (!userData?.user) {
        console.error('Could not get user data for profile creation');
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
        console.error('Error creating user profile:', error);
        toast.error('Could not create user profile. Please try again or contact support.');
        return;
      }
      
      if (newProfile) {
        console.log('New profile created');
        setProfile(newProfile as Profile);
        toast.success('Welcome! Your profile has been created.');
      }
    } catch (error) {
      console.error('Error in profile creation:', error);
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
      console.log('Signing out user...');
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear state
      setProfile(null);
      setUser(null);
      setSession(null);
      
      console.log('Signed out successfully, redirecting...');
      // Force page reload
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error during sign out:', error);
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
