import { NextResponse } from 'next/server';

// Map UI styles to professional prompts
const STYLE_PROMPTS: Record<string, string> = {
  minimalist: "minimalist studio setting, clean white background, soft natural lighting, high-end product photography, 8k resolution, elegant, simple",
  studio: "professional studio lighting, softbox lights, clean grey background, sharp focus, cinematic lighting, commercial product photography, 8k resolution",
  tropical: "outdoor tropical setting, lush green palm leaves in background, bright sunny day, natural lighting, exotic beach vibe, high-end product photography",
  festive: "festive atmosphere, Raya or Chinese New Year themed decorations, warm fairy lights, cultural ornaments, celebration vibe, professional lighting",
  cozy: "cozy home interior, warm ambient lighting, wooden table surface, soft blurred living room background, comfortable domestic setting, lifestyle photography",
};

export async function POST(request: Request) {
  try {
    const { image, style } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.minimalist;
    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY is not configured' }, { status: 500 });
    }

    // Using native fetch to avoid potential issues with serverless-client in this environment
    const response = await fetch("https://fal.run/fal-ai/flux-pro", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `A professional product photo of the item in the image, set in a ${prompt}. High quality, 8k resolution, commercial grade photography.`,
        image_url: image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Fal AI Request failed');
    }

    const result = await response.json();
    return NextResponse.json({ image: result.images[0].url });
  } catch (error: any) {
    console.error('Fal AI Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}
