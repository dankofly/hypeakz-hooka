
import { UserProfile } from '../types.ts';
import { analytics } from './analytics.ts';

export type AuthProvider = 'google' | 'apple' | 'meta';

// Helper to generate a stable ID from a string (email)
const generateStableId = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Der authService simuliert nun einen realistischen OAuth-Flow.
 * Anstatt nur zu warten, wird ein Prozess-Lifecycle durchlaufen,
 * der Metadaten von den jeweiligen Providern "abruft".
 */
export const authService = {
  async signInWithSocial(provider: AuthProvider): Promise<UserProfile> {
    analytics.track('sso_start', { provider });
    
    // Wir simulieren das Öffnen eines Popups und den Austausch von Tokens
    return new Promise((resolve, reject) => {
      // Zeit für den "Handshake"
      const authDuration = provider === 'google' ? 2000 : 1500;
      
      setTimeout(() => {
        // Mock-Daten der Provider inklusive Email und Telefon
        const providerData: Record<AuthProvider, { name: string; brand: string; email: string; phone: string }> = {
          google: { 
            name: 'Daniel Kofler', 
            brand: 'HYPEAKZ.IO Agency',
            email: 'mail@danielkofler.com',
            phone: '+43 676 7293888'
          },
          apple: { 
            name: 'Jordan Sterling', 
            brand: 'Sterling Creative',
            email: 'j.sterling@icloud.com',
            phone: '+1 555 0123 456'
          },
          meta: { 
            name: 'Casey Vance', 
            brand: 'Social Growth Labs',
            email: 'casey@meta-partners.com',
            phone: '+1 415 999 8888'
          }
        };

        const data = providerData[provider];
        
        if (!data) {
          reject(new Error("Provider authentication failed"));
          return;
        }

        // Generate stable ID based on email to track unique users correctly across sessions
        const stableId = `${provider}-${generateStableId(data.email)}`;

        const user: UserProfile = {
          id: stableId,
          name: data.name,
          brand: data.brand,
          email: data.email,
          phone: data.phone,
          createdAt: Date.now()
        };

        analytics.track('sso_success', { 
          provider, 
          userId: user.id, 
          name: user.name, 
          email: user.email 
        });
        
        resolve(user);
      }, authDuration);
    });
  }
};