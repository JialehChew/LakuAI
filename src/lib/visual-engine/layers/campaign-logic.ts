import { VisualStrategyObject, CampaignContext } from '../types';
import { CAMPAIGN_RULES } from '../constants/campaigns';

/**
 * Adjusts the visual strategy based on active marketing campaigns.
 */
export function applyCampaignRules(strategy: VisualStrategyObject, campaign?: CampaignContext): VisualStrategyObject {
  if (!campaign || campaign.type === 'none') return strategy;

  const rules = CAMPAIGN_RULES[campaign.type];
  if (!rules) return strategy;

  return {
    ...strategy,
    mood: rules.mood || strategy.mood,
    lighting: rules.lighting || strategy.lighting,
    conversionGoal: campaign.promoEnergy === 'high' ? 'stop_the_scroll' : strategy.conversionGoal
  };
}
