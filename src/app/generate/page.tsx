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
import { VisualWorkflowOrchestrator } from "@/lib/visual-engine/orchestrator";
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
    { id: 'extract', label: 'Removing environmental clutter...', status: 'pending' },
    { id: 'identity', label: 'Verifying product identity...', status: 'pending' },
    { id: 'rebuild', label: 'Reconstructing commercial scene...', status: 'pending' },
    { id: 'optimize', label: 'Optimizing mobile visibility...', status: 'pending' },
  ]);

  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);

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

  const handleStartWorkflow = async () => {
    if (!image || isGenerating) return;
    setIsGenerating(true);
    const startTime = Date.now();
    const orchestrator = new VisualWorkflowOrchestrator({ image, platform: selectedPlatform, product: productName, imageType: 'main' });
    const plan = orchestrator.planSuite();

    setTimelineSteps(plan.map(p => ({ id: p.type, type: p.type, label: p.description, status: 'pending' })));
    setOrchestrationSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    // Confidence Narration Sequence
    setCurrentAction("Isolating Commercial Subject...");
    updateOrchestration('extract', 'loading');
    await new Promise(r => setTimeout(r, 700));
    updateOrchestration('extract', 'completed');

    setCurrentAction("Locking Identity Fingerprint...");
    updateOrchestration('identity', 'loading');
    await new Promise(r => setTimeout(r, 500));
    updateOrchestration('identity', 'completed');

    setCurrentAction("Building Listing Assets...");
    updateOrchestration('rebuild', 'loading');

    const runSteps = mode === 'simple' ? plan.slice(0, 3) : [plan[0]];

    for (const pItem of runSteps) {
       const stepId = orchestrator.prepareStep(pItem);
       setTimelineSteps(prev => prev.map(s => s.type === pItem.type ? { ...s, status: 'generating' } : s));

       try {
         const url = await orchestrator.executeStep(stepId, async () => {
           const res = await fetch("/api/generate", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ image, platform: selectedPlatform, imageType: pItem.type, product: productName }),
           });
           const data = await res.json();
           if (!res.ok) throw new Error(data.error);
           return data.image;
         });

         if (url) {
           setTimelineSteps(prev => prev.map(s => s.type === pItem.type ? { ...s, status: 'completed', url } : s));
           setActiveStepId(pItem.type);
         }
       } catch (err) {
         console.error(err);
       }
    }

    updateOrchestration('rebuild', 'completed');
    updateOrchestration('optimize', 'completed');
    setCurrentAction("Suite Ready for Marketplace");
    setIsGenerating(false);

    const duration = (Date.now() - startTime) / 1000;
    trackMerchantAction('workflow_completed', { durationSeconds: duration, assetCount: runSteps.length });
  };

  const activeImage = timelineSteps.find(s => s.id === activeStepId)?.url;
  const isSuiteComplete = timelineSteps.some(s => s.url);

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-160px)] xl:h-[calc(100vh-96px)] -m-6 md:-m-12 overflow-y-auto lg:overflow-hidden bg-white lg:rounded-3xl border border-gray-100 shadow-sm relative">
          {isSuiteComplete && !isGenerating && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-green-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-bold">Commercial Suite Ready</span>
               </div>
            </div>
          )}

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
                  image && !isGenerating && !isSuiteComplete ? "animate-pulse shadow-indigo-200 scale-[1.02]" : "shadow-gray-100",
                  "hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98]"
                )}
              >
                <Zap className="w-4 h-4 fill-white" /> {isSuiteComplete ? "Regenerate Full Suite" : "Start Production"}
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col min-h-[500px] lg:min-h-0 bg-[#F8FAFF]">
            <CreativeWorkspace
              image={image}
              activeImage={activeImage || null}
              isGenerating={isGenerating}
              steps={orchestrationSteps}
              currentAction={currentAction}
            />
          </main>

          <aside className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 bg-white lg:overflow-y-auto">
            <ProductionTimeline
              steps={timelineSteps}
              activeStepId={activeStepId}
              onSelect={setActiveStepId}
              onRegenerate={() => {}}
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
