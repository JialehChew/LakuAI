import { BrandIdentity, VisualStrategyObject } from '../types';

/**
 * Applies persistent brand preferences to the current visual strategy.
 * Ensures long-term brand consistency across different products.
 */
export function applyBrandMemory(strategy: VisualStrategyObject, brand?: BrandIdentity): VisualStrategyObject {
  if (!brand) return strategy;

  const updated = { ...strategy };

  // Map commercial tone to mood
  if (brand.commercialTone === 'premium') updated.mood = 'commercial_clean';
  if (brand.commercialTone === 'energetic') updated.mood = 'vibrant';
  if (brand.commercialTone === 'minimalist') updated.mood = 'minimalist';

  // Map localization preference
  if (brand.localizationPreference === 'urban') updated.localization = 'modern_kl_home';
  if (brand.localizationPreference === 'tropical') updated.localization = 'tropical_garden';

  return updated;
}
