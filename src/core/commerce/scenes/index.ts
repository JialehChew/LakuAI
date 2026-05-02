export interface CommercialScene {
  id: string;
  lighting: string;
  composition: string;
  mood: string;
  colorTemperature: 'warm' | 'cool' | 'neutral';
  marketplaceFit: string[];
}

export const SCENE_LIBRARY: Record<string, CommercialScene[]> = {
  electronics: [
    { id: 'clean-tech-desk', lighting: 'natural daylight from side window', composition: 'centered hero with productivity props', mood: 'professional productivity', colorTemperature: 'neutral', marketplaceFit: ['shopee', 'lazada'] },
    { id: 'minimal-abstract', lighting: 'soft diffused top light', composition: 'clean negative space on right', mood: 'premium tech', colorTemperature: 'cool', marketplaceFit: ['xiaohongshu'] }
  ],
  cosmetics: [
    { id: 'marble-spa', lighting: 'soft morning glow', composition: 'eye-level with skincare props', mood: 'luxury wellness', colorTemperature: 'warm', marketplaceFit: ['shopee', 'xiaohongshu'] },
    { id: 'natural-zen', lighting: 'bright crisp daylight', composition: 'centered on stone surface', mood: 'clinical purity', colorTemperature: 'neutral', marketplaceFit: ['lazada'] }
  ],
  jewelry: [
    { id: 'dark-velvet', lighting: 'focused spot lighting', composition: 'macro tilt angle', mood: 'high-end luxury', colorTemperature: 'neutral', marketplaceFit: ['shopee', 'tiktok'] }
  ],
  food: [
    { id: 'warm-kitchen', lighting: 'warm golden hour sun', composition: '45 degree angle on wooden table', mood: 'authentic freshness', colorTemperature: 'warm', marketplaceFit: ['shopee', 'tiktok'] }
  ]
};

export function selectScene(category: string, platform: string): CommercialScene {
  const options = SCENE_LIBRARY[category] || SCENE_LIBRARY.electronics;
  return options.find(s => s.marketplaceFit.includes(platform)) || options[0];
}
