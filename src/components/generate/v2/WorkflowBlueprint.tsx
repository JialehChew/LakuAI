"use client";

import { Check } from "lucide-react";

export const WorkflowBlueprint = () => {
  const outputs = [
    "Mobile-optimized hero image",
    "Product detail close-up",
    "Lifestyle marketing scene",
    "Trust-building composition",
    "Promotional campaign poster"
  ];

  return (
    <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200">
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Workflow Blueprint</h3>
      <div className="space-y-3">
        {outputs.map((out, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="text-xs font-bold text-indigo-50">{out}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
