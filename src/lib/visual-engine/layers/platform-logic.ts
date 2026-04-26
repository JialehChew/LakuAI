import { VisualStrategyObject } from '../types';
import { SHOPEE_MY_MODEL } from '../platform-intelligence/shopee';
import { TIKTOK_MY_MODEL } from '../platform-intelligence/tiktok';
import { XHS_MY_MODEL } from '../platform-intelligence/xiaohongshu';

export function applyPlatformRules(strategy: VisualStrategyObject, platform: string): VisualStrategyObject {
  const p = platform.toLowerCase();

  if (p === 'shopee') {
    return {
      ...strategy,
      platformBehavior: SHOPEE_MY_MODEL.realismExpectation === 'commercial_polished' ? 'high_saturation_mobile' : 'neutral_balanced',
      mood: 'vibrant',
      audience: 'mass_market_shopee'
    };
  }

  if (p === 'xiaohongshu') {
    return {
      ...strategy,
      platformBehavior: 'pastel_blogger_aesthetic',
      mood: 'dreamy',
      lighting: 'soft_diffused'
    };
  }

  if (p === 'tiktok') {
    return {
      ...strategy,
      mood: 'vibrant',
      audience: 'gen_z_malaysia'
    };
  }

  return strategy;
}
