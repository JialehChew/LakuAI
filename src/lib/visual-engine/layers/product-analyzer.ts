import { ProductCategory, ProductIdentity, EngineInput } from '../types';
import { RISK_PROFILES } from '../constants/risk-profiles';
import { PRESERVATION_MATRIX, StructureRisk } from '../constants/structure-risks';

export function analyzeProduct(input: EngineInput): ProductIdentity {
  const name = input.product || 'product';
  const category = detectCategory(name);
  const risks = detectStructuralRisks(name, input.sellingPoint || '');

  return {
    name,
    category,
    sellingPoint: input.sellingPoint,
    // Store structural risks to influence generation strictness later
    structuralRisks: risks
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

function detectStructuralRisks(name: string, sellingPoint: string): StructureRisk[] {
  const text = (name + ' ' + sellingPoint).toLowerCase();
  const foundRisks: StructureRisk[] = [];

  if (text.includes('glass') || text.includes('clear') || text.includes('bottle')) foundRisks.push(PRESERVATION_MATRIX.transparent_packaging);
  if (text.includes('gold') || text.includes('silver') || text.includes('metal') || text.includes('chrome')) foundRisks.push(PRESERVATION_MATRIX.reflective_metal);
  if (text.includes('label') || text.includes('text') || text.includes('ingredients')) foundRisks.push(PRESERVATION_MATRIX.tiny_text_labels);

  return foundRisks;
}
