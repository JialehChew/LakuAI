"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImagePlus, Library, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { icon: <ImagePlus className="w-5 h-5" />, label: t.common.generate, href: "/generate" },
    { icon: <Library className="w-5 h-5" />, label: t.common.library, href: "/library" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-lexend text-violet-700">LakuAI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                pathname === item.href
                  ? "bg-violet-700 text-white shadow-lg shadow-violet-200"
                  : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <div className="px-4">
            <LanguageSwitcher />
          </div>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-lexend text-violet-700">LakuAI</Link>
          <LanguageSwitcher />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
