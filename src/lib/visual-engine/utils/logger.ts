import { VisualStrategyObject, ProductIdentity } from '../types';

export interface GenerationLog {
  timestamp: string;
  input: {
    productName?: string;
    platform: string;
    imageType: string;
    rawInputUrl: string;
  };
  engine: {
    name: 'legacy' | 'visual-engine';
    vso?: VisualStrategyObject;
    spio?: ProductIdentity;
    finalPrompt: string;
    consistencyCheck?: {
      lightingMatch: boolean;
      colorHarmony: boolean;
    };
  };
  output: {
    resultUrl: string;
  };
}

export function logGeneration(log: GenerationLog) {
  // Log to console for initial validation phase
  console.log('--- VISUAL INTELLIGENCE LOG START ---');
  console.log(JSON.stringify(log, null, 2));
  console.log('--- VISUAL INTELLIGENCE LOG END ---');
}
