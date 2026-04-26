import { ProductCategory } from '../types';

export interface RiskProfile {
  distortionRisk: 'low' | 'medium' | 'high';
  preservationPriority: 'standard' | 'high' | 'maximum';
  hallucinationLikelihood: 'low' | 'medium' | 'high';
  criticalZones: string[];
}

export const RISK_PROFILES: Record<ProductCategory, RiskProfile> = {
  jewelry: {
    distortionRisk: 'high',
    preservationPriority: 'maximum',
    hallucinationLikelihood: 'high',
    criticalZones: ['refractions', 'fine-chains', 'gemstone-clarity']
  },
  cosmetics: {
    distortionRisk: 'medium',
    preservationPriority: 'maximum',
    hallucinationLikelihood: 'medium',
    criticalZones: ['label-text', 'pump-mechanism', 'fluid-texture']
  },
  food: {
    distortionRisk: 'medium',
    preservationPriority: 'high',
    hallucinationLikelihood: 'medium',
    criticalZones: ['appetite-appeal', 'packaging-logo', 'freshness-indicators']
  },
  wellness: {
    distortionRisk: 'low',
    preservationPriority: 'high',
    hallucinationLikelihood: 'medium',
    criticalZones: ['ingredient-icons', 'dosage-text']
  },
  fashion: {
    distortionRisk: 'low',
    preservationPriority: 'standard',
    hallucinationLikelihood: 'low',
    criticalZones: ['fabric-texture', 'seam-details']
  },
  electronics: {
    distortionRisk: 'low',
    preservationPriority: 'high',
    hallucinationLikelihood: 'low',
    criticalZones: ['port-details', 'button-placement', 'screen-reflections']
  },
  home_living: {
    distortionRisk: 'low',
    preservationPriority: 'standard',
    hallucinationLikelihood: 'low',
    criticalZones: ['material-grain', 'proportions']
  },
  general: {
    distortionRisk: 'medium',
    preservationPriority: 'standard',
    hallucinationLikelihood: 'medium',
    criticalZones: []
  }
};
