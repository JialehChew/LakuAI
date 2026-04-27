/**
 * Tracks real merchant behavior signals to validate product-market fit.
 * These signals are used to optimize the engine for daily seller workflows.
 */
export type MerchantEvent =
  | 'suite_generated'
  | 'image_downloaded'
  | 'image_regenerated'
  | 'generation_abandoned'
  | 'mode_switched'
  | 'feedback_submitted'
  | 'listing_published' // New: Success signal
  | 'campaign_adapted'  // New: Retention signal
  | 'asset_reused';     // New: Efficiency signal

export function trackMerchantAction(event: MerchantEvent, metadata: Record<string, any> = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...metadata
  };

  // Log to console for initial validation phase (to be viewed in Render logs)
  console.log('--- MERCHANT BEHAVIOR SIGNAL ---');
  console.log(JSON.stringify(logEntry, null, 2));
}
