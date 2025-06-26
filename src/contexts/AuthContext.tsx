import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError, PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthErrorType = AuthError | PostgrestError | { message: string };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthErrorType | null }>;
  signUp: (email: string, password: string, fullName: string, phone: string, city: string) => Promise<{ error: AuthErrorType | null }>;
  signOut: () => Promise<void>;
  location: { country: string; city: string };
  setLocation: React.Dispatch<React.SetStateAction<{ country: string; city: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ country: 'IN', city: 'Delhi' });
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribed = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (unsubscribed) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('Auth state changed:', { event, session });
        
        // Handle session expiry only if user was previously authenticated
        if (event === 'SIGNED_OUT' && wasAuthenticated) {
          setUser(null);
          setSession(null);
          setLoading(false);
          toast({
            title: 'Session Expired',
            description: 'Your session has expired. Please sign in again.',
            variant: 'destructive',
          });
          window.location.href = '/signin';
        }
        
        // Track if user was authenticated
        if (session?.user) {
          setWasAuthenticated(true);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (unsubscribed) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setWasAuthenticated(true);
      }
      setLoading(false);
      console.log('Initial session:', session);
    }).catch((err) => {
      if (unsubscribed) return;
      setLoading(false);
      console.error('Error getting session:', err);
      // Don't redirect on initial session fetch error
    });

    return () => {
      unsubscribed = true;
      subscription.unsubscribe();
    };
  }, [wasAuthenticated]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      // Redirect to home after sign-in
      window.location.href = "/";
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string, city: string) => {
    const redirectUrl = `${window.location.origin}/`;

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      toast({
        title: 'Email Already Registered',
        description: 'An account with this email already exists. Please sign in or use a different email.',
        variant: 'destructive',
      });
      return { error: { message: 'Email already registered' } };
    }
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: No rows found
      toast({
        title: 'Sign Up Failed',
        description: checkError.message,
        variant: 'destructive',
      });
      return { error: checkError };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone,
          city: city,
        },
      },
    });

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    }

    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      setLocation({ country: 'IN', city: 'Delhi' }); // Reset to default location
      
      // Clear any stored data in localStorage if needed
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('cart_items');
      localStorage.removeItem('recent_searches');
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      // Redirect to signin page
      window.location.href = '/signin';
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    location,
    setLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
