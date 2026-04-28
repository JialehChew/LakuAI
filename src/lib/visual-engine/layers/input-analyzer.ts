import { EngineInput, ProductCategory } from '../types';

export type ReconstructionMode = 'preserve' | 'rebuild';

export interface InputAnalysis {
  productVisibility: 'clear' | 'obstructed' | 'small';
  backgroundComplexity: 'low' | 'medium' | 'high';
  lightingQuality: 'good' | 'underexposed' | 'overexposed' | 'noisy';
  compositionScore: number;
  reconstructionMode: ReconstructionMode;
}

/**
 * Analyzes the merchant input to decide on the best production strategy.
 * Aggressively triggers 'rebuild' for cluttered backgrounds.
 */
export function analyzeInput(input: EngineInput, category: ProductCategory): InputAnalysis {
  const isHighIdentity = ['jewelry', 'cosmetics', 'food', 'wellness'].includes(category);

  // REAL REBUILD LOGIC: If a scenario is provided, we often need to rebuild the environment.
  // In Phase 2, we assume most merchant phone photos benefit from full reconstruction.
  let mode: ReconstructionMode = 'rebuild';

  if (isHighIdentity && !input.scenario) {
    mode = 'preserve';
  }

  return {
    productVisibility: 'clear',
    backgroundComplexity: 'high', // Assume high to trigger isolation
    lightingQuality: 'good',
    compositionScore: 50,
    reconstructionMode: mode
  };
}
