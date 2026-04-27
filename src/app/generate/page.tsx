"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PlatformSelector } from "@/components/generate/PlatformSelector";
import { ImageTypeSelector } from "@/components/generate/ImageTypeSelector";
import { MockGenAnimation } from "@/components/generate/MockGenAnimation";
import { ProgressTracker, ProgressStep } from "@/components/generate/ProgressTracker";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { trackMerchantAction } from "@/lib/visual-engine/utils/analytics-tracker";
import { getCommercialRecommendations } from "@/lib/visual-engine/utils/recommender";
import {
  Upload, X, Wand2, Download, Save, Edit2, AlertCircle,
  FileText, ShieldCheck, Zap, Sparkles, RefreshCw, LayoutGrid, Loader2, ThumbsUp, ThumbsDown, Info, ArrowUpRight
} from "lucide-react";
import { saveAs } from "file-saver";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  url: string;
  type: string;
}

export default function GeneratePage() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("shopee");
  const [selectedImageType, setSelectedImageType] = useState("main");
  const [productNameInput, setProductNameInput] = useState("");
  const [sellingPoint, setSellingPoint] = useState("");
  const [scenario, setScenario] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  const [projectName, setProjectName] = useState("Untilted Project");
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'simple' | 'pro'>('simple');

  const [steps, setSteps] = useState<ProgressStep[]>([
    { id: 'analyze', label: 'Analyzing packaging...', status: 'pending' },
    { id: 'behavior', label: 'Optimizing for mobile shoppers...', status: 'pending' },
    { id: 'consistency', label: 'Ensuring brand consistency...', status: 'pending' },
    { id: 'generate', label: 'Generating Commercial Suite...', status: 'pending' },
  ]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Image too large. Please upload an image under 4MB.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateStep = (id: string, status: ProgressStep['status']) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const generateSingle = async (type: string) => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image,
        platform: selectedPlatform,
        imageType: type,
        product: productNameInput,
        sellingPoint,
        scenario,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Generation failed");
    return data.image;
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    trackMerchantAction('suite_generated', { platform: selectedPlatform, mode });

    try {
      updateStep('analyze', 'loading');
      await new Promise(r => setTimeout(r, 600));
      updateStep('analyze', 'completed');
      updateStep('behavior', 'loading');
      await new Promise(r => setTimeout(r, 500));
      updateStep('behavior', 'completed');
      updateStep('consistency', 'loading');
      await new Promise(r => setTimeout(r, 400));
      updateStep('consistency', 'completed');
      updateStep('generate', 'loading');

      const mainUrl = await generateSingle(selectedImageType);
      const mainImg = { id: Date.now().toString(), url: mainUrl, type: selectedImageType };
      setGeneratedImages([mainImg]);
      setActiveImageId(mainImg.id);

      if (mode === 'simple') {
        const uspUrl = await generateSingle('usp');
        setGeneratedImages(prev => [...prev, { id: (Date.now() + 1).toString(), url: uspUrl, type: 'usp' }]);
      }
      updateStep('generate', 'completed');
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateActive = async () => {
    const active = generatedImages.find(img => img.id === activeImageId);
    if (!active || isGenerating) return;
    trackMerchantAction('image_regenerated', { type: active.type, platform: selectedPlatform });
    setIsGenerating(true);
    try {
      const newUrl = await generateSingle(active.type);
      setGeneratedImages(prev => prev.map(img => img.id === activeImageId ? { ...img, url: newUrl } : img));
    } catch (err: any) {
      setError(err.message || "Regeneration failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const activeImage = generatedImages.find(img => img.id === activeImageId);
  const insights = getCommercialRecommendations({ image: image || '', platform: selectedPlatform, imageType: selectedImageType, product: productNameInput, sellingPoint });

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 onClick={() => setIsEditingName(true)} className="text-2xl font-bold font-lexend text-gray-900 cursor-pointer">
            {isEditingName ? (
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-transparent border-b-2 border-indigo-600 focus:outline-none" autoFocus onBlur={() => setIsEditingName(false)} />
            ) : projectName}
          </h1>
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button onClick={() => setMode('simple')} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg", mode === 'simple' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500")}>Simple</button>
             <button onClick={() => setMode('pro')} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg", mode === 'pro' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500")}>Pro</button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 aspect-square relative overflow-hidden flex flex-col items-center justify-center p-8 shadow-sm group">
            {activeImage ? (
              <>
                <img src={activeImage.url} className="w-full h-full object-contain animate-in fade-in duration-500" alt="View" />
                {!isGenerating && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleRegenerateActive} className="bg-white/90 backdrop-blur shadow-lg border border-gray-100 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 text-indigo-600 hover:bg-white transition-all">
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                    <button onClick={() => {trackMerchantAction('image_downloaded', { type: activeImage.type }); saveAs(activeImage.url, `${projectName}-${activeImage.type}.png`)}} className="bg-white/90 backdrop-blur shadow-lg border border-gray-100 p-2 rounded-full text-gray-600 hover:bg-white">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {isGenerating && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>}
              </>
            ) : image ? (
              <>
                <img src={image} className="w-full h-full object-contain" alt="Preview" />
                {isGenerating && <MockGenAnimation />}
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-lg font-bold font-lexend mb-1">{t.generate.uploadTitle}</h3>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            )}
          </div>

          {generatedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {generatedImages.map((img) => (
                <button key={img.id} onClick={() => setActiveImageId(img.id)} className={cn("aspect-square rounded-xl overflow-hidden border-2 transition-all", activeImageId === img.id ? "border-indigo-600 scale-105" : "border-transparent opacity-60 hover:opacity-100")}>
                  <img src={img.url} className="w-full h-full object-cover" alt="Suite" />
                </button>
              ))}
            </div>
          )}

          {isGenerating && !activeImageId && <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl"><ProgressTracker steps={steps} /></div>}

          <div className="flex gap-4">
            <button onClick={handleGenerate} disabled={!image || isGenerating} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 active:scale-[0.98]">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5 fill-white" />}
              {isGenerating ? "My Creative Team is Working..." : "Generate Listing Suite"}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Seller Insights Panel */}
          {insights.length > 0 && (
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4" /> Seller Insights
              </div>
              {insights.map(i => (
                <p key={i.id} className="text-xs text-amber-700 leading-relaxed font-medium">{i.message}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-5 h-5" />
              <div><p className="text-[10px] font-bold text-indigo-400 uppercase">Preservation</p><p className="text-xs font-bold text-indigo-900">Lock Active</p></div>
            </div>
            <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100 flex items-center gap-3">
              <Sparkles className="text-violet-600 w-5 h-5" />
              <div><p className="text-[10px] font-bold text-violet-400 uppercase">Optimized</p><p className="text-xs font-bold text-violet-900">Shopee MY</p></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
             <h2 className="text-lg font-bold font-lexend flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" />Listing Details</h2>
             <div className="space-y-4">
               <input type="text" value={productNameInput} onChange={(e) => setProductNameInput(e.target.value)} placeholder={t.generate.productPlaceholder} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
               {mode === 'pro' && (
                 <>
                   <input type="text" value={sellingPoint} onChange={(e) => setSellingPoint(e.target.value)} placeholder={t.generate.sellingPointPlaceholder} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
                   <input type="text" value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder={t.generate.scenarioPlaceholder} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
                 </>
               )}
             </div>
          </div>

          <div className={cn("space-y-8", mode === 'simple' && "opacity-50 pointer-events-none grayscale")}>
            <PlatformSelector selectedPlatform={selectedPlatform} onSelect={setSelectedPlatform} />
            <ImageTypeSelector selectedType={selectedImageType} onSelect={setSelectedImageType} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
