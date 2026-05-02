import { VisualStrategyObject } from '@/lib/visual-engine/types';

export interface VisualMemory {
  lightingDirection: string;
  shadowBehavior: string;
  colorPalette: string[];
  contrastProfile: string;
  sceneEnergy: 'calm' | 'dynamic';
}

/**
 * Tracks and propagates visual traits across a generation suite.
 */
export class VisualMemorySystem {
  private memory: VisualMemory | null = null;

  lockMemory(vso: VisualStrategyObject) {
    this.memory = {
      lightingDirection: vso.lighting === 'golden_hour' ? 'side-lit' : 'diffused-top',
      shadowBehavior: 'soft-contact',
      colorPalette: [], // future extraction
      contrastProfile: vso.mood === 'vibrant' ? 'high' : 'standard',
      sceneEnergy: vso.mood === 'vibrant' ? 'dynamic' : 'calm'
    };
  }

  getDirective(): string {
    if (!this.memory) return "";
    return `CONSISTENCY: Use ${this.memory.lightingDirection} lighting and ${this.memory.shadowBehavior} shadows. Maintain the established ${this.memory.contrastProfile} contrast profile from previous shots.`;
  }
}
