import { EngineInput, VisualStrategyObject, ProductIdentity } from './types';
import { PLATFORM_SUITES, SuiteImageDefinition } from './constants/suites';
import { generateVisualPrompt } from './index';

export interface WorkflowStatus {
  totalSteps: number;
  currentStep: number;
  completedSteps: GenerationStepResult[];
}

export interface GenerationStepResult {
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

  prepareStep(imageDef: SuiteImageDefinition): { prompt: string; vso: VisualStrategyObject } {
    const stepInput: EngineInput = {
      ...this.input,
      imageType: imageDef.type,
      narrativeGoal: imageDef.narrativeGoal
    };

    // Sequential Adaptation: Adjust VSO based on what came before
    const result = generateVisualPrompt(stepInput);

    // Check for repetitive composition in history
    if (this.history.some(h => h.vso.composition === result.vso.composition)) {
      // Suggest composition variety if previous step used same layout
      if (result.vso.composition === 'centered') {
        result.vso.composition = 'rule_of_thirds';
      }
    }

    this.history.push({
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

/**
 * Lightweight simulation of a generation queue for Phase 4.
 */
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
      // Simulate/Trigger API generation
      const url = await generateFn(prompt);
      const status = orchestrator.getStatus();
      status.completedSteps[status.completedSteps.length - 1].url = url;
      onProgress(status);
    } catch (error) {
      console.error(`Failed generating suite step ${imageDef.type}:`, error);
      // Logic for retry foundation could go here
    }
  }
}
