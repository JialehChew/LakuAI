import { NextResponse } from 'next/server';

// Map Platforms to specific aesthetic prefixes
const PLATFORM_PROMPTS: Record<string, string> = {
  shopee: "vibrant commercial Shopee marketplace style, bright and clean, high saturation, professional seller photography",
  lazada: "professional Lazada premium mall aesthetic, balanced lighting, high-end marketplace quality",
  tiktok: "dynamic TikTok shop lifestyle vibe, trendy and modern, youthful energy, natural lighting",
  xiaohongshu: "soft aesthetic Xiaohongshu blogger style, dreamy lighting, pastel tones, elegant and premium lifestyle",
  general: "clean professional e-commerce product photography, neutral background, studio lighting",
};

// Map Image Types to specific background and composition details
const TYPE_PROMPTS: Record<string, string> = {
  main: "clean studio background, minimalist setting, product centered, focus on item",
  usp: "close-up shot highlighting product texture and details, macro-style photography, bokeh background",
  function: "product shown in a functional setting, active use context, clear demonstration",
  lifestyle: "set in a modern Malaysian home interior, warm ambient lighting, realistic living space background",
  info: "composition with wide negative space on the side for text overlays, clean background, balanced layout",
  poster: "cinematic composition with significant negative space for marketing text, dramatic lighting, high-end advertising aesthetic",
};

export async function POST(request: Request) {
  try {
    const { image, platform, imageType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.general;
    const typePrompt = TYPE_PROMPTS[imageType] || TYPE_PROMPTS.main;
    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY is not configured' }, { status: 500 });
    }

    const finalPrompt = `A professional product photo: The product from the image in a ${platformPrompt}, ${typePrompt}. High-end commercial grade, 8k resolution, maintain original product details.`;

    const payload = {
      prompt: finalPrompt,
      image_url: image,
      image_size: "1024x1024",
      quality: "low",
    };

    console.log('Requesting generation with platform:', platform, 'and type:', imageType);

    // Using openai/gpt-image-2/edit for cost efficiency and NLU
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
      console.error('Fal API Error Response:', JSON.stringify(errorData));
      throw new Error(errorData.detail || 'Fal AI Request failed');
    }

    const result = await response.json();
    const imageUrl = result.image?.url || result.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from API");
    }

    return NextResponse.json({ image: imageUrl });
  } catch (error: any) {
    console.error('Fal AI Route Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}
