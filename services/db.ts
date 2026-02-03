
import { HistoryItem, BriefProfile, UserProfile } from '../types.ts';
import { getIdToken } from './auth.ts';

// Local Storage Keys
const LS_KEYS = {
  USER: 'hypeakz_db_user_backup',
  HISTORY: 'hypeakz_db_history_backup',
  PROFILES: 'hypeakz_db_profiles_backup'
};

// Safe Storage Wrapper (Handles Private Mode / Quota Exceeded)
const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Storage Access Error (Read):', e);
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage Access Error (Write):', e);
    }
  }
};

// Helper to call the API with Timeout and Auth Token
const callApi = async (action: string, payload: any = {}, timeoutMs: number = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Get Firebase token for authenticated requests
    const token = await getIdToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API] Calling ${action} with timeout ${timeoutMs}ms`);

    const response = await fetch('/.netlify/functions/api', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, payload }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Unauthorized API call - user may need to re-authenticate');
      }
      const errorText = await response.text();
      console.error(`[API] Error response: ${errorText}`);
      return { _error: true, status: response.status, message: errorText };
    }

    // Check content type to avoid crashing on HTML (404/500 pages)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
      console.error(`[API] Non-JSON response: ${contentType}`);
      return { _error: true, message: 'Non-JSON response from server' };
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`[API] Request timed out after ${timeoutMs}ms`);
      return { _error: true, message: `Timeout nach ${timeoutMs / 1000}s` };
    }
    console.error(`[API] Fetch error:`, error);
    return { _error: true, message: error.message || 'Netzwerkfehler' };
  }
};

// --- Local Storage Helpers ---

const localStore = {
  saveUser: (user: UserProfile) => {
    storage.set(LS_KEYS.USER, JSON.stringify(user));
  },
  getUser: (id: string): UserProfile | null => {
    const data = storage.get(LS_KEYS.USER);
    if (!data) return null;
    try {
      const user = JSON.parse(data);
      return user.id === id ? user : null;
    } catch { return null; }
  },
  getHistory: (): HistoryItem[] => {
    const data = storage.get(LS_KEYS.HISTORY);
    try { return data ? JSON.parse(data) : []; } catch { return []; }
  },
  saveHistoryItem: (item: HistoryItem) => {
    const current = localStore.getHistory();
    // Prevent duplicates based on ID
    const updated = [item, ...current.filter(i => i.id !== item.id)].slice(0, 50);
    storage.set(LS_KEYS.HISTORY, JSON.stringify(updated));
  },
  getProfiles: (): BriefProfile[] => {
    const data = storage.get(LS_KEYS.PROFILES);
    try { return data ? JSON.parse(data) : []; } catch { return []; }
  },
  saveProfile: (profile: BriefProfile) => {
    const current = localStore.getProfiles();
    const updated = [profile, ...current.filter(p => p.id !== profile.id)];
    storage.set(LS_KEYS.PROFILES, JSON.stringify(updated));
  },
  deleteProfile: (id: string) => {
    const current = localStore.getProfiles();
    const updated = current.filter(p => p.id !== id);
    storage.set(LS_KEYS.PROFILES, JSON.stringify(updated));
  }
};

export const db = {
  async init() {
    // Attempt to init cloud DB (Fire & Forget)
    callApi('init-db').catch(() => {});
  },

  async logEvent(eventName: string, metadata: any = {}) {
    const id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    callApi('log-analytics', { id, eventName, timestamp: Date.now(), metadata }).catch(() => {});
  },

  async saveUser(user: UserProfile) {
    // 1. Save Local (guaranteed success)
    localStore.saveUser(user);
    // 2. Try Sync Cloud (Non-blocking)
    await callApi('save-user', user);
  },

  async getUser(id: string): Promise<UserProfile | null> {
    // 1. Try Cloud
    const cloudResult = await callApi('get-user', { id });
    if (cloudResult) {
      // Sync local backup
      localStore.saveUser(cloudResult);
      return cloudResult;
    }
    // 2. Fallback Local
    return localStore.getUser(id);
  },

  async getHistory(): Promise<HistoryItem[]> {
    const cloudResult = await callApi('get-history');
    
    if (cloudResult && Array.isArray(cloudResult) && cloudResult.length > 0) {
      storage.set(LS_KEYS.HISTORY, JSON.stringify(cloudResult));
      return cloudResult;
    }

    return localStore.getHistory();
  },

  async saveHistoryItem(item: HistoryItem) {
    localStore.saveHistoryItem(item);
    await callApi('save-history', item);
  },

  async getProfiles(): Promise<BriefProfile[]> {
    const cloudResult = await callApi('get-profiles');
    
    if (cloudResult && Array.isArray(cloudResult) && cloudResult.length > 0) {
      storage.set(LS_KEYS.PROFILES, JSON.stringify(cloudResult));
      return cloudResult;
    }

    return localStore.getProfiles();
  },

  async saveProfile(profile: BriefProfile) {
    localStore.saveProfile(profile);
    await callApi('save-profile', profile);
  },

  async deleteProfile(id: string) {
    localStore.deleteProfile(id);
    await callApi('delete-profile', { id });
  },

  async createCheckoutSession(userId: string, email: string): Promise<{ url?: string; error?: string }> {
    try {
      // Use longer timeout (30s) for Stripe operations
      const response = await callApi('create-checkout-session', { userId, email }, 30000);

      console.log('[Checkout] API Response:', response);

      if (!response) {
        return { error: 'Server nicht erreichbar. Bitte versuche es später erneut.' };
      }

      // Handle error responses from callApi
      if (response._error) {
        return { error: response.message || 'Server-Fehler' };
      }

      if (response.url) {
        return { url: response.url };
      }

      if (response.error) {
        console.error('Checkout error:', response.error);
        return { error: response.error };
      }

      return { error: 'Unbekannter Fehler beim Checkout.' };
    } catch (error: any) {
      console.error('Checkout session creation failed:', error);
      return { error: error.message || 'Ein Fehler ist aufgetreten.' };
    }
  }
};
