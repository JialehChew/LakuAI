"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed';
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
}

export const ProgressTracker = ({ steps }: ProgressTrackerProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {step.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : step.status === 'loading' ? (
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-gray-200" />
            )}
          </div>
          <span className={cn(
            "text-sm font-medium transition-colors",
            step.status === 'loading' ? "text-indigo-600" :
            step.status === 'completed' ? "text-gray-900" : "text-gray-400"
          )}>
            {step.label}
          </span>
          {step.status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-1 w-12 bg-indigo-100 rounded-full overflow-hidden ml-auto"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-full bg-indigo-600"
              />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};
