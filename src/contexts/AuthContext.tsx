
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
  const [profileLoading, setProfileLoading] = useState(false);
  
  const membershipTier = profile?.membership_tier || 'bronze';
  const isAdmin = profile?.role === 'admin';
  const isUser = profile?.role === 'customer';

  // Prevent duplicate profile fetches
  const fetchUserProfile = async (userId: string) => {
    if (profileLoading) {
      console.log('AuthContext: Profile fetch already in progress, skipping');
      return;
    }
    
    setProfileLoading(true);
    
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
    } finally {
      setProfileLoading(false);
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
        toast.success('Welcome! Your profile has been created.');
      }
    } catch (error) {
      console.error('AuthContext: Error in profile creation:', error);
    }
  };

  // Initialize authentication with better error handling
  useEffect(() => {
    console.log('AuthContext: Initializing authentication...');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('AuthContext: Auth event received:', event);
            
            if (!mounted) return;
            
            // Update session and user state immediately
            setSession(newSession);
            setUser(newSession?.user ?? null);

            // Handle different auth events
            if (event === 'SIGNED_IN' && newSession?.user) {
              console.log('AuthContext: User signed in, will fetch profile');
              // Use a small delay to prevent multiple concurrent calls
              setTimeout(() => {
                if (mounted && !profileLoading) {
                  fetchUserProfile(newSession.user.id);
                }
              }, 100);
            } else if (event === 'SIGNED_OUT') {
              console.log('AuthContext: User signed out, clearing profile');
              setProfile(null);
              setLoading(false);
            } else if (event === 'TOKEN_REFRESHED' && newSession?.user && !profile) {
              console.log('AuthContext: Token refreshed, checking profile');
              setTimeout(() => {
                if (mounted && !profileLoading) {
                  fetchUserProfile(newSession.user.id);
                }
              }, 100);
            }
            
            // Mark loading as complete for sign out or when no user
            if (!newSession?.user) {
              setLoading(false);
            }
          }
        );

        // Check for existing session
        console.log('AuthContext: Getting initial session');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error && !error.message.includes('session_not_found')) {
          console.error('AuthContext: Error getting initial session:', error);
        }
        
        console.log('AuthContext: Initial session found:', currentSession ? 'Yes' : 'No');
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
        
        // Mark loading as complete
        setLoading(false);

        // Clean up function
        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshProfile = async () => {
    if (user?.id && !profileLoading) {
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
      setLoading(true);
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('AuthContext: Error during sign out:', error);
      }
      
      // Clear state immediately
      setProfile(null);
      setUser(null);
      setSession(null);
      setLoading(false);
      
      console.log('AuthContext: Signed out successfully');
    } catch (error) {
      console.error('AuthContext: Error during sign out:', error);
      setLoading(false);
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
