import { TasteProfile } from '../critic/types';

export const MARKETPLACE_PROFILES: Record<string, TasteProfile> = {
  shopee: {
    platform: 'shopee',
    aesthetic: 'bright_clean',
    targetMetrics: {
      readability: 90,
      clutter: 20,
      realism: 70
    }
  },
  tiktok: {
    platform: 'tiktok',
    aesthetic: 'energetic_vibrant',
    targetMetrics: {
      readability: 80,
      clutter: 40,
      trust: 85
    }
  },
  xhs: {
    platform: 'xhs',
    aesthetic: 'lifestyle_minimal',
    targetMetrics: {
      realism: 95,
      composition: 90,
      trust: 90
    }
  }
};
