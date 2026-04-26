export const VOCABULARY = {
  lighting: {
    soft_diffused: [
      "The scene is illuminated by soft, even light that eliminates harsh shadows.",
      "Gentle, diffused lighting covers the entire scene, creating a clean look.",
      "Balanced and soft studio lighting ensures every detail is visible without glare."
    ],
    golden_hour: [
      "Bathed in the warm, amber glow of the late afternoon sun.",
      "The lighting captures the rich, golden tones of a tropical sunset.",
      "Warm and inviting sunlight streams across the scene at a low angle."
    ],
    natural_daylight: [
      "Bright and crisp natural daylight fills the space.",
      "Clean, realistic morning light brings out the natural colors of the product.",
      "Clear daylight creates a fresh and authentic commercial atmosphere."
    ]
  },
  composition: {
    centered: [
      "The product is perfectly centered in the frame, making it the undeniable hero.",
      "Positioned directly in the middle for a clean and professional presentation.",
      "A balanced, symmetrical composition with the product as the central focus."
    ]
  },
  mood: {
    vibrant: [
      "The atmosphere is energetic and colorful, designed to grab attention.",
      "High-energy visuals with bold, inviting tones.",
      "A lively and bright aesthetic that feels modern and appealing."
    ],
    minimalist: [
      "A calm and quiet scene with plenty of clean space.",
      "Simple and elegant presentation with no unnecessary distractions.",
      "The aesthetic is understated and sophisticated, focusing on pure form."
    ]
  }
};

export function getRandomPhrase(category: keyof typeof VOCABULARY, key: string): string {
  const options = (VOCABULARY as any)[category]?.[key];
  if (!options || options.length === 0) return "";
  return options[Math.floor(Math.random() * options.length)];
}
