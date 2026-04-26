import { VisualStrategyObject, ProductIdentity } from '../types';
import { getRandomPhrase } from './vocabulary';

export function buildAdvertisingBrief(vso: VisualStrategyObject, identity: ProductIdentity): string {
  const parts: string[] = [];

  // 1. Instruction Layer (Highest Priority)
  parts.push(`STRICTLY PRESERVE the product's ${identity.sellingPoint || 'appearance'}. Do not simplify or change the colors of the ${identity.name}.`);

  // 2. Brief Layer
  parts.push(`The product is ${identity.name}. Its core features are ${identity.sellingPoint || 'premium quality'}.`);

  // 3. Environment/Visual Layer (Derived from VSO)
  const lightingPhrase = getRandomPhrase('lighting', vso.lighting);
  const compositionPhrase = getRandomPhrase('composition', vso.composition);
  const moodPhrase = getRandomPhrase('mood', vso.mood);

  parts.push(`${moodPhrase} ${lightingPhrase} ${compositionPhrase}`);

  // 4. Protection Layer
  parts.push("The branding and logo on the product packaging must remain exactly as shown in the original image, without any alteration. High-end commercial grade photography, sharp focus on product.");

  return parts.join(' ');
}
