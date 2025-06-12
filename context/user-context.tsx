'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabaseClient'; // Use the createClient function

interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(); // Create client inside useEffect

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => { // Renamed session to currentSession to avoid conflict
        console.log('UserProvider - onAuthStateChange event:', event); // Log event
        console.log('UserProvider - onAuthStateChange session:', currentSession); // Log session

        if (event === 'SIGNED_IN') {
          // Explicitly get user after sign in event
          const { data: { user: signedInUser }, error } = await supabase.auth.getUser(); // Renamed user
          if (error) {
            console.error('UserProvider - Error getting user after sign in:', error.message);
            setUser(null);
            setSession(null);
          } else {
            console.log('UserProvider - User obtained after sign in:', signedInUser);
            setUser(signedInUser);
            setSession(currentSession);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        } else {
           setSession(currentSession);
           setUser(currentSession?.user || null);
        }

        setIsLoading(false);
      }
    );

    // Streamlined initial session fetching
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => { // Renamed session
      if (error) {
        console.error('UserProvider - Error getting initial session:', error.message);
      } else if (initialSession) {
        console.log('UserProvider - Initial session obtained on mount:', initialSession);
        setSession(initialSession);
        setUser(initialSession.user || null);
      } else {
         console.log('UserProvider - No initial session.');
         setSession(null);
         setUser(null);
      }
       // Ensure isLoading is set to false even if no session is found
       setIsLoading(false);
    });


    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only on mount

  // Add logging for state changes
  useEffect(() => {
    console.log('UserProvider State Change - user:', user);
    console.log('UserProvider State Change - isLoading:', isLoading);
  }, [user, isLoading]);

  return (
    <UserContext.Provider value={{ user, session, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 