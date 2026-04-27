import { VisualStrategyObject, ProductIdentity, EngineInput } from '../types';
import { getRandomPhrase } from './vocabulary';
import { SHOPEE_MY_MODEL } from '../platform-intelligence/shopee';

export function buildAdvertisingBrief(vso: VisualStrategyObject, identity: ProductIdentity, input?: EngineInput): string {
  const parts: string[] = [];

  // 1. Anchor Protection Layer (DETERMINISTIC)
  const anchorLayer = `STRICTLY PRESERVE the product's ${identity.sellingPoint || 'original appearance'}. Do not simplify or change the colors of the ${identity.name}. The branding and logo on the product packaging must remain exactly as shown in the original image, without any alteration.`;
  parts.push(anchorLayer);

  // 2. Brand Identity Layer
  const brandPhrase = getRandomPhrase('brand_consistency');
  parts.push(brandPhrase);

  // 3. Narrative Goal Injection (With Clean Hero Logic)
  if (input?.imageType === 'main') {
    parts.push("NARRATIVE GOAL: Premium marketplace hero shot. High-end professional product photography. Centered composition on a clean, simple, non-distracting background. Maximum product focus, sharp details, absolutely no cluttered or collage-like elements.");
  } else if (input?.narrativeGoal === 'attention') {
    parts.push("NARRATIVE GOAL: Capture immediate attention. The product should pop from the background with high contrast and sharp focus.");
  } else if (input?.narrativeGoal === 'trust') {
    parts.push("NARRATIVE GOAL: Build buyer trust. Focus on authentic materials and realistic lighting that looks like an unedited professional photo.");
  } else if (input?.narrativeGoal === 'usp') {
    parts.push(`NARRATIVE GOAL: Highlight the Unique Selling Point: ${identity.sellingPoint}.`);
  }

  // 4. Identity/Brief Layer
  parts.push(`The product is ${identity.name}. Its core features are ${identity.sellingPoint || 'premium quality'}.`);

  // 5. Platform Specific Commercial Layer
  if (vso.audience === 'mass_market_shopee') {
    parts.push(`Visual Priority: ${SHOPEE_MY_MODEL.visualPriorities[0]}. This is for a Shopee Malaysia listing, so ensure maximum brightness and contrast for mobile shoppers.`);
  }

  // 6. Environment/Visual Layer (STOCHASTIC)
  const moodPhrase = getRandomPhrase('mood', vso.mood);
  const lightingPhrase = getRandomPhrase('lighting', vso.lighting);
  const compositionPhrase = getRandomPhrase('composition', vso.composition);
  const realismPhrase = getRandomPhrase('realism');

  parts.push(`${moodPhrase} ${lightingPhrase} ${compositionPhrase} ${realismPhrase}`);

  // 7. Quality Standard Layer
  parts.push("High-end commercial grade photography, sharp focus on product, clean professional background integration. No artistic distortions.");

  return parts.join(' ');
}
