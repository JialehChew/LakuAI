import { ProductCategory, ProductIdentity, EngineInput } from '../types';
import { RISK_PROFILES } from '../constants/risk-profiles';
import { PRESERVATION_MATRIX, StructureRisk } from '../constants/structure-risks';

/**
 * Enhanced Product Analyzer with Semantic Intelligence.
 * Infers material, usage, and structural details from user input.
 */
export function analyzeProduct(input: EngineInput): ProductIdentity {
  const rawName = input.product || 'product';
  const category = detectCategory(rawName);

  // SEMANTIC INTELLIGENCE: Infer detailed description
  const semanticName = inferSemanticIdentity(rawName, input.sellingPoint || '');

  return {
    name: semanticName,
    category,
    sellingPoint: input.sellingPoint,
    structuralRisks: detectStructuralRisks(rawName, input.sellingPoint || '')
  };
}

function inferSemanticIdentity(name: string, sellingPoint: string): string {
  const text = (name + ' ' + sellingPoint).toLowerCase();

  // Heuristic mapping for common Malaysian market items
  if (text.includes('cable') || text.includes('usb')) {
    const isBraided = text.includes('braided') ? 'braided ' : '';
    return `premium ${isBraided}charging cable`;
  }
  if (text.includes('serum') || text.includes('essence')) return 'clinical grade cosmetic serum bottle';
  if (text.includes('brooch') || text.includes('pin')) return 'elegant decorative jewelry brooch';
  if (text.includes('sambal') || text.includes('sauce')) return 'authentic Malaysian food jar';
  if (text.includes('sneaker') || text.includes('shoe')) return 'high-performance lifestyle sneakers';
  if (text.includes('hijab') || text.includes('tudung')) return 'premium silk fashion hijab';

  return name;
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
  if (text.includes('glass') || text.includes('clear')) foundRisks.push(PRESERVATION_MATRIX.transparent_packaging);
  if (text.includes('metal') || text.includes('gold')) foundRisks.push(PRESERVATION_MATRIX.reflective_metal);
  if (text.includes('text') || text.includes('label')) foundRisks.push(PRESERVATION_MATRIX.tiny_text_labels);
  return foundRisks;
}
