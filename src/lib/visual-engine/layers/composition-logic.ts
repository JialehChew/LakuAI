import { VisualStrategyObject } from '../types';
import { COMPOSITION_RULES } from '../constants/composition-rules';

export function applyCompositionRules(strategy: VisualStrategyObject, platform: string, imageType: string): VisualStrategyObject {
  const ruleKey = `${platform.toLowerCase()}_${imageType.toLowerCase()}` as keyof typeof COMPOSITION_RULES;
  const rule = COMPOSITION_RULES[ruleKey];

  if (rule) {
    // Map existing VSO keys to these specific rules
    return {
      ...strategy,
      composition: rule.subjectPosition as any,
      // Framing 'medium' corresponds to our 0.7 scale roughly
      framing: rule.subjectScale > 0.7 ? 'tight' : 'medium',
    };
  }

  // PHASE 1: Default to centered for Main Image if no specific rule found
  if (imageType.toLowerCase() === 'main') {
    return {
      ...strategy,
      composition: 'centered',
      framing: 'medium',
      negativeSpace: 'none'
    };
  }

  return strategy;
}
