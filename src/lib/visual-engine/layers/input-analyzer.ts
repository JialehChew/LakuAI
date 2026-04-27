import { EngineInput, ProductCategory } from '../types';

export type ReconstructionMode = 'preserve' | 'rebuild';

export interface InputAnalysis {
  productVisibility: 'clear' | 'obstructed' | 'small';
  backgroundComplexity: 'low' | 'medium' | 'high';
  lightingQuality: 'good' | 'underexposed' | 'overexposed' | 'noisy';
  compositionScore: number; // 0-100
  reconstructionMode: ReconstructionMode;
}

/**
 * Analyzes the merchant input to decide on the best production strategy.
 */
export function analyzeInput(input: EngineInput, category: ProductCategory): InputAnalysis {
  // In Phase 1, we use heuristic mapping. Future: integrate with Vision AI
  const isHighIdentity = ['jewelry', 'cosmetics', 'food', 'wellness'].includes(category);

  // High identity products default to Preserve to protect labels/details
  // Generic items default to Rebuild to fix poor merchant photography
  const mode: ReconstructionMode = isHighIdentity ? 'preserve' : 'rebuild';

  return {
    productVisibility: 'clear', // Default heuristic
    backgroundComplexity: 'medium',
    lightingQuality: 'good',
    compositionScore: 70,
    reconstructionMode: mode
  };
}
