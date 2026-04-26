import { VisualStrategyObject, ProductIdentity } from '../types';
import { getRandomPhrase } from './vocabulary';

export function buildAdvertisingBrief(vso: VisualStrategyObject, identity: ProductIdentity): string {
  const parts: string[] = [];

  // 1. Anchor Protection Layer (DETERMINISTIC - Highest Priority)
  const anchorLayer = `STRICTLY PRESERVE the product's ${identity.sellingPoint || 'original appearance'}. Do not simplify or change the colors of the ${identity.name}. The branding and logo on the product packaging must remain exactly as shown in the original image, without any alteration.`;
  parts.push(anchorLayer);

  // 2. Identity/Brief Layer (DETERMINISTIC)
  parts.push(`The product is ${identity.name}. Its core features are ${identity.sellingPoint || 'premium quality'}.`);

  // 3. Environment/Visual Layer (STOCHASTIC / Controlled Diversity)
  const moodPhrase = getRandomPhrase('mood', vso.mood);
  const lightingPhrase = getRandomPhrase('lighting', vso.lighting);
  const compositionPhrase = getRandomPhrase('composition', vso.composition);
  const realismPhrase = getRandomPhrase('realism');

  parts.push(`${moodPhrase} ${lightingPhrase} ${compositionPhrase} ${realismPhrase}`);

  // 4. Quality Standard Layer (DETERMINISTIC)
  parts.push("High-end commercial grade photography, sharp focus on product, professional background integration. No artistic distortions.");

  return parts.join(' ');
}
