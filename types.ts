
export interface UserProfile {
  id: string;
  name: string;
  brand: string;
  email: string;
  phone?: string;
  createdAt: number;
  emailVerified?: boolean;
}

export interface NeuroScores {
  patternInterrupt: number;
  emotionalIntensity: number;
  curiosityGap: number;
  scarcity: number;
}

export interface ViralConcept {
  hook: string;
  script: string;
  strategy: string;
  scores: NeuroScores;
  visualPrompt: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Language = 'DE' | 'EN';

export interface MarketingBrief {
  productContext: string;
  targetAudience: string;
  goal: string;
  speaker: string;
  language: Language;
  sources?: { title: string; uri: string }[];
  targetScores?: NeuroScores;
  
  // NLP Fields
  contentContext?: string;
  limbicType?: string;
  focusKeyword?: string; // New SEO/Topic Field
  patternType?: string;
  repSystem?: string;
  motivation?: string;
  decisionStyle?: string;
  presupposition?: string;
  chunking?: string;
  triggerWords?: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  concepts: ViralConcept[];
  brief: MarketingBrief;
}

export interface BriefProfile {
  id: string;
  name: string;
  brief: MarketingBrief;
}

// Type placeholder for the translation object to avoid circular deps
// In a stricter setup, we would define the full schema here.
export type TranslationObject = any;