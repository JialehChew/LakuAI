import { EngineInput, VisualStrategyObject, ProductIdentity } from './types';
import { analyzeProduct } from './layers/product-analyzer';
import { applyPlatformRules } from './layers/platform-logic';
import { applyCompositionRules } from './layers/composition-logic';
import { applyBrandMemory } from './identity/brand-memory';
import { applyCampaignRules } from './layers/campaign-logic';
import { buildAdvertisingBrief } from './renderer/brief-builder';
import { analyzeInput, ReconstructionMode } from './layers/input-analyzer';

export function generateVisualPrompt(input: EngineInput): {
  prompt: string;
  vso: VisualStrategyObject;
  identity: ProductIdentity;
  reconstructionMode: ReconstructionMode;
} {
  // 1. Product Intelligence
  const identity = analyzeProduct(input);

  // 2. Input Intelligence (NEW)
  const analysis = analyzeInput(input, identity.category);

  // 3. Default Strategy
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

  // 4. Layer Refinement
  vso = applyBrandMemory(vso, input.brand);
  vso = applyPlatformRules(vso, input.platform);
  vso = applyCampaignRules(vso, input.campaign);
  vso = applyCompositionRules(vso, input.platform, input.imageType);

  // 5. Render to Brief
  const prompt = buildAdvertisingBrief(vso, identity, input, analysis.reconstructionMode);

  return { prompt, vso, identity, reconstructionMode: analysis.reconstructionMode };
}
