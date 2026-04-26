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

    const payload = {
      prompt: `Place the product from the original image in a ${promptDetails}. Ensure the product is centered and scaled realistically. Do not alter the product's appearance.`,
      image_url: image,
      image_size: "1024x1024",
      quality: "low",
    };

    console.log('Sending Payload to Fal.ai:', JSON.stringify({ ...payload, image_url: "DATA_URL_REDACTED" }));

    // Using openai/gpt-image-2/edit
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
      throw new Error(JSON.stringify(errorData) || 'Fal AI Request failed');
    }

    const result = await response.json();
    console.log('Fal API Success Result:', JSON.stringify(result));

    // GPT Edit model usually returns { "image": { "url": "..." } } or { "images": [{ "url": "..." }] }
    const imageUrl = result.image?.url || result.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error(`No image URL in result: ${JSON.stringify(result)}`);
    }

    return NextResponse.json({ image: imageUrl });
  } catch (error: any) {
    console.error('Fal AI Route Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}
