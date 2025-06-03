import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';

type AuthContextType = {
  user: any;
  loading: boolean;
  error: Error | undefined;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: undefined,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Handle auth state change
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  const value = {
    user,
    loading: loading || initializing,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}