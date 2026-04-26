import { VisualStrategyObject } from '../types';

export function applyCompositionRules(strategy: VisualStrategyObject, imageType: string): VisualStrategyObject {
  // PHASE 1: Focus ONLY on Main Image
  if (imageType.toLowerCase() === 'main') {
    return {
      ...strategy,
      composition: 'centered',
      framing: 'medium',
      negativeSpace: 'none'
    };
  }

  // Fallback for other types during Phase 1
  return strategy;
}
