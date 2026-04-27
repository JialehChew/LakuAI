"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import { MockGenAnimation } from "../MockGenAnimation";
import { ProgressTracker, ProgressStep } from "../ProgressTracker";

interface CreativeWorkspaceProps {
  image: string | null;
  activeImage: string | null;
  isGenerating: boolean;
  steps: ProgressStep[];
  currentAction: string;
}

export const CreativeWorkspace = ({ image, activeImage, isGenerating, steps, currentAction }: CreativeWorkspaceProps) => {
  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col relative overflow-hidden">
      {/* Workflow Narration & Strategy Badges */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Live Orchestration</h2>
            <p className="text-[10px] font-medium text-gray-400">{isGenerating ? currentAction : "Workspace Ready"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-bold text-gray-600">Identity Lock</span>
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
              <Zap className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-bold text-gray-600">Mobile Boost</span>
           </div>
        </div>
      </div>

      {/* Main Preview */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative aspect-square w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border-4 md:border-8 border-white overflow-hidden group">
          <AnimatePresence mode="wait">
            {activeImage ? (
              <motion.img
                key={activeImage}
                src={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-contain"
                alt="Production output"
              />
            ) : image ? (
              <motion.div key="preview" className="relative w-full h-full">
                <img src={image} className="w-full h-full object-contain" alt="Original" />
                {isGenerating && <MockGenAnimation />}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-bold opacity-30 text-center px-4">Your creative team is standing by.<br/>Upload a product to start.</p>
              </div>
            )}
          </AnimatePresence>

          {isGenerating && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-30">
               <motion.div
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="bg-white/90 p-4 md:p-6 rounded-full shadow-2xl"
               >
                 <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 animate-spin" />
               </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Status Area */}
      <div className="mt-8 flex justify-center">
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white px-6 md:px-8 py-4 rounded-[2rem] shadow-lg border border-gray-100 w-full max-w-md"
            >
              <ProgressTracker steps={steps} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
