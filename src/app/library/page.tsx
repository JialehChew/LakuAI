"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Download, Trash2, Image as ImageIcon } from "lucide-react";
import { saveAs } from "file-saver";
import Link from "next/link";

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
        <h1 className="text-3xl font-bold font-lexend text-gray-900">{t.library.title}</h1>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold font-lexend text-gray-900 mb-2">{t.library.emptyTitle}</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t.library.emptyDesc}</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-violet-700 text-white px-8 py-3 rounded-full font-bold hover:bg-violet-800 transition-all shadow-lg shadow-violet-100"
          >
            {t.library.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img src={project.image} alt={project.name} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => downloadImage(project.image, project.name)}
                    className="p-3 bg-white rounded-full text-violet-700 hover:bg-violet-50 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-3 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold font-lexend text-gray-900 truncate">{project.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-violet-600 font-semibold uppercase tracking-wider">
                    {t.generate.styles[project.style as keyof typeof t.generate.styles]}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(project.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
