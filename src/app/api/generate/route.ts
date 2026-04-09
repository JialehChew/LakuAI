import { NextResponse } from 'next/server';

// Map UI styles to professional prompts
const STYLE_PROMPTS: Record<string, string> = {
  minimalist: "minimalist high-end product photography, set on a plain stone slab, clean background, soft natural lighting, zen vibe, commercial quality, 8k",
  studio: "professional commercial studio photography, softbox lighting, clean grey seamless backdrop, sharp focus, cinematic depth of field, 8k resolution",
  tropical: "lush tropical garden setting, vibrant exotic plants in background, bright dappled sunlight, natural resort aesthetic, high-end lifestyle product photography",
  festive: "luxurious festive holiday theme, warm bokeh fairy lights, gold and red ornaments, elegant celebratory atmosphere, professional product lighting",
  cozy: "warm cozy home interior, set on a rustic wooden table, soft morning light through a window, blurred domestic background, comfortable lifestyle photography",
};

export async function POST(request: Request) {
  try {
    const { image, style } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const promptDetails = STYLE_PROMPTS[style] || STYLE_PROMPTS.minimalist;
    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY is not configured' }, { status: 500 });
    }

    console.log(`Requesting generation with style: ${style} using flux-kontext-pro`);

    // Using flux-kontext-pro for better structure preservation
    const response = await fetch("https://fal.run/fal-ai/flux-kontext-pro", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Professional product photography: The product from the image placed in a ${promptDetails}. High-end commercial grade, 8k resolution, sharp focus, vibrant colors, maintain original product shape and details.`,
        image_url: image,
        // Optional: Add parameters to increase fidelity if supported by the specific model version
        // structure_preservation: 1.0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Fal API Error Response:', errorData);
      throw new Error(errorData.detail || 'Fal AI Request failed');
    }

    const result = await response.json();
    console.log('Fal API Success:', result);
    return NextResponse.json({ image: result.images[0].url });
  } catch (error: any) {
    console.error('Fal AI Route Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}
