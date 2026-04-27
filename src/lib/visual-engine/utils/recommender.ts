import { CommercialInsight, EngineInput } from '../types';

/**
 * Heuristic-based recommendation engine for daily merchant engagement.
 * Provides actionable tips based on current inputs and platform context.
 */
export function getCommercialRecommendations(input: EngineInput): CommercialInsight[] {
  const insights: CommercialInsight[] = [];

  if (input.platform.toLowerCase() === 'shopee') {
    insights.push({
      id: 'shopee-readability',
      type: 'readability',
      message: 'Shopee Tip: Increase product scale for better mobile thumbnail visibility.',
      impact: 'high'
    });
  }

  if (input.platform.toLowerCase() === 'xiaohongshu') {
    insights.push({
      id: 'xhs-trend',
      type: 'trend',
      message: 'Trend Alert: Soft, natural daylight is performing well on XHS right now.',
      impact: 'medium'
    });
  }

  if (!input.sellingPoint) {
    insights.push({
      id: 'missing-usp',
      type: 'workflow',
      message: 'Workflow Tip: Adding a Key Selling Point helps the AI preserve critical details.',
      impact: 'high'
    });
  }

  return insights;
}
