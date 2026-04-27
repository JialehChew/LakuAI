"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, RefreshCw, Download, ChevronRight, Loader2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  id: string;
  type: string;
  label: string;
  status: 'pending' | 'generating' | 'completed';
  url?: string;
}

interface ProductionTimelineProps {
  steps: TimelineStep[];
  activeStepId: string | null;
  onSelect: (id: string) => void;
  onRegenerate: (id: string) => void;
  onDownload: (url: string, type: string) => void;
}

export const ProductionTimeline = ({ steps, activeStepId, onSelect, onRegenerate, onDownload }: ProductionTimelineProps) => {
  return (
    <div className="w-80 bg-white border-l border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Suite Production</h2>
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
              activeStepId === step.id ? "border-indigo-600 bg-indigo-50/50" : "border-gray-50 hover:border-indigo-100 bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : step.status === 'generating' ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-200" />
                )}
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", step.status === 'completed' ? "text-gray-900" : "text-gray-400")}>
                  {step.label}
                </span>
              </div>
              {step.status === 'completed' && <ChevronRight className="w-3 h-3 text-gray-300" />}
            </div>

            {step.url ? (
              <div className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden relative group/thumb">
                <img src={step.url} className="w-full h-full object-cover" alt="Thumb" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button onClick={(e) => {e.stopPropagation(); onRegenerate(step.id)}} className="p-2 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform"><RefreshCw className="w-3 h-3" /></button>
                   <button onClick={(e) => {e.stopPropagation(); onDownload(step.url!, step.type)}} className="p-2 bg-white rounded-full text-gray-600 hover:scale-110 transition-transform"><Download className="w-3 h-3" /></button>
                </div>
              </div>
            ) : (
              <div className="aspect-square w-full rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                <LayoutGrid className="w-6 h-6 mb-2 opacity-20" />
                <span className="text-[10px] font-medium">Awaiting Production</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
