import { VisualStrategyObject, ProductIdentity, EngineInput } from '../types';
import { getRandomPhrase } from './vocabulary';
import { SHOPEE_MY_MODEL } from '../platform-intelligence/shopee';
import { ReconstructionMode } from '../layers/input-analyzer';
import { generateFingerprintDirective } from '../identity/fingerprint';

export function buildAdvertisingBrief(
  vso: VisualStrategyObject,
  identity: ProductIdentity,
  input?: EngineInput,
  reconstructionMode: ReconstructionMode = 'preserve',
  useAIIsolationFallback: boolean = false
): string {
  const parts: string[] = [];

  // 1. IDENTITY FINGERPRINT (Highest Priority)
  parts.push(generateFingerprintDirective(identity));

  // 2. RECONSTRUCTION STRATEGY
  if (reconstructionMode === 'rebuild') {
    if (useAIIsolationFallback) {
      parts.push("STRATEGY: AI ISOLATION MODE. IGNORE the original background completely. Identify and preserve ONLY the primary commercial product subject. Do not preserve the original environment objects or colors. Reconstruct the product in a clean commercial studio environment.");
    } else {
      parts.push("STRATEGY: FULL COMMERCIAL RECONSTRUCTION. Place extracted subject in a new, high-end professional studio scene.");
    }
  } else {
    parts.push("STRATEGY: IDENTITY PRESERVATION. Maintain exact lighting and spatial relationship while enhancing background.");
  }

  // 3. Anchor Protection
  parts.push(`STRICTLY PRESERVE ${identity.name}'s ${identity.sellingPoint || 'appearance'}. No alterations to branding or logos.`);

  // 4. Narrative Goal
  if (input?.imageType === 'main') {
    parts.push("NARRATIVE GOAL: Premium marketplace hero shot. Centered product, maximum visibility.");
  }

  // 5. Semantic Brief
  parts.push(`COMMERCIAL OBJECT: ${identity.name}. KEY FEATURE: ${identity.sellingPoint || 'premium build'}.`);

  // 6. Platform Optimization
  if (vso.audience === 'mass_market_shopee') {
    parts.push(`VISUAL PRIORITY: Shopee Malaysia mobile readability. High contrast and clean shadows.`);
  }

  // 7. Visual Layer
  parts.push(`${getRandomPhrase('mood', vso.mood)} ${getRandomPhrase('lighting', vso.lighting)} ${getRandomPhrase('composition', vso.composition)} ${getRandomPhrase('realism')}`);

  return parts.join(' ');
}
