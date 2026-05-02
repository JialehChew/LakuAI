import { VisualStrategyObject, ProductIdentity, EngineInput } from '../types';
import { getRandomPhrase } from './vocabulary';
import { selectScene } from '@/core/commerce/scenes';
import { getCommercialComposition } from '@/core/commerce/composition';

/**
 * LakuAI V3: Augmented Brief Renderer
 * Assembles PIO, Scene Library, Composition Engine, and Critic Directives into professional directions.
 */
export function buildAdvertisingBrief(
  vso: VisualStrategyObject,
  identity: ProductIdentity,
  input?: EngineInput,
  reconstructionMode: string = 'preserve',
  useAIIsolationFallback: boolean = false,
  criticDirectives?: string[]
): string {
  const parts: string[] = [];
  const pio = identity.pio;
  const platform = input?.platform || 'shopee';

  // 1. RECONSTRUCTION STRATEGY (V2 Core)
  if (reconstructionMode === 'rebuild') {
    if (useAIIsolationFallback) {
      parts.push("STRATEGY: AI ISOLATION MODE. IGNORE the original background completely. Reconstruct the product in a clean commercial studio environment.");
    } else {
      parts.push("STRATEGY: FULL COMMERCIAL RECONSTRUCTION. Place extracted subject in a new, high-end professional studio scene.");
    }
  }

  // 2. CRITIC FEEDBACK (V3 Priority)
  if (criticDirectives && criticDirectives.length > 0) {
    parts.push(`CRITIC IMPROVEMENTS REQUIRED: ${criticDirectives.join(', ')}. Priority: Fix these issues.`);
  }

  // 3. Scene Strategy (V2 Core)
  const scene = selectScene(identity.category, platform);
  parts.push(`SCENE STRATEGY: ${scene.mood}. The product is set in a ${scene.lighting} environment with a ${scene.composition} layout.`);

  // 4. Commercial Composition (V2 Core)
  const framing = getCommercialComposition(platform, input?.imageType || 'main');
  parts.push(`COMPOSITION: Subject scale is ${framing.subjectScale}. Position the ${identity.name} with ${framing.negativeSpace} negative space.`);

  // 5. Identity Fingerprint
  parts.push(`STRICTLY PRESERVE the ${pio?.material || 'original'} material and ${pio?.textureProfile || 'form'} of the ${identity.name}. No alterations to logos or labels.`);

  // 6. Visual Layer (No Jargon)
  parts.push(`${getRandomPhrase('mood', vso.mood)} ${getRandomPhrase('lighting', vso.lighting)} ${getRandomPhrase('realism')}`);

  return parts.join(' ');
}
