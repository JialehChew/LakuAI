import { EngineInput, VisualStrategyObject, ProductIdentity, CampaignContext } from './types';
import { PLATFORM_SUITES, SuiteImageDefinition } from './constants/suites';
import { generateVisualPrompt } from './index';
import { trackMerchantAction } from './utils/analytics-tracker';

export interface WorkflowStatus {
  totalSteps: number;
  currentStep: number;
  completedSteps: GenerationStepResult[];
  workflowResult: 'success' | 'partial' | 'failed';
}

export interface GenerationStepResult {
  id: string;
  type: string;
  vso: VisualStrategyObject;
  prompt: string;
  url?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'skipped';
  error?: string;
}

export class VisualWorkflowOrchestrator {
  private input: EngineInput;
  private history: GenerationStepResult[] = [];
  private RETRY_LIMIT = 2;

  constructor(input: EngineInput) {
    this.input = input;
  }

  planSuite(): SuiteImageDefinition[] {
    return PLATFORM_SUITES[this.input.platform.toLowerCase()] || PLATFORM_SUITES.shopee;
  }

  prepareStep(imageDef: SuiteImageDefinition, overrideCampaign?: CampaignContext): string {
    const result = generateVisualPrompt({
      ...this.input,
      imageType: imageDef.type,
      narrativeGoal: imageDef.narrativeGoal,
      campaign: overrideCampaign || this.input.campaign,
      isRefresh: !!overrideCampaign
    });

    const stepId = Math.random().toString(36).substr(2, 9);
    const stepResult: GenerationStepResult = {
      id: stepId,
      type: imageDef.type,
      vso: result.vso,
      prompt: result.prompt,
      status: 'pending'
    };

    this.history.push(stepResult);
    return stepId;
  }

  getStatus(): WorkflowStatus {
    const completedCount = this.history.filter(s => s.status === 'completed').length;
    const failedCount = this.history.filter(s => s.status === 'failed').length;

    let result: WorkflowStatus['workflowResult'] = 'success';
    if (failedCount > 0) result = completedCount > 0 ? 'partial' : 'failed';

    return {
      totalSteps: this.history.length,
      currentStep: this.history.length,
      completedSteps: [...this.history],
      workflowResult: result
    };
  }

  /**
   * Execution Logic with Guaranteed Resolution Pattern.
   */
  async executeStep(stepId: string, generateFn: (p: string) => Promise<string>): Promise<string> {
    const stepIndex = this.history.findIndex(h => h.id === stepId);
    if (stepIndex === -1) throw new Error("Step not found");

    console.log(`[ORCHESTRATOR] Step Started: ${this.history[stepIndex].type} (${stepId})`);
    this.history[stepIndex].status = 'generating';

    let attempts = 0;

    try {
      while (attempts <= this.RETRY_LIMIT) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Generation Timeout (45s)")), 45000)
          );

          const url = await Promise.race([generateFn(this.history[stepIndex].prompt), timeoutPromise]) as string;

          if (!url) throw new Error("API returned empty result");

          this.history[stepIndex].status = 'completed';
          this.history[stepIndex].url = url;
          console.log(`[ORCHESTRATOR] Step Completed: ${this.history[stepIndex].type}`);
          return url;
        } catch (error: any) {
          attempts++;
          console.warn(`[ORCHESTRATOR] Attempt ${attempts} failed for ${this.history[stepIndex].type}:`, error.message);

          if (attempts > this.RETRY_LIMIT) {
            throw error; // Re-throw to be caught by outer block
          }
        }
      }
    } catch (finalError: any) {
      this.history[stepIndex].status = 'failed';
      this.history[stepIndex].error = finalError.message;
      trackMerchantAction('workflow_stalled', { step: this.history[stepIndex].type, error: finalError.message });
      console.error(`[ORCHESTRATOR] Step Failed after retries: ${this.history[stepIndex].type}`);
    } finally {
      // Guaranteed Resolution: Even if failed, we resolve to allow queue continuation
      return this.history[stepIndex].url || "";
    }

    return "";
  }
}
