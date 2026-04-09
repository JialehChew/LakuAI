"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold font-lexend text-gray-900">{t.common.settings}</h1>
        <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center">
          <p className="text-gray-500">Settings panel coming soon! Manage your profile and preferences here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
