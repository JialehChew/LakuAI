import { VisualStrategyObject } from '../types';
import { COMPOSITION_RULES } from '../constants/composition-rules';

export function applyCompositionRules(strategy: VisualStrategyObject, platform: string, imageType: string, historicalTrends?: any): VisualStrategyObject {
  const ruleKey = `${platform.toLowerCase()}_${imageType.toLowerCase()}` as keyof typeof COMPOSITION_RULES;
  let rule = { ...COMPOSITION_RULES[ruleKey] };

  // ADAPTIVE OVERRIDE: If data shows a trend for better performance
  // In a real system, historicalTrends would be fetched from strategy-performance.json
  if (historicalTrends?.boostScale) {
    rule.subjectScale = Math.min(1.0, (rule.subjectScale || 0.7) + 0.1);
  }

  if (rule && Object.keys(rule).length > 0) {
    return {
      ...strategy,
      composition: (rule as any).subjectPosition || 'centered',
      framing: (rule as any).subjectScale > 0.75 ? 'tight' : 'medium',
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
