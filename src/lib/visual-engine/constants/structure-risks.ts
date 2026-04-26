export type StructureRiskLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface StructureRisk {
  type: string;
  level: StructureRiskLevel;
  mitigationStrategy: string;
}

export const PRESERVATION_MATRIX: Record<string, StructureRisk> = {
  transparent_packaging: {
    type: "Material",
    level: "high",
    mitigationStrategy: "Apply backlighting and preserve liquid refraction details."
  },
  reflective_metal: {
    type: "Material",
    level: "high",
    mitigationStrategy: "Control environment reflections to avoid metallic distortion."
  },
  tiny_text_labels: {
    type: "Feature",
    level: "extreme",
    mitigationStrategy: "Strict macro focus on label areas with zero-tolerance for text mutation."
  },
  complex_geometric_shape: {
    type: "Form",
    level: "medium",
    mitigationStrategy: "Use orthographic-style camera angles to maintain proportions."
  }
};
