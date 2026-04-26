export interface SuiteImageDefinition {
  type: string;
  narrativeGoal: 'attention' | 'usp' | 'lifestyle' | 'trust' | 'info';
  description: string;
}

export const PLATFORM_SUITES: Record<string, SuiteImageDefinition[]> = {
  shopee: [
    { type: 'main', narrativeGoal: 'attention', description: 'Clean hero shot for maximum click-through' },
    { type: 'usp', narrativeGoal: 'usp', description: 'Close-up on primary feature/benefit' },
    { type: 'lifestyle', narrativeGoal: 'lifestyle', description: 'Product in a realistic usage setting' },
    { type: 'info', narrativeGoal: 'info', description: 'High negative space for technical specs' },
    { type: 'poster', narrativeGoal: 'trust', description: 'Branded promotional layout' }
  ],
  tiktok: [
    { type: 'main', narrativeGoal: 'attention', description: 'High-energy scroll-stopper cover' },
    { type: 'lifestyle', narrativeGoal: 'lifestyle', description: 'Action-oriented usage frame' },
    { type: 'poster', narrativeGoal: 'trust', description: 'Flash sale / trending promotion' }
  ],
  xiaohongshu: [
    { type: 'lifestyle', narrativeGoal: 'attention', description: 'Hero lifestyle with blogger aesthetic' },
    { type: 'usp', narrativeGoal: 'usp', description: 'Emotional close-up of product details' },
    { type: 'poster', narrativeGoal: 'info', description: 'Minimalist info graphic' }
  ]
};
