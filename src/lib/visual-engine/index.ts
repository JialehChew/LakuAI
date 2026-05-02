import { EngineInput, VisualStrategyObject, ProductIdentity } from './types';
import { analyzeProduct } from './layers/product-analyzer';
import { applyPlatformRules } from './layers/platform-logic';
import { applyCompositionRules } from './layers/composition-logic';
import { applyBrandMemory } from './identity/brand-memory';
import { applyCampaignRules } from './layers/campaign-logic';
import { buildAdvertisingBrief } from './renderer/brief-builder';
import { analyzeInput, ReconstructionMode } from './layers/input-analyzer';

/**
 * Orchestrates Multi-Pass Commercial Reconstruction (LakuAI V2).
 */
export function generateVisualPrompt(
  input: EngineInput,
  useAIIsolationFallback: boolean = false,
  criticDirectives?: string[]
): {
  prompt: string;
  vso: VisualStrategyObject;
  identity: ProductIdentity;
  reconstructionMode: ReconstructionMode;
} {
  const identity = analyzeProduct(input);
  const analysis = analyzeInput(input, identity.category);

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

  vso = applyBrandMemory(vso, input.brand);
  vso = applyPlatformRules(vso, input.platform);
  vso = applyCampaignRules(vso, input.campaign);
  vso = applyCompositionRules(vso, input.platform, input.imageType);

  // V2/V3: Ingest the isolation fallback flag and critic directives into the brief builder
  const prompt = buildAdvertisingBrief(vso, identity, input, analysis.reconstructionMode, useAIIsolationFallback, criticDirectives);

  return { prompt, vso, identity, reconstructionMode: analysis.reconstructionMode };
}
