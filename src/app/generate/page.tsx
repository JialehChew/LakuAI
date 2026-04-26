"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PlatformSelector } from "@/components/generate/PlatformSelector";
import { ImageTypeSelector } from "@/components/generate/ImageTypeSelector";
import { MockGenAnimation } from "@/components/generate/MockGenAnimation";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Upload, X, Wand2, Download, Save, Edit2, AlertCircle, FileText } from "lucide-react";
import { saveAs } from "file-saver";

export default function GeneratePage() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("shopee");
  const [selectedImageType, setSelectedImageType] = useState("main");
  const [productNameInput, setProductNameInput] = useState("");
  const [sellingPoint, setSellingPoint] = useState("");
  const [scenario, setScenario] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untilted Project");
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    if (!image) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          platform: selectedPlatform,
          imageType: selectedImageType,
          product: productNameInput,
          sellingPoint,
          scenario,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGeneratedImage(data.image);

      const library = JSON.parse(localStorage.getItem("lakuai-library") || "[]");
      const newProject = {
        id: Date.now(),
        name: projectName,
        image: data.image,
        platform: selectedPlatform,
        imageType: selectedImageType,
        product: productNameInput,
        date: new Date().toISOString(),
      };
      localStorage.setItem("lakuai-library", JSON.stringify([newProject, ...library]));
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Something went wrong. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      saveAs(generatedImage, `${projectName}.png`);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-2xl font-bold font-lexend bg-transparent border-b-2 border-indigo-600 focus:outline-none px-1"
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              />
              <button onClick={() => setIsEditingName(false)} className="text-indigo-600"><Save className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
              <h1 className="text-2xl font-bold font-lexend text-gray-900">{projectName}</h1>
              <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Workspace */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 aspect-square relative overflow-hidden flex flex-col items-center justify-center p-8 group shadow-sm transition-all hover:border-indigo-300">
            {generatedImage ? (
              <img src={generatedImage} className="w-full h-full object-contain" alt="Generated result" />
            ) : image ? (
              <>
                <img src={image} className="w-full h-full object-contain" alt="Upload preview" />
                {isGenerating && <MockGenAnimation />}
                {!isGenerating && (
                  <button
                    onClick={() => {setImage(null); setGeneratedImage(null);}}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:text-red-600 transition-colors z-30"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-lexend mb-1">{t.generate.uploadTitle}</h3>
                <p className="text-gray-500 text-sm">{t.generate.uploadDesc}</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!image || isGenerating}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {isGenerating ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t.common.loading}</>
              ) : (
                <><Wand2 className="w-5 h-5" /> {t.generate.btnGenerate}</>
              )}
            </button>

            {(generatedImage || (image && !isGenerating)) && (
              <button
                onClick={() => {
                  if (generatedImage) {
                    handleDownload();
                  } else {
                    setImage(null);
                    setGeneratedImage(null);
                  }
                }}
                className="bg-white border-2 border-indigo-100 text-indigo-700 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-sm active:scale-[0.98]"
              >
                {generatedImage ? <Download className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-8">
          {/* User Brief Priority Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
             <h2 className="text-lg font-bold font-lexend flex items-center gap-2">
               <FileText className="w-5 h-5 text-indigo-600" />
               User Brief
             </h2>
             <div className="space-y-3">
               <div>
                 <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">{t.generate.productLabel}</label>
                 <input
                   type="text"
                   value={productNameInput}
                   onChange={(e) => setProductNameInput(e.target.value)}
                   placeholder={t.generate.productPlaceholder}
                   className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                 />
               </div>
               <div>
                 <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">{t.generate.sellingPointLabel}</label>
                 <input
                   type="text"
                   value={sellingPoint}
                   onChange={(e) => setSellingPoint(e.target.value)}
                   placeholder={t.generate.sellingPointPlaceholder}
                   className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                 />
               </div>
               <div>
                 <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">{t.generate.scenarioLabel}</label>
                 <input
                   type="text"
                   value={scenario}
                   onChange={(e) => setScenario(e.target.value)}
                   placeholder={t.generate.scenarioPlaceholder}
                   className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                 />
               </div>
             </div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-lexend mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-sm">1</span>
              {t.generate.selectPlatform}
            </h2>
            <PlatformSelector selectedPlatform={selectedPlatform} onSelect={setSelectedPlatform} />
          </div>

          <div>
            <h2 className="text-xl font-bold font-lexend mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-sm">2</span>
              {t.generate.selectImageType}
            </h2>
            <ImageTypeSelector selectedType={selectedImageType} onSelect={setSelectedImageType} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
