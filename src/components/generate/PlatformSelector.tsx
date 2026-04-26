"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { id: 'shopee', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=200&auto=format&fit=crop' },
  { id: 'lazada', image: 'https://images.unsplash.com/photo-1522069213448-443a614da9b6?q=80&w=200&auto=format&fit=crop' },
  { id: 'tiktok', image: 'https://images.unsplash.com/photo-1511272420018-aef55658aefc?q=80&w=200&auto=format&fit=crop' },
  { id: 'xiaohongshu', image: 'https://images.unsplash.com/photo-1555529731-118a5bb67af7?q=80&w=200&auto=format&fit=crop' },
  { id: 'general', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
];

interface PlatformSelectorProps {
  selectedPlatform: string;
  onSelect: (id: string) => void;
}

export const PlatformSelector = ({ selectedPlatform, onSelect }: PlatformSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onSelect(platform.id)}
          className={cn(
            "group relative aspect-[4/3] rounded-2xl overflow-hidden border-4 transition-all duration-300",
            selectedPlatform === platform.id
              ? "border-indigo-600 scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              : "border-transparent hover:border-indigo-200"
          )}
        >
          <img
            src={platform.image}
            alt={platform.id}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-left">
            <span className="text-white text-[10px] font-bold font-lexend uppercase tracking-wider">
              {t.generate.platforms[platform.id as keyof typeof t.generate.platforms]}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
