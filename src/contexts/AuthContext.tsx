
import React, { 
  createContext, 
  useState, 
  useEffect, 
  useContext, 
  useCallback 
} from 'react';
import { 
  supabase, 
  secureSignOut 
} from '@/integrations/supabase/client';
import { 
  Session, 
  User 
} from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { castDbResult, ProfilesRow } from '@/integrations/supabase/typeUtils';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: ProfilesRow | null;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  membershipTier: string;
  profile: ProfilesRow | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<ProfilesRow | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };
    
    loadSession();
    
    supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
        setIsUser(false);
        setLoading(false);
      }
    });
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      console.log('Sign up data:', data);
      navigate('/auth/check-email');
    } catch (error: any) {
      console.error('Sign up error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log('Sign in data:', data);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await secureSignOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      // Optimistically update the profile in the context
      setUserProfile((prevProfile) => {
        if (prevProfile) {
          return { ...prevProfile, ...updates };
        }
        return prevProfile;
      });
      
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  const loadUserProfile = useCallback(async (userId: string) => {
    setLoading(true);
    
    try {
      if (!userId) {
        setUserProfile(null);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error loading user profile:', error);
        throw error;
      }
      
      if (data) {
        // Use our type helper to safely cast the profile data
        const profileData = castDbResult<ProfilesRow>(data);
        setUserProfile(profileData);
        
        // Cache user role
        setIsAdmin(profileData.role === 'admin');
        setIsUser(profileData.role === 'user');
      } else {
        setUserProfile(null);
        setIsAdmin(false);
        setIsUser(false);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUserProfile(null);
      setIsAdmin(false);
      setIsUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Define membership tier based on the user profile
  const membershipTier = userProfile?.membership_tier || 'bronze';

  const value: AuthContextType = {
    session,
    user,
    userProfile,
    isAdmin,
    isUser,
    loading,
    membershipTier,
    profile: userProfile,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
