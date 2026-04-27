"use client";

import { Upload, FileText, Globe, Zap, Palette, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowSetupProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  platform: string;
  setPlatform: (p: string) => void;
  mode: 'simple' | 'pro';
  setMode: (m: 'simple' | 'pro') => void;
  productName: string;
  setProductName: (n: string) => void;
}

export const WorkflowSetup = ({ onUpload, platform, setPlatform, mode, setMode, productName, setProductName }: WorkflowSetupProps) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 p-6 space-y-8 overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">1. Production Setup</h2>

        {/* Upload Area */}
        <label className="group flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer overflow-hidden relative">
          <Upload className="w-6 h-6 text-indigo-600 mb-2 group-hover:-translate-y-1 transition-transform" />
          <span className="text-xs font-bold text-gray-500">Upload Product</span>
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
        </label>

        {/* Workflow Mode */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
           <button onClick={() => setMode('simple')} className={cn("py-2 text-[10px] font-bold rounded-lg transition-all", mode === 'simple' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500")}>Quick Mode</button>
           <button onClick={() => setMode('pro')} className={cn("py-2 text-[10px] font-bold rounded-lg transition-all", mode === 'pro' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500")}>Pro Editor</button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-900"><FileText className="w-4 h-4 text-indigo-600" /> Listing Identity</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Sambal Ijo..."
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs border-0 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-900"><Globe className="w-4 h-4 text-indigo-600" /> Platform Visibility</label>
          <div className="grid grid-cols-2 gap-2">
            {['Shopee', 'TikTok', 'Lazada'].map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p.toLowerCase())}
                className={cn("py-2 px-3 rounded-xl border text-[10px] font-bold transition-all", platform === p.toLowerCase() ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-gray-100 text-gray-500 hover:border-indigo-200")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-50">
           <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl">
             <ShieldCheck className="w-4 h-4 text-green-600" />
             <span className="text-[10px] font-bold text-green-800">Product Details Protected</span>
           </div>
           <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl">
             <Zap className="w-4 h-4 text-indigo-600" />
             <span className="text-[10px] font-bold text-indigo-800">Marketplace Optimized</span>
           </div>
        </div>
      </div>
    </div>
  );
};
