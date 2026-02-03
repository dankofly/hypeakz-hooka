import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, User } from '../services/firebase.ts';
import { UserProfile } from '../types.ts';

interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  emailVerified: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    emailVerified: false
  });

  useEffect(() => {
    // If Firebase is not configured, skip auth state listener
    if (!auth) {
      setAuthState({
        user: null,
        firebaseUser: null,
        loading: false,
        emailVerified: false
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          brand: '',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          createdAt: Date.parse(firebaseUser.metadata.creationTime || '') || Date.now(),
          emailVerified: firebaseUser.emailVerified
        };

        setAuthState({
          user: profile,
          firebaseUser,
          loading: false,
          emailVerified: firebaseUser.emailVerified
        });
      } else {
        setAuthState({
          user: null,
          firebaseUser: null,
          loading: false,
          emailVerified: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
};
