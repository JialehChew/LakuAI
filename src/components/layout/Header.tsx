"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-bold font-lexend text-indigo-600 tracking-tight">LakuAI</span>
          <span className="text-[8px] uppercase tracking-[0.2em] text-indigo-400 font-bold -mt-1">Digital Artisan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            {t.common.howItWorks}
          </Link>
          <LanguageSwitcher />
          <Link
            href="/overview"
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            {t.common.start}
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/overview" className="text-indigo-600 font-bold text-sm">
            {t.common.start}
          </Link>
        </div>
      </div>
    </header>
  );
};
