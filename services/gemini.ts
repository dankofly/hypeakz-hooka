
import { ViralConcept, MarketingBrief, Language } from '../types.ts';

export const ensureApiKey = async () => {
  return;
};

/**
 * Ruft die Netlify Serverless Function auf.
 * Jetzt mit Client-Side Timeout, um Endlos-Ladezustände zu verhindern.
 */
const callApi = async (action: string, payload: any) => {
  // 30s Timeout Limit für das Frontend (Netlify Functions haben oft 10s oder 26s Limit)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('/.netlify/functions/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server Error: ${response.status}`;
      
      if (errorMessage.includes("Missing API Key")) {
        throw new Error("MISSING_API_KEY");
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`API Call failed (${action}):`, error);
    
    if (error.name === 'AbortError') {
      throw new Error("TIMEOUT: Der Server hat zu lange gebraucht. Bitte versuche es erneut.");
    }
    
    throw error;
  }
};

export const researchBrand = async (url: string, language: Language): Promise<Partial<MarketingBrief>> => {
  return callApi('research', { url, language });
};

export const generateVisualMockup = async (prompt: string): Promise<string> => {
  const result = await callApi('generate-image', { prompt });
  return result.imageUrl;
};

export const generateViralHooks = async (brief: MarketingBrief): Promise<ViralConcept[]> => {
  return callApi('generate-hooks', { brief });
};

// --- ADMIN SERVICES ---

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const result = await callApi('verify-admin', { password });
  return result.success;
};

export const getAdminStats = async (password: string): Promise<{ userCount: number; historyCount: number; apiCalls: number }> => {
  return callApi('get-admin-stats', { password });
};

export const getAdminPrompt = async (): Promise<string> => {
  const result = await callApi('get-admin-prompt', {});
  return result.prompt || "";
};

export const saveAdminPrompt = async (password: string, prompt: string): Promise<void> => {
  await callApi('save-admin-prompt', { password, prompt });
};

// --- ADMIN USER MANAGEMENT ---

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  brand: string;
  createdAt: number;
  unlimitedStatus: boolean;
  generationCount: number;
  paid: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  createdAt: number;
  usedBy: string | null;
  usedAt: number | null;
}

export const getAdminUsers = async (password: string): Promise<AdminUser[]> => {
  return callApi('admin-get-users', { password });
};

export const toggleUserPaid = async (password: string, userId: string): Promise<void> => {
  await callApi('admin-toggle-paid', { password, userId });
};

export const toggleUserUnlimited = async (password: string, userId: string): Promise<void> => {
  await callApi('admin-toggle-unlimited', { password, userId });
};

export const generatePromoCode = async (password: string): Promise<string> => {
  const result = await callApi('admin-generate-promo', { password });
  return result.code;
};

export const getPromoCodes = async (password: string): Promise<PromoCode[]> => {
  return callApi('admin-get-promo-codes', { password });
};

export const validatePromoCode = async (code: string, userId: string): Promise<{ valid: boolean; error?: string; unlimited?: boolean }> => {
  return callApi('validate-promo-code', { code, userId });
};

export const incrementGeneration = async (userId: string): Promise<void> => {
  await callApi('increment-generation', { userId });
};
