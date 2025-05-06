
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
}

const AUTH_SESSION_CHECK_INTERVAL = 60000; // 1 minute

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
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
    
    // Force page reload for a clean state
    window.location.href = '/auth';
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin',
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
