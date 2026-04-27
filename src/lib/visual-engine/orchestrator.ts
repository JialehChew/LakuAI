import { EngineInput, VisualStrategyObject, ProductIdentity, CampaignContext } from './types';
import { PLATFORM_SUITES, SuiteImageDefinition } from './constants/suites';
import { generateVisualPrompt } from './index';

export interface WorkflowStatus {
  totalSteps: number;
  currentStep: number;
  completedSteps: GenerationStepResult[];
}

export interface GenerationStepResult {
  id: string;
  type: string;
  vso: VisualStrategyObject;
  prompt: string;
  url?: string;
}

export class VisualWorkflowOrchestrator {
  private input: EngineInput;
  private history: GenerationStepResult[] = [];

  constructor(input: EngineInput) {
    this.input = input;
  }

  planSuite(): SuiteImageDefinition[] {
    return PLATFORM_SUITES[this.input.platform.toLowerCase()] || PLATFORM_SUITES.shopee;
  }

  /**
   * Supports both new generations and "Listing Refreshes" for campaigns.
   */
  prepareStep(imageDef: SuiteImageDefinition, overrideCampaign?: CampaignContext): { prompt: string; vso: VisualStrategyObject } {
    const stepInput: EngineInput = {
      ...this.input,
      imageType: imageDef.type,
      narrativeGoal: imageDef.narrativeGoal,
      campaign: overrideCampaign || this.input.campaign,
      isRefresh: !!overrideCampaign
    };

    const result = generateVisualPrompt(stepInput);

    // NARRATIVE BALANCE
    if (imageDef.narrativeGoal === 'lifestyle') {
      result.vso.mood = 'warm_lifestyle';
      result.vso.lighting = 'natural_daylight';
    } else if (imageDef.narrativeGoal === 'attention') {
      result.vso.mood = 'vibrant';
    }

    // REFRESH ENGINE LOGIC: If refreshing for a campaign, ensure campaign mood is dominant
    if (stepInput.isRefresh) {
      result.vso.conversionGoal = 'stop_the_scroll';
    }

    this.history.push({
      id: Math.random().toString(36).substr(2, 9),
      type: imageDef.type,
      vso: result.vso,
      prompt: result.prompt
    });

    return { prompt: result.prompt, vso: result.vso };
  }

  getStatus(): WorkflowStatus {
    return {
      totalSteps: this.planSuite().length,
      currentStep: this.history.length,
      completedSteps: this.history
    };
  }
}

export async function runCommercialWorkflow(
  input: EngineInput,
  onProgress: (status: WorkflowStatus) => void,
  generateFn: (prompt: string) => Promise<string>
) {
  const orchestrator = new VisualWorkflowOrchestrator(input);
  const suite = orchestrator.planSuite();

  for (const imageDef of suite) {
    const { prompt } = orchestrator.prepareStep(imageDef);
    try {
      const url = await generateFn(prompt);
      const status = orchestrator.getStatus();
      status.completedSteps[status.completedSteps.length - 1].url = url;
      onProgress(status);
    } catch (error) {
      console.error(`Failed suite step ${imageDef.type}:`, error);
    }
  }
}
