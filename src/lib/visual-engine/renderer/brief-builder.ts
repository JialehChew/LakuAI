import { VisualStrategyObject, ProductIdentity } from '../types';
import { getRandomPhrase } from './vocabulary';
import { SHOPEE_MY_MODEL } from '../platform-intelligence/shopee';

export function buildAdvertisingBrief(vso: VisualStrategyObject, identity: ProductIdentity): string {
  const parts: string[] = [];

  // 1. Anchor Protection Layer (DETERMINISTIC)
  const anchorLayer = `STRICTLY PRESERVE the product's ${identity.sellingPoint || 'original appearance'}. Do not simplify or change the colors of the ${identity.name}. The branding and logo on the product packaging must remain exactly as shown in the original image, without any alteration.`;
  parts.push(anchorLayer);

  // 2. Identity/Brief Layer (DETERMINISTIC)
  parts.push(`The product is ${identity.name}. Its core features are ${identity.sellingPoint || 'premium quality'}.`);

  // 3. Platform Specific Commercial Layer
  if (vso.audience === 'mass_market_shopee') {
    parts.push(`Visual Priority: ${SHOPEE_MY_MODEL.visualPriorities[0]}. This is for a Shopee Malaysia listing, so ensure maximum brightness and contrast for mobile shoppers.`);
  }

  // 4. Environment/Visual Layer (STOCHASTIC / Controlled Diversity)
  const moodPhrase = getRandomPhrase('mood', vso.mood);
  const lightingPhrase = getRandomPhrase('lighting', vso.lighting);
  const compositionPhrase = getRandomPhrase('composition', vso.composition);
  const realismPhrase = getRandomPhrase('realism');

  parts.push(`${moodPhrase} ${lightingPhrase} ${compositionPhrase} ${realismPhrase}`);

  // 5. Quality Standard Layer (DETERMINISTIC)
  parts.push("High-end commercial photography, sharp focus on product, clean professional background integration. No artistic distortions or unnecessary complexity.");

  return parts.join(' ');
}
