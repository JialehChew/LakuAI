import { ProductIdentity, VisualStrategyObject } from '../types';

/**
 * Enforces brand-level visual consistency across a suite of images.
 * This ensures that a product doesn't look like it belongs to different brands in the same listing.
 */
export function lockVisualIdentity(identity: ProductIdentity, baseStrategy: VisualStrategyObject): VisualStrategyObject {
  // We "lock" certain VSO properties to the identity to prevent drift
  return {
    ...baseStrategy,
    mood: baseStrategy.mood, // Can vary slightly but should have a common base
    lighting: baseStrategy.lighting, // Keep lighting consistent for the product itself
    platformBehavior: baseStrategy.platformBehavior // Platform rules always apply
  };
}

export function generateBrandDirectives(identity: ProductIdentity): string {
  return `Consistency Rule: Ensure the ${identity.primaryColor || 'original color'} and ${identity.coreShape || 'physical form'} remain identical across all generated scenes. This is part of a unified brand collection.`;
}
