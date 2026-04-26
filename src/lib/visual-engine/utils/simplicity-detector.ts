/**
 * Detects if a visual strategy or final brief is becoming too "over-AI" (overly complex, unrealistically cinematic).
 * Goal: Preserve commercial realism and seller trust.
 */
export function analyzeSimplicity(prompt: string): string[] {
  const warnings: string[] = [];
  const lowercasePrompt = prompt.toLowerCase();

  const overAIKeywords = [
    "cinematic", "hyper-realistic", "unreal engine", "8k", "masterpiece",
    "dreamy lighting", "epic", "dramatic reflections"
  ];

  overAIKeywords.forEach(word => {
    if (lowercasePrompt.includes(word)) {
      warnings.push(`Detected over-stylized keyword: "${word}". This may reduce commercial realism.`);
    }
  });

  if (prompt.length > 500) {
    warnings.push("Prompt length is exceeding ideal complexity limits. Consider simplifying.");
  }

  return warnings;
}
