"use client";

import { Check, Eye, ShieldCheck, Zap } from "lucide-react";

export const WorkflowBlueprint = () => {
  const outputs = [
    { label: "Mobile-optimized hero image", icon: <Zap className="w-3 h-3" /> },
    { label: "Product detail close-up", icon: <Check className="w-3 h-3" /> },
    { label: "Lifestyle marketing scene", icon: <Check className="w-3 h-3" /> },
    { label: "V3 Taste Evaluation", icon: <Eye className="w-3 h-3 text-amber-300" /> },
    { label: "Identity Preservation", icon: <ShieldCheck className="w-3 h-3 text-green-300" /> }
  ];

  return (
    <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200">
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Workflow Blueprint</h3>
      <div className="space-y-3">
        {outputs.map((out, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {out.icon}
            </div>
            <span className="text-xs font-bold text-indigo-50">{out.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
