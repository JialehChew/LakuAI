export type ProductCategory = 'jewelry' | 'wellness' | 'food' | 'cosmetics' | 'fashion' | 'electronics' | 'home_living' | 'general';

export interface ProductIdentity {
  name: string;
  category: ProductCategory;
  coreShape?: string;
  primaryColor?: string;
  sellingPoint?: string;
  structuralRisks?: any[];
  brandMood?: string; // New: Brand consistency
  lightingFeel?: string; // New: Brand consistency
}

export interface VisualStrategyObject {
  mood: 'vibrant' | 'minimalist' | 'dreamy' | 'commercial_clean' | 'warm_lifestyle';
  lighting: 'soft_diffused' | 'golden_hour' | 'natural_daylight' | 'high_contrast_studio';
  composition: 'centered' | 'rule_of_thirds' | 'macro_detail' | 'eye_level';
  framing: 'tight' | 'wide' | 'medium';
  negativeSpace: 'none' | 'left' | 'right' | 'top' | 'bottom';
  audience: 'gen_z_malaysia' | 'premium_luxury' | 'mass_market_shopee' | 'general_consumer';
  localization: 'modern_kl_home' | 'tropical_garden' | 'local_neighborhood_store' | 'none';
  conversionGoal: 'stop_the_scroll' | 'showcase_utility' | 'build_premium_trust';
  textureFocus: boolean;
  platformBehavior: 'high_saturation_mobile' | 'pastel_blogger_aesthetic' | 'neutral_balanced';
}

export interface EngineInput {
  image: string;
  platform: string;
  imageType: string;
  product?: string;
  sellingPoint?: string;
  scenario?: string;
  narrativeGoal?: string; // New: Workflow orchestration
}
