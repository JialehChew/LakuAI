export const COMPOSITION_RULES = {
  shopee_main: {
    subjectScale: 0.7, // 70% of frame for mobile readability
    backgroundComplexity: "low", // Minimize clutter
    subjectPosition: "centered",
    shadowType: "soft_contact",
    compositionAdvice: "Ensure 15% clear padding on all sides to avoid UI overlap in the Shopee app."
  },
  lazada_main: {
    subjectScale: 0.75,
    backgroundComplexity: "low",
    subjectPosition: "centered",
    shadowType: "professional_studio",
    compositionAdvice: "Focus on high-end mall aesthetic with clean reflective surfaces if applicable."
  },
  tiktok_main: {
    subjectScale: 0.6,
    backgroundComplexity: "medium",
    subjectPosition: "rule_of_thirds",
    shadowType: "natural",
    compositionAdvice: "Create a dynamic, natural look that feels like a real-life user capture."
  }
};
