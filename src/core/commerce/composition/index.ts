export interface ConversionFraming {
  subjectScale: number;
  negativeSpace: 'left' | 'right' | 'bottom' | 'none';
  readabilityPriority: 'maximum' | 'standard';
  mobileOptimized: boolean;
}

/**
 * Determines conversion-focused composition rules for different platforms.
 */
export function getCommercialComposition(platform: string, imageType: string): ConversionFraming {
  const p = platform.toLowerCase();

  if (p === 'shopee') {
    return {
      subjectScale: 0.8,
      negativeSpace: 'none',
      readabilityPriority: 'maximum',
      mobileOptimized: true
    };
  }

  if (p === 'xiaohongshu') {
    return {
      subjectScale: 0.65,
      negativeSpace: 'bottom',
      readabilityPriority: 'standard',
      mobileOptimized: true
    };
  }

  return {
    subjectScale: 0.7,
    negativeSpace: 'none',
    readabilityPriority: 'standard',
    mobileOptimized: true
  };
}
