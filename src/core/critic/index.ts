import { CriticFeedback, VisualCriticScore, RegenerationDecision, TasteProfile } from './types';
import { evaluateThumbnailPotential } from '@/lib/visual-engine/utils/thumbnail-evaluator';

export class VisualCriticEngine {
  /**
   * Evaluates a generated image against commercial and aesthetic benchmarks.
   */
  async evaluate(imageUrl: string, profile: TasteProfile, retryCount: number = 0): Promise<CriticFeedback> {
    // Simulating vision analysis latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated scoring logic with slight bias towards improvement on retries
    const baseScore = 70 + (retryCount * 5);
    const variance = () => Math.floor(Math.random() * 15);

    // V3: Simulated Multi-Scale Thumbnail Evaluation
    const thumb64 = evaluateThumbnailPotential(0.5, retryCount > 0 ? 'low' : 'high');
    const thumb128 = evaluateThumbnailPotential(0.7, retryCount > 0 ? 'low' : 'medium');

    const combinedThumbScore = (thumb64.recognizabilityScore + thumb128.recognizabilityScore) / 2;

    const score: VisualCriticScore = {
      overall: Math.min(95, baseScore + variance()),
      realism: Math.min(100, 75 + variance() + (retryCount * 2)),
      readability: Math.min(100, (combinedThumbScore + 80) / 2),
      clutter: Math.max(0, 30 - variance() - (retryCount * 5)),
      trust: Math.min(100, 80 + variance()),
      composition: Math.min(100, 70 + variance()),
    };

    const flags: string[] = [];
    const suggestions: string[] = [];

    if (score.realism < 80) {
      flags.push('lighting_inconsistency');
      suggestions.push('Improve contact shadows under the product');
    }

    if (score.clutter > 25) {
      flags.push('busy_background');
      suggestions.push('Simplify background elements to keep focus on product');
    }

    if (thumb64.readabilityVerdict === 'fail') {
      flags.push('poor_mobile_visibility');
      suggestions.push('Product is too small for 64x64 mobile thumbnails. Increase subject scale.');
    } else if (score.readability < 85) {
      flags.push('low_contrast');
      suggestions.push('Increase contrast between product and background for better thumbnail visibility');
    }

    return { score, flags, suggestions };
  }

  determineRegeneration(feedback: CriticFeedback, profile: TasteProfile, retryCount: number): RegenerationDecision {
    const MAX_RETRIES = 1;
    const targets = profile.targetMetrics;

    let shouldRegenerate = false;
    const improvedPromptDirectives: string[] = [];

    // Check against target metrics
    if (targets.readability && feedback.score.readability < targets.readability) {
      shouldRegenerate = true;
      improvedPromptDirectives.push("ensure high contrast and clear product visibility");
    }

    if (targets.realism && feedback.score.realism < targets.realism) {
      shouldRegenerate = true;
      improvedPromptDirectives.push("photorealistic lighting, soft professional shadows");
    }

    if (targets.clutter && feedback.score.clutter > targets.clutter) {
      shouldRegenerate = true;
      improvedPromptDirectives.push("cleaner background, minimal distractions");
    }

    // V3: Mobile Thumbnail Priority
    if (feedback.flags.includes('poor_mobile_visibility')) {
      shouldRegenerate = true;
      improvedPromptDirectives.push("CLOSE-UP SHOT, product occupies 80% of frame, simple background");
    }

    if (retryCount >= MAX_RETRIES || feedback.score.overall > 88) {
      shouldRegenerate = false;
    }

    return {
      shouldRegenerate,
      reason: shouldRegenerate ? feedback.suggestions[0] : undefined,
      improvedPromptDirectives,
      maxRetriesReached: retryCount >= MAX_RETRIES
    };
  }
}

export const visualCritic = new VisualCriticEngine();
