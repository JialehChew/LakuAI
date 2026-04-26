export interface ThumbnailMetrics {
  scale: number;
  recognizabilityScore: number; // 0-100
  clutterPenalty: number;
  readabilityVerdict: 'pass' | 'fail' | 'marginal';
}

/**
 * Heuristic logic for evaluating how well a generation will perform at mobile thumbnail sizes.
 */
export function evaluateThumbnailPotential(subjectScale: number, backgroundComplexity: 'low' | 'medium' | 'high'): ThumbnailMetrics {
  let recognizability = subjectScale * 100;
  let penalty = 0;

  if (backgroundComplexity === 'high') penalty = 20;
  if (backgroundComplexity === 'medium') penalty = 10;

  recognizability -= penalty;

  return {
    scale: subjectScale,
    recognizabilityScore: Math.max(0, recognizability),
    clutterPenalty: penalty,
    readabilityVerdict: recognizability > 60 ? 'pass' : recognizability > 40 ? 'marginal' : 'fail'
  };
}
