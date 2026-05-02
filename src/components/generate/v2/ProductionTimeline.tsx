"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, RefreshCw, Download, ChevronRight, Loader2, LayoutGrid, ShieldCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  id: string;
  type: string;
  label: string;
  status: 'pending' | 'generating' | 'evaluating' | 'completed' | 'failed' | 'skipped';
  url?: string;
  criticFeedback?: {
    score: {
      overall: number;
    }
  }
}

interface ProductionTimelineProps {
  steps: TimelineStep[];
  activeStepId: string | null;
  onSelect: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDownload: (url: string, type: string) => void;
}

const CONTEXT_MESSAGES: Record<string, string> = {
  main: "Preparing marketplace hero shot...",
  usp: "Focusing on key product features...",
  lifestyle: "Building authentic usage scene...",
  info: "Optimizing for technical specs...",
  poster: "Planning promotional layout..."
};

export const ProductionTimeline = ({ steps, activeStepId, onSelect, onRegenerate, onDownload }: ProductionTimelineProps) => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Production Timeline</h2>
        <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-600">
           {steps.filter(s => s.status === 'completed').length} / {steps.length} Assets
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => step.url && onSelect(step.id)}
            className={cn(
              "group relative p-4 rounded-2xl border-2 transition-all cursor-pointer",
              activeStepId === step.id ? "border-indigo-600 bg-indigo-50/10 shadow-sm" : "border-gray-50 hover:border-indigo-100 bg-white",
              (step.status === 'generating' || step.status === 'evaluating') && "border-indigo-400 animate-pulse"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (step.status === 'generating' || step.status === 'evaluating') ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-200" />
                )}
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", step.status === 'completed' ? "text-gray-900" : "text-gray-400")}>
                  {step.label}
                </span>
              </div>
              {step.status === 'completed' && (
                <div className="flex items-center gap-1.5">
                   <div className="text-[9px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {step.criticFeedback?.score.overall || 90}% Taste
                   </div>
                   <ChevronRight className="w-3 h-3 text-gray-300" />
                </div>
              )}
            </div>

            {step.url ? (
              <div className="space-y-3">
                <div className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden relative group/thumb">
                  <img src={step.url} className="w-full h-full object-cover" alt="Thumb" />

                  {/* Quality Confidence Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded text-[8px] font-bold text-green-600 shadow-sm border border-green-100">
                    <ShieldCheck className="w-2.5 h-2.5" /> Identity Verified
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-2">
                    <button onClick={(e) => {e.stopPropagation(); onRegenerate(step.id)}} className="p-2 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform shadow-lg"><RefreshCw className="w-3 h-3" /></button>
                    <button onClick={(e) => {e.stopPropagation(); onDownload(step.url!, step.type)}} className="p-2 bg-white rounded-full text-gray-600 hover:scale-110 transition-transform shadow-lg"><Download className="w-3 h-3" /></button>
                  </div>
                </div>
                {/* Mobile-visible actions */}
                <div className="flex md:hidden items-center gap-2">
                  <button onClick={(e) => {e.stopPropagation(); onRegenerate(step.id)}} className="flex-1 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-indigo-600 flex items-center justify-center gap-2 border border-gray-100"><RefreshCw className="w-3 h-3" /> Regenerate</button>
                  <button onClick={(e) => {e.stopPropagation(); onDownload(step.url!, step.type)}} className="flex-1 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-600 flex items-center justify-center gap-2 border border-gray-100"><Download className="w-3 h-3" /> Download</button>
                </div>
              </div>
            ) : (
              <div className="aspect-square w-full rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                {step.status === 'evaluating' ? (
                  <Eye className="w-6 h-6 mb-2 text-indigo-400 animate-pulse" />
                ) : (
                  <LayoutGrid className="w-6 h-6 mb-2 opacity-20" />
                )}
                <span className="text-[10px] font-medium text-center px-4">
                  {step.status === 'generating' ? "Engine active..." :
                   step.status === 'evaluating' ? "Evaluating marketplace taste..." :
                   CONTEXT_MESSAGES[step.type] || "Awaiting Production"}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      {steps.some(s => s.url) && (
        <div className="p-4 bg-white border-t border-gray-100">
           <button
             onClick={() => steps.forEach(s => s.url && onDownload(s.url, s.type))}
             className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
           >
             <Download className="w-3 h-3" /> Download Full Suite
           </button>
        </div>
      )}
    </div>
  );
};
