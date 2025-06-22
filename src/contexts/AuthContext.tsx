import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string, city: string) => Promise<{ error: any }>;
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
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribed = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (unsubscribed) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('Auth state changed:', { event, session });
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (unsubscribed) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('Initial session:', session);
    }).catch((err) => {
      if (unsubscribed) return;
      setLoading(false);
      console.error('Error getting session:', err);
    });

    return () => {
      unsubscribed = true;
      subscription.unsubscribe();
    };
  }, []);

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
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
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
