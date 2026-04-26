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
  };
  output: {
    resultUrl: string;
  };
}

export function logGeneration(log: GenerationLog) {
  // In a production environment, this would go to a database or structured log aggregator.
  // For benchmarking, we log to console for easy extraction from Render/Local logs.
  console.log('--- VISUAL INTELLIGENCE LOG START ---');
  console.log(JSON.stringify(log, null, 2));
  console.log('--- VISUAL INTELLIGENCE LOG END ---');
}
