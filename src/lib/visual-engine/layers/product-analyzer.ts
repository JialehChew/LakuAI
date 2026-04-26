import { ProductCategory, ProductIdentity, EngineInput } from '../types';
import { RISK_PROFILES } from '../constants/risk-profiles';

export function analyzeProduct(input: EngineInput): ProductIdentity {
  const name = input.product || 'product';
  const category = detectCategory(name);
  const riskProfile = RISK_PROFILES[category];

  return {
    name,
    category,
    sellingPoint: input.sellingPoint,
    // Future: Ingest riskProfile into identity to influence prompt strictness
  };
}

function detectCategory(name: string): ProductCategory {
  const n = name.toLowerCase();
  if (n.includes('ring') || n.includes('necklace') || n.includes('brooch') || n.includes('jewelry')) return 'jewelry';
  if (n.includes('cream') || n.includes('serum') || n.includes('lipstick') || n.includes('makeup')) return 'cosmetics';
  if (n.includes('food') || n.includes('sauce') || n.includes('snack') || n.includes('sambal')) return 'food';
  if (n.includes('supplement') || n.includes('vitamin') || n.includes('wellness')) return 'wellness';
  if (n.includes('shirt') || n.includes('dress') || n.includes('bag') || n.includes('fashion')) return 'fashion';
  if (n.includes('phone') || n.includes('earbuds') || n.includes('tech') || n.includes('electronics')) return 'electronics';
  if (n.includes('chair') || n.includes('table') || n.includes('lamp') || n.includes('home')) return 'home_living';

  return 'general';
}
