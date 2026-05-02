import { EngineInput, VisualStrategyObject, ProductIdentity, CampaignContext } from './types';
import { PLATFORM_SUITES, SuiteImageDefinition } from './constants/suites';
import { generateVisualPrompt } from './index';
import { trackMerchantAction } from './utils/analytics-tracker';
import { VisualMemorySystem } from '@/core/vision/visual-memory';
import { visualCritic } from '@/core/critic';
import { tasteEngine } from '@/core/taste';
import { CriticFeedback } from '@/core/critic/types';

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
  status: 'pending' | 'generating' | 'evaluating' | 'completed' | 'failed' | 'skipped';
  error?: string;
  criticFeedback?: CriticFeedback;
}

export class VisualWorkflowOrchestrator {
  private input: EngineInput;
  private history: GenerationStepResult[] = [];
  private memory = new VisualMemorySystem();
  private RETRY_LIMIT = 2;
  private CRITIC_RETRY_LIMIT = 1;

  constructor(input: EngineInput) {
    this.input = input;
  }

  planSuite(): SuiteImageDefinition[] {
    return PLATFORM_SUITES[this.input.platform.toLowerCase()] || PLATFORM_SUITES.shopee;
  }

  prepareStep(imageDef: SuiteImageDefinition, overrideCampaign?: CampaignContext): string {
    const result = generateVisualPrompt(
      {
        ...this.input,
        imageType: imageDef.type,
        narrativeGoal: imageDef.narrativeGoal,
        campaign: overrideCampaign || this.input.campaign
      }
    );

    const memoryDirective = this.memory.getDirective();
    const finalPrompt = `${result.prompt} ${memoryDirective}`;

    const stepId = Math.random().toString(36).substr(2, 9);
    const stepResult: GenerationStepResult = {
      id: stepId,
      type: imageDef.type,
      vso: result.vso,
      prompt: finalPrompt,
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

  async executeStep(
    stepId: string,
    generateFn: (p: string) => Promise<string>,
    onStatusChange?: (status: GenerationStepResult) => void
  ): Promise<string> {
    const stepIndex = this.history.findIndex(h => h.id === stepId);
    if (stepIndex === -1) throw new Error("Step not found");

    const profile = tasteEngine.getProfile(this.input.platform);
    let criticRetries = 0;
    let currentPrompt = this.history[stepIndex].prompt;
    let currentDirectives: string[] = [];

    try {
      while (criticRetries <= this.CRITIC_RETRY_LIMIT) {
        this.history[stepIndex].status = 'generating';
        if (onStatusChange) onStatusChange({...this.history[stepIndex]});

        let apiAttempts = 0;
        let url = "";

        // API Generation Loop
        while (apiAttempts <= this.RETRY_LIMIT) {
          try {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout (45s)")), 45000));
            url = await Promise.race([generateFn(currentPrompt), timeoutPromise]) as string;
            if (!url) throw new Error("API returned empty result");
            break;
          } catch (error: any) {
            apiAttempts++;
            if (apiAttempts > this.RETRY_LIMIT) throw error;
          }
        }

        // CRITIC EVALUATION LOOP (V3)
        this.history[stepIndex].status = 'evaluating';
        if (onStatusChange) onStatusChange({...this.history[stepIndex]});

        const feedback = await visualCritic.evaluate(url, profile, criticRetries);
        this.history[stepIndex].criticFeedback = feedback;

        const decision = visualCritic.determineRegeneration(feedback, profile, criticRetries);

        if (decision.shouldRegenerate && criticRetries < this.CRITIC_RETRY_LIMIT) {
          criticRetries++;

          // Re-generate prompt with structured critic feedback (V3 Core)
          currentDirectives = decision.improvedPromptDirectives || [];
          const regenerationResult = generateVisualPrompt(
            {
              ...this.input,
              imageType: this.history[stepIndex].type
            },
            false,
            currentDirectives
          );

          const memoryDirective = this.memory.getDirective();
          currentPrompt = `${regenerationResult.prompt} ${memoryDirective}`;

          trackMerchantAction('critic_regeneration', {
            type: this.history[stepIndex].type,
            reason: decision.reason,
            retry: criticRetries
          });
          continue;
        }

        // Final Success
        if (this.history.filter(s => s.status === 'completed').length === 0) {
          this.memory.lockMemory(this.history[stepIndex].vso);
        }

        this.history[stepIndex].status = 'completed';
        this.history[stepIndex].url = url;
        if (onStatusChange) onStatusChange({...this.history[stepIndex]});
        return url;
      }
    } catch (finalError: any) {
      this.history[stepIndex].status = 'failed';
      this.history[stepIndex].error = finalError.message;
      if (onStatusChange) onStatusChange({...this.history[stepIndex]});
      trackMerchantAction('workflow_stalled', { step: this.history[stepIndex].type, error: finalError.message });
    }

    return this.history[stepIndex].url || "";
  }
}
