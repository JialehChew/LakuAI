import { NextResponse } from 'next/server';
import { generateVisualPrompt } from '@/lib/visual-engine';
import { logGeneration } from '@/lib/visual-engine/utils/logger';
import { runPreprocessing } from '@/lib/visual-engine/layers/preprocessing';
import { analyzeInput } from '@/lib/visual-engine/layers/input-analyzer';
import { analyzeProduct } from '@/lib/visual-engine/layers/product-analyzer';

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

    // 1. Initial Analysis
    const initialIdentity = analyzeProduct({ platform, imageType, product, sellingPoint, scenario, image });
    const analysis = analyzeInput({ platform, imageType, product, sellingPoint, scenario, image }, initialIdentity.category);

    // 2. Preprocessing with AI Fallback logic
    const prepResult = await runPreprocessing(image, analysis.reconstructionMode, falKey);

    // 3. Final Prompt Generation (Aware of Isolation result)
    const { prompt, vso, identity } = generateVisualPrompt(
      { platform, imageType, product, sellingPoint, scenario, image },
      prepResult.useAIIsolationFallback
    );

    // 4. Generation
    const payload = {
      prompt: prompt,
      image_urls: [prepResult.processedImageUrl],
      image_size: "square_hd",
      quality: "low",
    };

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

    if (!resultUrl) throw new Error("No image URL returned");

    return NextResponse.json({ image: resultUrl });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}
