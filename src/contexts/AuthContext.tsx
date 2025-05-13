
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
  // Add community-specific properties
  communityPoints?: number;
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
  const [communityPoints, setCommunityPoints] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  const membershipTier = profile?.membership_tier || 'bronze';
  const isAdmin = profile?.role === 'admin';
  // Explicit check for user role
  const isUser = profile?.role === 'customer';

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Log auth events for debugging security issues
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Using setTimeout to avoid potential deadlocks with Supabase client
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    // Set up session expiration monitoring
    const intervalId = setInterval(checkSessionExpiration, AUTH_SESSION_CHECK_INTERVAL);

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

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
        setProfile(data as Profile);
        
        // Check if user is on the wrong route based on their role
        checkAndRedirectBasedOnRole(data.role);
        
        // Also fetch community points
        fetchCommunityPoints(userId);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };
  
  // Add a function to create a user profile if it doesn't exist
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
        setProfile(newProfile as Profile);
        toast.success('Welcome! Your profile has been created.');
      }
    } catch (error) {
      console.error('Error in profile creation:', error);
    }
  };

  // Redirect users based on their role
  const checkAndRedirectBasedOnRole = (role: string) => {
    const currentPath = location.pathname;
    
    // Admin accessing user routes - redirect to admin dashboard
    if (role === 'admin' && 
        !currentPath.startsWith('/admin') && 
        !currentPath.startsWith('/auth') &&
        currentPath !== '/') {
      toast.info('Redirecting to admin dashboard');
      navigate('/admin/dashboard');
    }
    
    // User accessing admin routes - redirect to user dashboard
    if (role === 'customer' && 
        currentPath.startsWith('/admin')) {
      toast.error('Access denied. You do not have permission to view this page.');
      navigate('/dashboard');
    }
  };

  const fetchCommunityPoints = async (userId: string) => {
    try {
      // Use a direct query instead of RPC since we don't have the function in types
      // We'll pretend there's a custom function that computes this
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('points')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');
        
      if (error) {
        console.error('Error fetching community points:', error);
        return;
      }
      
      // Calculate points from transactions
      const points = transactions?.reduce((total, t) => total + (t.points || 0), 0) || 0;
      setCommunityPoints(points);
    } catch (error) {
      console.error('Error fetching community points:', error);
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
    setCommunityPoints(0);
    
    // Direct admin users to admin login, regular users to main auth page
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
    communityPoints,
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
