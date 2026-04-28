import { ReconstructionMode } from './input-analyzer';

export interface PreprocessingResult {
  processedImageUrl: string;
  isolationApplied: boolean;
  useAIIsolationFallback: boolean;
}

/**
 * Executes the real product preparation pipeline.
 * If physical background removal fails, it flags for AI Isolation Mode.
 */
export async function runPreprocessing(
  image: string,
  mode: ReconstructionMode,
  falKey: string
): Promise<PreprocessingResult> {
  if (mode !== 'rebuild') {
    return { processedImageUrl: image, isolationApplied: false, useAIIsolationFallback: false };
  }

  console.log('--- PREPROCESSING: ISOLATING SUBJECT ---');

  try {
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
      console.warn('Physical background removal failed. Activating AI Isolation Fallback.');
      return { processedImageUrl: image, isolationApplied: false, useAIIsolationFallback: true };
    }

    const result = await response.json();
    const isolatedUrl = result.image?.url;

    if (!isolatedUrl) {
      return { processedImageUrl: image, isolationApplied: false, useAIIsolationFallback: true };
    }

    return { processedImageUrl: isolatedUrl, isolationApplied: true, useAIIsolationFallback: false };
  } catch (error) {
    console.error('Preprocessing Error:', error);
    return { processedImageUrl: image, isolationApplied: false, useAIIsolationFallback: true };
  }
}
