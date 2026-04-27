"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { WorkflowSetup } from "@/components/generate/v2/WorkflowSetup";
import { CreativeWorkspace } from "@/components/generate/v2/CreativeWorkspace";
import { ProductionTimeline, TimelineStep } from "@/components/generate/v2/ProductionTimeline";
import { WorkflowBlueprint } from "@/components/generate/v2/WorkflowBlueprint";
import { ProgressStep } from "@/components/generate/ProgressTracker";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { trackMerchantAction } from "@/lib/visual-engine/utils/analytics-tracker";
import { saveAs } from "file-saver";
import { Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GeneratePage() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("shopee");
  const [productName, setProductName] = useState("Untitled Project");
  const [mode, setMode] = useState<'simple' | 'pro'>('simple');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState("Ready");

  const [orchestrationSteps, setOrchestrationSteps] = useState<ProgressStep[]>([
    { id: 'identity', label: 'Protecting product identity...', status: 'pending' },
    { id: 'behavior', label: 'Mapping platform behavior...', status: 'pending' },
    { id: 'composition', label: 'Planning Shopee composition...', status: 'pending' },
    { id: 'render', label: 'Finalizing commercial visuals...', status: 'pending' },
  ]);

  const [productionSteps, setProductionSteps] = useState<TimelineStep[]>([
    { id: '1', type: 'main', label: 'Hero Image', status: 'pending' },
    { id: '2', type: 'usp', label: 'USP Feature', status: 'pending' },
    { id: '3', type: 'lifestyle', label: 'Lifestyle Scene', status: 'pending' },
    { id: '4', type: 'info', label: 'Trust Composition', status: 'pending' },
    { id: '5', type: 'poster', label: 'Promo Poster', status: 'pending' },
  ]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      trackMerchantAction('feedback_submitted', { type: 'upload_success' });
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateOrchestration = (id: string, status: ProgressStep['status']) => {
    setOrchestrationSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const generateStepWithRetry = async (stepId: string, retries = 1): Promise<boolean> => {
    const step = productionSteps.find(s => s.id === stepId);
    if (!step || !image) return false;

    setProductionSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'generating' } : s));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          platform: selectedPlatform,
          imageType: step.type,
          product: productName,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProductionSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'completed', url: data.image } : s));
      setActiveStepId(stepId);
      return true;
    } catch (err) {
      console.error(`Generation failed for ${step.label}:`, err);
      if (retries > 0) {
        console.log(`Retrying ${step.label}...`);
        return generateStepWithRetry(stepId, retries - 1);
      }
      setProductionSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'pending' } : s));
      return false;
    }
  };

  const handleStartWorkflow = async () => {
    if (!image || isGenerating) return;
    setIsGenerating(true);
    trackMerchantAction('suite_generated', { platform: selectedPlatform, mode });

    setOrchestrationSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    setCurrentAction("Analyzing Product Packaging...");
    updateOrchestration('identity', 'loading');
    await new Promise(r => setTimeout(r, 400));
    updateOrchestration('identity', 'completed');

    setCurrentAction("Detecting Marketplace Trends...");
    updateOrchestration('behavior', 'loading');
    await new Promise(r => setTimeout(r, 300));
    updateOrchestration('behavior', 'completed');

    setCurrentAction("Engineering Visual Strategy...");
    updateOrchestration('composition', 'loading');
    await new Promise(r => setTimeout(r, 200));
    updateOrchestration('composition', 'completed');

    updateOrchestration('render', 'loading');
    setCurrentAction("Producing Creative Assets...");

    // ROBUST SEQUENTIAL GENERATION: Ensure all assets in mode are tried
    const stepsToRun = mode === 'simple' ? ['1', '2', '3'] : ['1'];

    for (const sId of stepsToRun) {
       await generateStepWithRetry(sId);
    }

    updateOrchestration('render', 'completed');
    setCurrentAction("Suite Production Complete");
    setIsGenerating(false);
  };

  const activeImage = productionSteps.find(s => s.id === activeStepId)?.url;
  const isSuiteComplete = productionSteps.filter(s => s.url).length >= (mode === 'simple' ? 3 : 1);

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-160px)] xl:h-[calc(100vh-96px)] -m-6 md:-m-12 overflow-y-auto lg:overflow-hidden bg-white lg:rounded-3xl border border-gray-100 shadow-sm relative">
          {/* Completion Payoff Overlay */}
          {isSuiteComplete && !isGenerating && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-green-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-bold">Commercial Suite Ready</span>
               </div>
            </div>
          )}

          {/* LEFT: Setup */}
          <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100 bg-white z-10">
            <div className="flex-1 lg:overflow-y-auto">
              <WorkflowSetup
                onUpload={handleUpload}
                platform={selectedPlatform}
                setPlatform={setSelectedPlatform}
                mode={mode}
                setMode={setMode}
                productName={productName}
                setProductName={setProductName}
                isUploaded={!!image}
              />
            </div>
            <div className="p-6 border-t border-gray-50 bg-white">
              <WorkflowBlueprint />
              <button
                onClick={handleStartWorkflow}
                disabled={!image || isGenerating}
                className={cn(
                  "w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all",
                  image && !isGenerating && !productionSteps[0].url ? "animate-pulse shadow-indigo-200 scale-[1.02]" : "shadow-gray-100",
                  "hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98]"
                )}
              >
                <Zap className="w-4 h-4 fill-white" /> {isSuiteComplete ? "Regenerate Full Suite" : "Start Production"}
              </button>
            </div>
          </aside>

          {/* CENTER: Workspace */}
          <main className="flex-1 flex flex-col min-h-[500px] lg:min-h-0 bg-[#F8FAFF]">
            <CreativeWorkspace
              image={image}
              activeImage={activeImage || null}
              isGenerating={isGenerating}
              steps={orchestrationSteps}
              currentAction={currentAction}
            />
          </main>

          {/* RIGHT: Timeline */}
          <aside className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 bg-white lg:overflow-y-auto">
            <ProductionTimeline
              steps={productionSteps}
              activeStepId={activeStepId}
              onSelect={setActiveStepId}
              onRegenerate={generateStepWithRetry}
              onDownload={(url, type) => {
                trackMerchantAction('image_downloaded', { type });
                saveAs(url, `${productName}-${type}.png`);
              }}
            />
          </aside>
      </div>
    </DashboardLayout>
  );
}
