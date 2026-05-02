export type VisualCriticScore = {
  overall: number; // 0-100
  realism: number; // Physical grounding, lighting, shadows
  readability: number; // Product visibility and focus
  clutter: number; // Background noise vs product prominence
  trust: number; // Professionalism and "marketplace readiness"
  composition: number; // Rule of thirds, centering, etc.
};

export type CriticFeedback = {
  score: VisualCriticScore;
  flags: string[]; // e.g., ["floating_object", "busy_background", "poor_lighting"]
  suggestions: string[]; // e.g., ["Increase product shadow", "Blur background more"]
};

export type RegenerationDecision = {
  shouldRegenerate: boolean;
  reason?: string;
  improvedPromptDirectives?: string[];
  maxRetriesReached: boolean;
};

export interface TasteProfile {
  platform: 'shopee' | 'tiktok' | 'xhs' | 'lazada';
  aesthetic: 'bright_clean' | 'energetic_vibrant' | 'lifestyle_minimal' | 'soft_dreamy';
  targetMetrics: Partial<VisualCriticScore>;
}
