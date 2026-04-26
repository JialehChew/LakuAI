import { EngineInput, VisualStrategyObject, ProductIdentity } from './types';
import { analyzeProduct } from './layers/product-analyzer';
import { applyPlatformRules } from './layers/platform-logic';
import { applyCompositionRules } from './layers/composition-logic';
import { buildAdvertisingBrief } from './renderer/brief-builder';

export function generateVisualPrompt(input: EngineInput): { prompt: string; vso: VisualStrategyObject; identity: ProductIdentity } {
  // 1. Initial Data Gathering
  const identity = analyzeProduct(input);

  // 2. Default Strategy
  let vso: VisualStrategyObject = {
    mood: 'commercial_clean',
    lighting: 'natural_daylight',
    composition: 'centered',
    framing: 'medium',
    negativeSpace: 'none',
    audience: 'general_consumer',
    localization: 'none',
    conversionGoal: 'showcase_utility',
    textureFocus: false,
    platformBehavior: 'neutral_balanced',
  };

  // 3. Layer Refinement
  vso = applyPlatformRules(vso, input.platform);
  vso = applyCompositionRules(vso, input.platform, input.imageType);

  // 4. Render to Brief
  const prompt = buildAdvertisingBrief(vso, identity);

  return { prompt, vso, identity };
}
