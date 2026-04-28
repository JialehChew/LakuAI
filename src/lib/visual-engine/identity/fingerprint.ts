import { ProductIdentity } from '../types';

/**
 * Creates a deterministic "Identity Fingerprint" to prevent structural drift.
 */
export function generateFingerprintDirective(identity: ProductIdentity): string {
  const traits = [];

  if (identity.category === 'jewelry') traits.push("Strictly preserve refractive caustics and metallic luster.");
  if (identity.category === 'electronics') traits.push("Lock geometric proportions and interface port details.");
  if (identity.category === 'cosmetics') traits.push("Maintain exact label typography and material translucency.");

  const fingerprint = `IDENTITY FINGERPRINT LOCKED: Preserve core geometry, material textures, and logo placement. Do not warp, simplify, or hallucinate new product features.`;

  return `${fingerprint} ${traits.join(' ')}`;
}
