export interface PlatformBehaviorModel {
  visualPriorities: string[];
  subjectVisibility: 'maximum' | 'balanced' | 'lifestyle_integrated';
  informationDensity: 'low' | 'medium' | 'high';
  emotionalTone: string;
  mobileReadabilityLevel: 'critical' | 'high' | 'standard';
  framingBehavior: string;
  clutterTolerance: 'zero' | 'low' | 'medium';
  realismExpectation: 'authentic' | 'commercial_polished' | 'blogger_style';
}
