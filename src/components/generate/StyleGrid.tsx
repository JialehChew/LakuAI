"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: 'minimalist', image: 'https://images.unsplash.com/photo-1555529731-118a5bb67af7?q=80&w=300&auto=format&fit=crop' },
  { id: 'studio', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300&auto=format&fit=crop' },
  { id: 'tropical', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?q=80&w=300&auto=format&fit=crop' },
  { id: 'festive', image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=300&auto=format&fit=crop' },
  { id: 'cozy', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=300&auto=format&fit=crop' },
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
            "group relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300",
            selectedStyle === style.id
              ? "border-indigo-600 scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              : "border-transparent hover:border-indigo-200"
          )}
        >
          <img
            src={style.image}
            alt={style.id}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
               // Fallback for broken images
               (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <span className="text-white text-[10px] font-bold font-lexend uppercase tracking-wider">
              {t.generate.styles[style.id as keyof typeof t.generate.styles]}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
