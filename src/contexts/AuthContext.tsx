
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
  isUser: boolean; // Added for explicit role check
  refreshProfile: () => Promise<void>;
  // Remove communityPoints as a separate property
  membershipTier: Database['public']['Enums']['membership_tier'];
  // Add updateProfile function
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
  const navigate = useNavigate();
  const location = useLocation();
  
  const membershipTier = profile?.membership_tier || 'bronze';
  const isAdmin = profile?.role === 'admin';
  // Explicit check for user role
  const isUser = profile?.role === 'customer';

  // Initialize auth state only once
  useEffect(() => {
    if (authInitialized) return;
    
    let subscribed = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Only update if component is still mounted
        if (!subscribed) return;
        
        console.log('Auth state changed:', event);
        
        // Don't update state frequently for the same session
        setSession(prevSession => {
          if (prevSession?.user?.id === newSession?.user?.id) {
            return prevSession; // Don't update if it's the same user
          }
          return newSession;
        });
        
        setUser(newSession?.user ?? null);

        // Using setTimeout with 0ms delay to avoid potential deadlocks with Supabase client
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

    // Get initial session only once
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session:', currentSession);
        
        if (subscribed) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id);
          }
          setLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (subscribed) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    getInitialSession();

    // Set up session expiration monitoring with a reasonable interval
    const intervalId = setInterval(checkSessionExpiration, AUTH_SESSION_CHECK_INTERVAL);

    return () => {
      subscribed = false;
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, [authInitialized]);

  // Redirect based on auth state change - separate from auth initialization
  useEffect(() => {
    if (!loading) {
      console.log('Auth state ready, location:', location.pathname);
      console.log('User state:', { user, profile });
      
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
      
      // Handle protected routes that require login
      const isProtectedCustomerRoute = 
        location.pathname.startsWith('/dashboard') || 
        location.pathname.startsWith('/profile') || 
        location.pathname.startsWith('/rewards');
        
      const isProtectedAdminRoute = location.pathname.startsWith('/admin') && 
        location.pathname !== '/admin/login';
      
      if (isProtectedCustomerRoute && (!user || !profile)) {
        console.log('User not logged in for protected customer route, redirecting to auth');
        navigate('/auth', { replace: true });
      }
      
      if (isProtectedAdminRoute && (!user || !isAdmin)) {
        console.log('User not admin for protected admin route, redirecting to admin login');
        navigate('/admin/login', { replace: true });
      }
    }
  }, [loading, user, profile, location.pathname, isAdmin, isUser, navigate]);

  // Check if the session is about to expire
  const checkSessionExpiration = () => {
    if (session?.expires_at) {
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = expiresAt - now;
      
      // If token is about to expire in next 5 minutes, try to refresh it
      if (timeRemaining < 300 && timeRemaining > 0) {
        console.log('Session about to expire, attempting refresh');
        supabase.auth.refreshSession();
      }
      
      // If token is expired, force logout
      if (timeRemaining <= 0) {
        console.log('Session expired');
        toast.error('Your session has expired. Please sign in again.');
        signOut();
      }
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      // Apply rate limiting by adding a small delay
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId as string)
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
        console.log('Profile fetched successfully:', data);
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
        console.log('New profile created:', newProfile);
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

  // Add the updateProfile function
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
    // Clean up auth state first
    cleanupAuthState();
    
    try {
      // Attempt global sign out for complete logout
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
    
    // Clear state
    setProfile(null);
    setUser(null);
    setSession(null);
    
    // Direct admin users to admin login, regular users to main auth page
    // Use replace:true to avoid adding to history
    if (location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else {
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
