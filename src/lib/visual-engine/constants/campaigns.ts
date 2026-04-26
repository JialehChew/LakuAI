import { CampaignContext } from '../types';

export const CAMPAIGN_RULES: Record<string, any> = {
  raya: {
    mood: 'warm_lifestyle',
    lighting: 'golden_hour',
    colorBalance: 'warm_green_gold',
    emotionalTone: 'festive_family_warmth',
    environmentalCues: 'Traditional Malay architecture or modern festive decorations.'
  },
  cny: {
    mood: 'vibrant',
    lighting: 'high_contrast_studio',
    colorBalance: 'bold_red_gold',
    emotionalTone: 'prosperous_energetic',
    environmentalCues: 'CNY lanterns, bright red accents, celebratory atmosphere.'
  },
  sale_11_11: {
    mood: 'vibrant',
    lighting: 'high_contrast_studio',
    promoEnergy: 'high',
    emotionalTone: 'urgent_exciting',
    environmentalCues: 'High-energy commercial backgrounds, flash-sale aesthetic.'
  }
};
