"use client";

import { Header } from "@/components/layout/Header";
import { BeforeAfterSlider } from "@/components/landing/BeforeAfterSlider";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Upload, Palette, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useTranslation();

  const steps = [
    { icon: <Upload className="w-6 h-6" />, title: t.landing.step1Title, desc: t.landing.step1Desc },
    { icon: <Palette className="w-6 h-6" />, title: t.landing.step2Title, desc: t.landing.step2Desc },
    { icon: <Download className="w-6 h-6" />, title: t.landing.step3Title, desc: t.landing.step3Desc },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50 to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold font-lexend text-gray-900 mb-6 tracking-tight"
          >
            {t.landing.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={word === 'AI' ? 'text-indigo-600' : ''}>{word} </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            {t.landing.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            <Link
              href="/overview"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-[0.98]"
            >
              {t.landing.cta} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <BeforeAfterSlider />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 font-lexend text-gray-900">{t.common.howItWorks}</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-lexend">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-gray-300">
                    <ArrowRight className="w-12 h-12" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold font-lexend text-indigo-600">LakuAI</div>
          <div className="flex items-center gap-6">
             <span className="text-xs font-bold text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full">{t.common.malaysianBadge}</span>
             <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} LakuAI. Digital Artisan.
             </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
