import { PlatformBehaviorModel } from '../types';

export const SHOPEE_MY_MODEL: PlatformBehaviorModel = {
  visualPriorities: [
    "Instant product recognition",
    "High brightness and contrast",
    "Clean background for mobile thumbnail clarity"
  ],
  subjectVisibility: 'maximum',
  informationDensity: 'low',
  emotionalTone: "Trustworthy, bright, and energetic commercial feel",
  mobileReadabilityLevel: 'critical',
  framingBehavior: "Product occupies 75-80% of the frame with 10% safety margin",
  clutterTolerance: 'zero',
  realismExpectation: 'commercial_polished'
};

export const SHOPEE_RULES = {
  main_image: "Centered subject, pure white or light grey background, no distracting elements, high-contrast lighting for small screens.",
  mobile_optimization: "Ensure the product logo is sharp and legible even at 64x64 resolution."
};
