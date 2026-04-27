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

  prepareStep(imageDef: SuiteImageDefinition, overrideCampaign?: CampaignContext): { prompt: string; vso: VisualStrategyObject } {
    const result = generateVisualPrompt({
      ...this.input,
      imageType: imageDef.type,
      narrativeGoal: imageDef.narrativeGoal,
      campaign: overrideCampaign || this.input.campaign,
      isRefresh: !!overrideCampaign
    });

    const stepResult: GenerationStepResult = {
      id: Math.random().toString(36).substr(2, 9),
      type: imageDef.type,
      vso: result.vso,
      prompt: result.prompt,
      status: 'pending'
    };

    this.history.push(stepResult);
    return { prompt: result.prompt, vso: result.vso };
  }

  getStatus(): WorkflowStatus {
    const completedCount = this.history.filter(s => s.status === 'completed').length;
    const failedCount = this.history.filter(s => s.status === 'failed').length;

    let result: WorkflowStatus['workflowResult'] = 'success';
    if (failedCount > 0) result = completedCount > 0 ? 'partial' : 'failed';

    return {
      totalSteps: this.history.length,
      currentStep: this.history.length,
      completedSteps: this.history,
      workflowResult: result
    };
  }

  /**
   * Execution Logic with Timeout and Retry Protection.
   */
  async executeStep(stepId: string, generateFn: (p: string) => Promise<string>): Promise<string> {
    const step = this.history.find(h => h.id === stepId);
    if (!step) throw new Error("Step not found");

    step.status = 'generating';
    let attempts = 0;

    while (attempts <= this.RETRY_LIMIT) {
      try {
        // Implementation of 30s timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Generation Timeout")), 30000)
        );

        const url = await Promise.race([generateFn(step.prompt), timeoutPromise]) as string;
        step.status = 'completed';
        step.url = url;
        return url;
      } catch (error: any) {
        attempts++;
        console.error(`Attempt ${attempts} failed for ${step.type}:`, error);
        if (attempts > this.RETRY_LIMIT) {
          step.status = 'failed';
          step.error = error.message;
          trackMerchantAction('workflow_stalled', { step: step.type, error: error.message });
          throw error;
        }
      }
    }
    return "";
  }
}
