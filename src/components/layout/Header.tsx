"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-lexend text-violet-700 tracking-tight">LakuAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-violet-700 transition-colors">
            {t.common.howItWorks}
          </Link>
          <LanguageSwitcher />
          <Link
            href="/generate"
            className="bg-violet-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-violet-800 transition-all shadow-lg shadow-violet-200"
          >
            {t.common.start}
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/generate" className="text-violet-700 font-bold text-sm">
            {t.common.start}
          </Link>
        </div>
      </div>
    </header>
  );
};
