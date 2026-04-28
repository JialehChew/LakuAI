import { EngineInput, VisualStrategyObject, ProductIdentity } from './types';
import { analyzeProduct } from './layers/product-analyzer';
import { applyPlatformRules } from './layers/platform-logic';
import { applyCompositionRules } from './layers/composition-logic';
import { applyBrandMemory } from './identity/brand-memory';
import { applyCampaignRules } from './layers/campaign-logic';
import { buildAdvertisingBrief } from './renderer/brief-builder';
import { analyzeInput, ReconstructionMode } from './layers/input-analyzer';

/**
 * Orchestrates Multi-Pass Commercial Reconstruction.
 * 1. Extraction (Preprocessing)
 * 2. Semantic Understanding (Analysis)
 * 3. Environment Reconstruction (Briefing)
 * 4. Marketplace Optimization (Refinement)
 * 5. Identity Verification (Fingerprinting)
 */
export function generateVisualPrompt(input: EngineInput, useAIIsolationFallback: boolean = false): {
  prompt: string;
  vso: VisualStrategyObject;
  identity: ProductIdentity;
  reconstructionMode: ReconstructionMode;
} {
  // Step 1: Semantic Analysis
  const identity = analyzeProduct(input);

  // Step 2: Input Quality Analysis
  const analysis = analyzeInput(input, identity.category);

  // Step 3: Default Strategy Setup
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

  // Step 4: Visual Logic Multi-Pass
  vso = applyBrandMemory(vso, input.brand);
  vso = applyPlatformRules(vso, input.platform);
  vso = applyCampaignRules(vso, input.campaign);
  vso = applyCompositionRules(vso, input.platform, input.imageType);

  // Step 5: Final Brief Rendering (with Fingerprinting)
  const prompt = buildAdvertisingBrief(vso, identity, input, analysis.reconstructionMode, useAIIsolationFallback);

  return { prompt, vso, identity, reconstructionMode: analysis.reconstructionMode };
}
