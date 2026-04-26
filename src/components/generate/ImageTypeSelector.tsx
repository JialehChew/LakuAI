"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Layout, Image as ImageIcon, Sparkles, Home, Info, Clapperboard } from "lucide-react";

const IMAGE_TYPES = [
  { id: 'main', icon: <ImageIcon className="w-5 h-5" /> },
  { id: 'usp', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'function', icon: <Clapperboard className="w-5 h-5" /> },
  { id: 'lifestyle', icon: <Home className="w-5 h-5" /> },
  { id: 'info', icon: <Info className="w-5 h-5" /> },
  { id: 'poster', icon: <Layout className="w-5 h-5" /> },
];

interface ImageTypeSelectorProps {
  selectedType: string;
  onSelect: (id: string) => void;
}

export const ImageTypeSelector = ({ selectedType, onSelect }: ImageTypeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {IMAGE_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left",
            selectedType === type.id
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
              : "bg-white border-gray-100 text-gray-600 hover:border-indigo-200"
          )}
        >
          <div className={cn(
            "p-2 rounded-lg",
            selectedType === type.id ? "bg-white/20" : "bg-gray-50 text-gray-400"
          )}>
            {type.icon}
          </div>
          <span className="text-xs font-bold font-lexend">
            {t.generate.imageTypes[type.id as keyof typeof t.generate.imageTypes]}
          </span>
        </button>
      ))}
    </div>
  );
};
