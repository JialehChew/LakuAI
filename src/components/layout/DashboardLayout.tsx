"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wand2,
  Library,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: t.common.overview, href: "/overview" },
    { icon: <Wand2 className="w-5 h-5" />, label: t.common.generate, href: "/generate" },
    { icon: <Library className="w-5 h-5" />, label: t.common.library, href: "/library" },
    { icon: <CreditCard className="w-5 h-5" />, label: t.common.credits, href: "/credits" },
    { icon: <Settings className="w-5 h-5" />, label: t.common.settings, href: "/settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-white p-6">
      {/* Branding */}
      <div className="mb-10">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-bold font-lexend text-white">LakuAI</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-bold">Digital Artisan</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
              pathname === item.href
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                : "text-indigo-100/70 hover:bg-white/5 hover:text-white"
            )}
          >
            {item.icon}
            {item.label}
            {pathname === item.href && (
              <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer / Malaysian Badge */}
      <div className="mt-auto space-y-6">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold mb-3">Resources</p>
          <div className="space-y-2">
            <a href="#" className="flex items-center justify-between text-xs text-indigo-100/60 hover:text-white transition-colors group">
              {t.common.shopeeTips} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </a>
            <a href="#" className="flex items-center justify-between text-xs text-indigo-100/60 hover:text-white transition-colors group">
              {t.common.tiktokGuide} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 rounded-lg w-fit">
              {t.common.malaysianBadge}
            </div>
            <button className="flex items-center gap-3 px-2 py-2 w-full text-left text-xs font-semibold text-indigo-100/40 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFF] overflow-hidden">
      {/* Desktop Sidebar (Fixed Glassmorphism) */}
      <aside className="w-72 bg-[#0A0C1B] hidden md:block relative z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-transparent pointer-events-none" />
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Top Nav */}
        <header className="md:hidden bg-[#0A0C1B] p-4 flex items-center justify-between z-30">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold font-lexend text-white">LakuAI</span>
            <span className="text-[8px] uppercase tracking-widest text-indigo-400">Digital Artisan</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white bg-white/10 rounded-lg"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0A0C1B] z-40 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-6xl mx-auto pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
