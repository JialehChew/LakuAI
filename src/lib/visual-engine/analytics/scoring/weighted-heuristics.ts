export interface StrategyWeight {
  key: string;
  weight: number; // 0.0 to 2.0, default 1.0
  successCount: number;
  failureCount: number;
}

/**
 * Manages adaptive weighting for visual strategies based on historical performance.
 * Higher weights increase the likelihood of selection or strength in the final prompt.
 */
export class StrategyWeightManager {
  private weights: Record<string, StrategyWeight> = {};

  updateWeight(key: string, score: number) {
    if (!this.weights[key]) {
      this.weights[key] = { key, weight: 1.0, successCount: 0, failureCount: 0 };
    }

    const s = this.weights[key];
    if (score >= 80) {
      s.successCount++;
      s.weight = Math.min(2.0, s.weight + 0.05);
    } else if (score < 60) {
      s.failureCount++;
      s.weight = Math.max(0.1, s.weight - 0.1);
    }
  }

  getWeight(key: string): number {
    return this.weights[key]?.weight || 1.0;
  }
}
