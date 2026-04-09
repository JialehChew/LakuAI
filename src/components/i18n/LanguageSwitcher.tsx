"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="ms">Bahasa Melayu</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};
