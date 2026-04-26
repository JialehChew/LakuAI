/**
 * Simple utility to generate human-readable intelligence reports from benchmark results.
 */
export function generateIntelligenceSummary(performanceData: any) {
  const categories = performanceData.categories;
  const platforms = performanceData.platforms;

  return `
LAKUAI VISUAL INTELLIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}

CATEGORY PERFORMANCE SUMMARY:
${Object.entries(categories).map(([cat, data]: [string, any]) =>
  `- ${cat.toUpperCase()}: Best Lighting: ${data.best_lighting}, Avg Score: ${data.avg_score}`).join('\n')}

PLATFORM COMPLIANCE:
${Object.entries(platforms).map(([plat, data]: [string, any]) =>
  `- ${plat.toUpperCase()}: Best Behavior: ${data.highest_conversion_behavior}`).join('\n')}

STRATEGIC RECOMMENDATION:
Focus on refining the "soft_diffused" lighting layer for Jewelry, as it consistently yields higher preservation scores.
`;
}
