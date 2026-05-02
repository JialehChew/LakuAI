export type ProductCategory = 'jewelry' | 'wellness' | 'food' | 'cosmetics' | 'fashion' | 'electronics' | 'home_living' | 'general';

export interface ProductIdentity {
  name: string;
  category: ProductCategory;
  coreShape?: string;
  primaryColor?: string;
  sellingPoint?: string;
  structuralRisks?: any[];
  brandMood?: string;
  lightingFeel?: string;
  pio?: any; // New: Product Intelligence Object v2
}

export interface BrandIdentity {
  id: string;
  name: string;
  preferredStyle: string;
  targetAudience: string;
  defaultPlatform: string;
  moodDirection: string;
  commercialTone: 'premium' | 'friendly' | 'energetic' | 'minimalist';
  localizationPreference: 'urban' | 'tropical' | 'traditional';
}

export interface CampaignContext {
  id: string;
  type: 'raya' | 'cny' | 'merdeka' | 'sale_11_11' | 'sale_12_12' | 'seasonal' | 'none';
  promoEnergy: 'high' | 'medium' | 'low';
  colorFocus?: string[];
}

export interface CommercialInsight {
  id: string;
  type: 'readability' | 'trend' | 'preservation' | 'workflow';
  message: string;
  impact: 'low' | 'medium' | 'high';
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
  narrativeGoal?: string;
  brand?: BrandIdentity;
  campaign?: CampaignContext;
  isRefresh?: boolean;
}
