import { TasteProfile } from '../critic/types';
import { MARKETPLACE_PROFILES } from './types';

export class TasteEngine {
  /**
   * Retrieves the target aesthetic and metric benchmarks for a specific marketplace.
   */
  getProfile(platform: string): TasteProfile {
    const normalizedPlatform = platform.toLowerCase();
    return MARKETPLACE_PROFILES[normalizedPlatform] || MARKETPLACE_PROFILES.shopee;
  }

  /**
   * Returns specific prompt modifiers based on the marketplace's "taste".
   */
  getTasteModifiers(platform: string): string[] {
    const profile = this.getProfile(platform);

    switch (profile.aesthetic) {
      case 'bright_clean':
        return ['bright studio lighting', 'high-key photography', 'minimalist clean background', 'sharp product focus'];
      case 'energetic_vibrant':
        return ['dynamic composition', 'saturated colors', 'lifestyle setting', 'modern urban backdrop'];
      case 'lifestyle_minimal':
        return ['soft natural sunlight', 'organic textures', 'neutral earth tones', 'muted aesthetic'];
      case 'soft_dreamy':
        return ['pastel color palette', 'dreamy bokeh', 'ethereal lighting', 'elegant presentation'];
      default:
        return [];
    }
  }
}

export const tasteEngine = new TasteEngine();
