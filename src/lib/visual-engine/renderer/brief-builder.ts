import { VisualStrategyObject, ProductIdentity, EngineInput } from '../types';
import { getRandomPhrase } from './vocabulary';
import { SHOPEE_MY_MODEL } from '../platform-intelligence/shopee';
import { ReconstructionMode } from '../layers/input-analyzer';

/**
 * Transforms the Visual Strategy Object into a natural language advertising brief.
 */
export function buildAdvertisingBrief(
  vso: VisualStrategyObject,
  identity: ProductIdentity,
  input?: EngineInput,
  reconstructionMode: ReconstructionMode = 'preserve'
): string {
  const parts: string[] = [];

  // 1. RECONSTRUCTION STRATEGY (Highest Priority for messy inputs)
  if (reconstructionMode === 'rebuild') {
    parts.push("STRATEGY: FULL COMMERCIAL RECONSTRUCTION. The original background is low-quality or cluttered. Extract the product subject precisely and reconstruct a completely new, professional studio scene. Focus on clean lighting and a premium commercial aesthetic.");
  } else {
    parts.push("STRATEGY: IDENTITY PRESERVATION. The input quality is high. Focus on protecting the original product's lighting, texture, and labels while professionally enhancing the immediate environment.");
  }

  // 2. Anchor Protection (Deterministic)
  const anchorLayer = `STRICTLY PRESERVE the product's ${identity.sellingPoint || 'original appearance'}. Do not simplify or change the colors of the ${identity.name}. The branding and logo on the product packaging must remain exactly as shown in the original image, without any alteration.`;
  parts.push(anchorLayer);

  // 3. Narrative Goal (Contextual)
  if (input?.imageType === 'main') {
    parts.push("NARRATIVE GOAL: High-conversion marketplace hero shot. Centered composition on a clean, professional background. Maximum product visibility for mobile shoppers.");
  } else if (input?.narrativeGoal === 'usp') {
    parts.push(`NARRATIVE GOAL: Highlight unique selling point: ${identity.sellingPoint}.`);
  }

  // 4. Platform Specific Optimization
  if (vso.audience === 'mass_market_shopee') {
    parts.push(`COMMERCIAL DIRECTIVE: Optimize for Shopee Malaysia. Use high brightness and vibrant contrast to ensure the product stands out in search results.`);
  }

  // 5. Visual Layer (Stochastic / Diverse)
  parts.push(`${getRandomPhrase('mood', vso.mood)} ${getRandomPhrase('lighting', vso.lighting)} ${getRandomPhrase('composition', vso.composition)} ${getRandomPhrase('realism')}`);

  return parts.join(' ');
}
