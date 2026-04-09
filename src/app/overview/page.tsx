"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Wand2, Library, Palette, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  image: string;
  style: string;
  date: string;
}

export default function OverviewPage() {
  const { t } = useTranslation();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("lakuai-library");
    if (saved) {
      setRecentProjects(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  const quickActions = [
    { icon: <Wand2 className="w-6 h-6" />, label: t.overview.startGenerating, href: "/generate", color: "bg-indigo-600" },
    { icon: <Library className="w-6 h-6" />, label: t.overview.viewGallery, href: "/library", color: "bg-violet-600" },
    { icon: <Palette className="w-6 h-6" />, label: t.overview.browseStyles, href: "/generate", color: "bg-purple-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <section>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold font-lexend text-gray-900 mb-2"
          >
            {t.overview.welcome}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg"
          >
            {t.overview.subtitle}
          </motion.p>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold font-lexend mb-6 text-gray-800">{t.overview.quickActions}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className={`w-12 h-12 ${action.color} text-white rounded-xl flex items-center justify-center mb-4 relative z-10`}>
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 relative z-10">{action.label}</h3>
                  <div className="flex items-center text-indigo-600 text-sm font-semibold relative z-10">
                    Get started <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-lexend text-gray-800">{t.overview.recentProjects}</h2>
            <Link href="/library" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>

          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 group">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img src={project.image} alt={project.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(project.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500">{t.overview.noRecent}</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
