import { ProductCategory, ProductIdentity, EngineInput } from '../types';
import { inferProductIntelligence } from '@/core/vision/product-understanding';

/**
 * Bridges the legacy analyzer to the new v2 Vision Intelligence layer.
 */
export function analyzeProduct(input: EngineInput): ProductIdentity {
  const pio = inferProductIntelligence(input.product || 'product', input.sellingPoint || '');

  return {
    name: input.product || 'product',
    category: pio.category,
    sellingPoint: input.sellingPoint,
    brandMood: pio.commercialStyle,
    lightingFeel: pio.photographyStrategy,
    // Add V2 metadata to identity
    pio: pio
  };
}
