"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Download, Trash2, Image as ImageIcon } from "lucide-react";
import { saveAs } from "file-saver";
import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  image: string;
  style: string;
  date: string;
}

export default function LibraryPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lakuai-library");
    if (saved) {
      setProjects(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const deleteProject = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("lakuai-library", JSON.stringify(updated));
  };

  const downloadImage = (image: string, name: string) => {
    saveAs(image, `${name}.png`);
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-lexend text-gray-900">{t.library.title}</h1>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold font-lexend text-gray-900 mb-2">{t.library.emptyTitle}</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t.library.emptyDesc}</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            {t.library.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img src={project.image} alt={project.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={() => downloadImage(project.image, project.name)}
                    className="p-3 bg-white rounded-full text-indigo-700 hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-3 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold font-lexend text-gray-900 truncate text-sm">{project.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                    {t.generate.styles[project.style as keyof typeof t.generate.styles]}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(project.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
