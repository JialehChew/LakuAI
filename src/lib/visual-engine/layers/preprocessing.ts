import { EngineInput, ProductIdentity } from '../types';
import { ReconstructionMode } from './input-analyzer';

export interface PreprocessingResult {
  processedImageUrl: string;
  isolationApplied: boolean;
}

/**
 * Executes the real product preparation pipeline.
 * Physically isolates the subject if in 'rebuild' mode.
 */
export async function runPreprocessing(
  image: string,
  mode: ReconstructionMode,
  falKey: string
): Promise<PreprocessingResult> {
  if (mode !== 'rebuild') {
    return { processedImageUrl: image, isolationApplied: false };
  }

  console.log('--- PREPROCESSING: ISOLATING SUBJECT ---');

  try {
    // Step 1: Real Background Removal via Fal.ai
    // We use a high-quality isolation model to extract the product subject
    const response = await fetch("https://fal.run/fal-ai/bria/background-removal", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: image,
      }),
    });

    if (!response.ok) {
      console.warn('Background removal failed, falling back to original image');
      return { processedImageUrl: image, isolationApplied: false };
    }

    const result = await response.json();
    const isolatedUrl = result.image?.url;

    if (!isolatedUrl) {
      return { processedImageUrl: image, isolationApplied: false };
    }

    console.log('--- PREPROCESSING: SUBJECT ISOLATED SUCCESSFULLY ---');
    return { processedImageUrl: isolatedUrl, isolationApplied: true };
  } catch (error) {
    console.error('Preprocessing Error:', error);
    return { processedImageUrl: image, isolationApplied: false };
  }
}
