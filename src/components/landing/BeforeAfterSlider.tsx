"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const { t } = useTranslation();

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - container.left) / container.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div
      className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden cursor-ew-resize shadow-2xl border-4 border-white/10"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Before Image (Original) */}
      <div
        className="absolute inset-0 bg-gray-200 bg-center bg-cover"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop')" }}
      >
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {t.landing.before}
        </div>
      </div>

      {/* After Image (AI Enhanced) */}
      <div
        className="absolute inset-0 bg-indigo-50 bg-center bg-cover"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&sepia=1&sat=-50')",
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          filter: "contrast(1.1) brightness(1.1) saturate(1.2)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent" />
        <div className="absolute top-4 right-4 bg-violet-600 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {t.landing.after}
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-1 h-4 bg-gray-300 rounded-full mx-0.5" />
          <div className="w-1 h-4 bg-gray-300 rounded-full mx-0.5" />
        </div>
      </div>
    </div>
  );
};
