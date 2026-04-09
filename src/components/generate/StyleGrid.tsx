"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: 'minimalist', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=200&auto=format&fit=crop' },
  { id: 'studio', image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=200&auto=format&fit=crop' },
  { id: 'tropical', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?q=80&w=200&auto=format&fit=crop' },
  { id: 'festive', image: 'https://images.unsplash.com/photo-1512418490979-92798ccc1340?q=80&w=200&auto=format&fit=crop' },
  { id: 'cozy', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=200&auto=format&fit=crop' },
];

interface StyleGridProps {
  selectedStyle: string;
  onSelect: (id: string) => void;
}

export const StyleGrid = ({ selectedStyle, onSelect }: StyleGridProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={cn(
            "group relative aspect-square rounded-2xl overflow-hidden border-4 transition-all",
            selectedStyle === style.id ? "border-violet-600 scale-[1.02] shadow-xl shadow-violet-100" : "border-transparent hover:border-violet-200"
          )}
        >
          <img src={style.image} alt={style.id} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <span className="text-white text-xs font-bold font-lexend">
              {t.generate.styles[style.id as keyof typeof t.generate.styles]}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
