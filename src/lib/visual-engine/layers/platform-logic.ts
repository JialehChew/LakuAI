import { VisualStrategyObject } from '../types';

export function applyPlatformRules(strategy: VisualStrategyObject, platform: string): VisualStrategyObject {
  switch (platform.toLowerCase()) {
    case 'shopee':
      return {
        ...strategy,
        platformBehavior: 'high_saturation_mobile',
        mood: 'vibrant',
        audience: 'mass_market_shopee'
      };
    case 'xiaohongshu':
      return {
        ...strategy,
        platformBehavior: 'pastel_blogger_aesthetic',
        mood: 'dreamy',
        lighting: 'soft_diffused'
      };
    case 'tiktok':
      return {
        ...strategy,
        mood: 'vibrant',
        audience: 'gen_z_malaysia'
      };
    default:
      return strategy;
  }
}
