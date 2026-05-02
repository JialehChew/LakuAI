import { ProductCategory } from '@/lib/visual-engine/types';

export interface ProductIntelligenceObject {
  category: ProductCategory;
  subcategory: string;
  material: string;
  commercialStyle: string;
  marketplaceBehavior: string;
  photographyStrategy: string;
  preservationRisk: 'low' | 'medium' | 'high' | 'extreme';
  shapeProfile: string;
  textureProfile: string;
}

/**
 * Transforms raw input into a rich Product Intelligence Object (PIO).
 * This forms the semantic foundation for all downstream visual decisions.
 */
export function inferProductIntelligence(productName: string, sellingPoint: string): ProductIntelligenceObject {
  const text = (productName + ' ' + sellingPoint).toLowerCase();

  // Default values
  let pio: ProductIntelligenceObject = {
    category: 'general',
    subcategory: 'standard_item',
    material: 'various',
    commercialStyle: 'clean_commercial',
    marketplaceBehavior: 'balanced',
    photographyStrategy: 'centered_hero',
    preservationRisk: 'medium',
    shapeProfile: 'organic',
    textureProfile: 'matte'
  };

  // Semantic Inference
  if (text.includes('cable') || text.includes('usb')) {
    pio = { ...pio, category: 'electronics', subcategory: 'charging_cable', material: 'braided_nylon', commercialStyle: 'tech_minimalist', photographyStrategy: 'top_down_flatlay', preservationRisk: 'medium', shapeProfile: 'cylindrical_flexible' };
  } else if (text.includes('serum') || text.includes('skincare')) {
    pio = { ...pio, category: 'cosmetics', subcategory: 'glass_bottle', material: 'frosted_glass', commercialStyle: 'premium_wellness', photographyStrategy: 'macro_eye_level', preservationRisk: 'high', textureProfile: 'pearlescent' };
  } else if (text.includes('brooch') || text.includes('jewelry')) {
    pio = { ...pio, category: 'jewelry', subcategory: 'decorative_accessory', material: 'metal_pearl', commercialStyle: 'luxury_fashion', photographyStrategy: 'macro_tilt_angle', preservationRisk: 'extreme', textureProfile: 'reflective_glossy' };
  } else if (text.includes('sambal') || text.includes('sauce')) {
    pio = { ...pio, category: 'food', subcategory: 'glass_jar', material: 'glass_paper', commercialStyle: 'authentic_kitchen', photographyStrategy: '45_degree_hero', preservationRisk: 'high', textureProfile: 'vibrant_viscous' };
  }

  return pio;
}
