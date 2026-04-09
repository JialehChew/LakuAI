"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function CreditsPage() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t.credits.starter,
      price: "RM 0",
      features: ["5 credits/month", "Basic Styles", "Standard Quality", "Community Support"],
      button: "Current Plan",
      current: true
    },
    {
      name: t.credits.pro,
      price: "RM 49",
      features: ["50 credits/month", "All Pro Styles", "HD Quality", "Priority Support", "No Watermark"],
      button: "Upgrade to Pro",
      popular: true
    },
    {
      name: t.credits.enterprise,
      price: "RM 199",
      features: ["Unlimited credits", "Custom Styles", "4K Quality", "24/7 Support", "API Access"],
      button: "Contact Sales"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <section>
          <h1 className="text-4xl font-bold font-lexend text-gray-900 mb-2">{t.credits.title}</h1>
        </section>

        {/* Balance Card */}
        <section>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-indigo-100 font-medium mb-1 uppercase tracking-wider text-sm">{t.credits.balance}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold font-lexend">5</span>
                  <span className="text-2xl text-indigo-200">/ 10</span>
                </div>
              </div>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                <Zap className="w-5 h-5 fill-indigo-600" />
                Buy More Credits
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section>
          <h2 className="text-2xl font-bold font-lexend mb-8 text-center text-gray-800">{t.credits.upgradeTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl p-8 border-2 ${plan.popular ? 'border-indigo-600 shadow-xl shadow-indigo-50 relative' : 'border-gray-100'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-gray-900 font-lexend">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-600 text-sm">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.current ? 'bg-gray-100 text-gray-500 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}>
                  {plan.button}
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
