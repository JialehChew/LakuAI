import { NextResponse } from 'next/server';
import { generateVisualPrompt } from '@/lib/visual-engine';
import { logGeneration } from '@/lib/visual-engine/utils/logger';
import { runPreprocessing } from '@/lib/visual-engine/layers/preprocessing';

export async function POST(request: Request) {
  try {
    const { image, platform, imageType, product, sellingPoint, scenario } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY is not configured' }, { status: 500 });
    }

    // 1. ANALYZE & PREPROCESS
    const { prompt, vso, identity, reconstructionMode } = generateVisualPrompt({
      platform, imageType, product, sellingPoint, scenario, image
    });

    // 2. PHYSICAL SUBJECT EXTRACTION (New Preprocessing Layer)
    const prepResult = await runPreprocessing(image, reconstructionMode, falKey);

    // 3. GENERATION
    const payload = {
      prompt: prompt,
      image_urls: [prepResult.processedImageUrl],
      image_size: "square_hd",
      quality: "low",
    };

    console.log('Final Strategy:', reconstructionMode, 'Isolation:', prepResult.isolationApplied);

    const response = await fetch("https://fal.run/openai/gpt-image-2/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || JSON.stringify(errorData) || 'Fal AI Request failed');
    }

    const result = await response.json();
    const resultUrl = result.image?.url || result.images?.[0]?.url;

    if (!resultUrl) {
      throw new Error("No image URL returned from API");
    }

    logGeneration({
      timestamp: new Date().toISOString(),
      input: { productName: product, platform, imageType, rawInputUrl: "DATA_URL_REDACTED" },
      engine: { name: 'visual-engine', vso, spio: identity, finalPrompt: prompt },
      output: { resultUrl }
    });

    return NextResponse.json({ image: resultUrl });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}
