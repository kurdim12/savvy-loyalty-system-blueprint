
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  const membershipTier = profile?.membership_tier || 'bronze';
  const isAdmin = profile?.role === 'admin';
  const isUser = profile?.role === 'customer';

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('AuthContext: Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('AuthContext: Profile fetched successfully');
        setProfile(data as Profile);
      } else {
        console.log('AuthContext: No profile found, creating one');
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error fetching profile:', error);
    }
  };
  
  const createUserProfile = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        console.error('AuthContext: Could not get user data for profile creation:', userError);
        return;
      }
      
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
        .maybeSingle();
        
      if (error) {
        console.error('AuthContext: Error creating user profile:', error);
        return;
      }
      
      if (newProfile) {
        console.log('AuthContext: New profile created');
        setProfile(newProfile as Profile);
      }
    } catch (error) {
      console.error('AuthContext: Error in profile creation:', error);
    }
  };

  // Initialize authentication
  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST to avoid missing events
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (!mounted) return;
            
            // Update session and user immediately (synchronous operations only)
            setSession(newSession);
            setUser(newSession?.user ?? null);

            // Handle specific events with deferred async operations
            if (event === 'SIGNED_IN' && newSession?.user) {
              // Defer profile fetch to prevent deadlock
              setTimeout(() => {
                if (mounted) {
                  fetchUserProfile(newSession.user.id);
                }
              }, 100);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );
        
        subscription = authListener.subscription;
        
        // THEN get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error && !error.message.includes('session_not_found')) {
          console.error('AuthContext: Error getting initial session:', error);
        }
        
        if (!mounted) return;
        
        // Set initial state
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        // Fetch profile if user exists (deferred to avoid blocking)
        if (initialSession?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(initialSession.user.id);
            }
          }, 100);
        }

        setInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

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
    
    await refreshProfile();
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out user...');
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('AuthContext: Error during sign out:', error);
      }
      
      // Clear state
      setProfile(null);
      setUser(null);
      setSession(null);
      
      console.log('AuthContext: Signed out successfully');
    } catch (error) {
      console.error('AuthContext: Error during sign out:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading: loading || !initialized,
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
