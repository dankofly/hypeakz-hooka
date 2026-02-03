import { UserProfile } from '../types.ts';
import { analytics } from './analytics.ts';
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  User
} from './firebase.ts';

export type AuthProvider = 'google' | 'email';

// Helper to convert Firebase User to UserProfile
const firebaseUserToProfile = (user: User): UserProfile => {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    brand: '',
    email: user.email || '',
    phone: user.phoneNumber || '',
    createdAt: Date.parse(user.metadata.creationTime || '') || Date.now(),
    emailVerified: user.emailVerified
  };
};

// Get Firebase ID token for API verification
export const getIdToken = async (): Promise<string | null> => {
  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

export const authService = {
  // Google OAuth Login
  async signInWithGoogle(): Promise<UserProfile> {
    if (!auth || !googleProvider) {
      throw { code: 'auth/not-configured', message: 'Firebase not configured' };
    }
    analytics.track('sso_start', { provider: 'google' });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = firebaseUserToProfile(result.user);

      analytics.track('sso_success', {
        provider: 'google',
        userId: profile.id,
        name: profile.name,
        email: profile.email
      });

      return profile;
    } catch (error: any) {
      analytics.track('sso_error', { provider: 'google', error: error.code });
      throw error;
    }
  },

  // Email/Password Registration with Email Verification
  async registerWithEmail(email: string, password: string): Promise<{ user: UserProfile; needsVerification: boolean }> {
    if (!auth) {
      throw { code: 'auth/not-configured', message: 'Firebase not configured' };
    }
    analytics.track('register_start', { provider: 'email' });

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Send verification email
      await sendEmailVerification(result.user, {
        url: window.location.origin + '/?verified=true',
        handleCodeInApp: false
      });

      const profile = firebaseUserToProfile(result.user);

      analytics.track('register_success', {
        userId: profile.id,
        email: profile.email,
        emailVerified: false
      });

      return { user: profile, needsVerification: true };
    } catch (error: any) {
      analytics.track('register_error', { error: error.code });
      throw error;
    }
  },

  // Email/Password Login (requires verified email)
  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    if (!auth) {
      throw { code: 'auth/not-configured', message: 'Firebase not configured' };
    }
    analytics.track('login_start', { provider: 'email' });

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Check email verification (2FA requirement)
      if (!result.user.emailVerified) {
        // Resend verification email
        await sendEmailVerification(result.user);
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      const profile = firebaseUserToProfile(result.user);

      analytics.track('login_success', {
        provider: 'email',
        userId: profile.id,
        email: profile.email
      });

      return profile;
    } catch (error: any) {
      analytics.track('login_error', { provider: 'email', error: error.code || error.message });
      throw error;
    }
  },

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    if (!auth) return;
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  },

  // Check if current user's email is verified
  isEmailVerified(): boolean {
    if (!auth) return false;
    return auth.currentUser?.emailVerified ?? false;
  },

  // Logout
  async logout(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
    analytics.track('logout');
  },

  // Get current user
  getCurrentUser(): UserProfile | null {
    if (!auth) return null;
    const user = auth.currentUser;
    if (!user) return null;
    return firebaseUserToProfile(user);
  },

  // Legacy method for backward compatibility
  async signInWithSocial(provider: AuthProvider): Promise<UserProfile> {
    if (provider === 'google') {
      return this.signInWithGoogle();
    }
    throw new Error('UNSUPPORTED_PROVIDER');
  }
};
