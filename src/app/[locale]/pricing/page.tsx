"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    id: "FREE",
    name: "الباقة المجانية",
    nameEn: "Free Plan",
    price: 0,
    features: ["إضافة 3 خدمات كحد أقصى", "ظهور عادي في نتائج البحث", "دعم فني عبر البريد الإلكتروني"],
    featuresEn: ["Add up to 3 services", "Standard search visibility", "Email support"],
  },
  {
    id: "BASIC",
    name: "الباقة الأساسية",
    nameEn: "Basic Plan",
    price: 2500, // DZD
    popular: true,
    features: ["إضافة خدمات غير محدودة", "ظهور متقدم في البحث", "تقارير الحجوزات", "دعم فني ذو أولوية"],
    featuresEn: ["Unlimited services", "Advanced search visibility", "Booking reports", "Priority support"],
  },
  {
    id: "PREMIUM",
    name: "الباقة الاحترافية",
    nameEn: "Premium Plan",
    price: 5000, // DZD
    features: ["كل ميزات الأساسية", "تمييز الحساب بعلامة ⭐️", "تحليلات متقدمة", "مدير حساب شخصي"],
    featuresEn: ["All Basic features", "Account verification badge ⭐️", "Advanced analytics", "Personal account manager"],
  },
];

export default function PricingPage() {
  const { locale = "en" } = useParams<{ locale: string }>();
  const router = useRouter();
  const isAr = locale === "ar";
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    // TODO: In a real app, integrate with payment gateway here
    // For MVP, we just simulate the process and redirect to dashboard
    setTimeout(() => {
      setLoading(null);
      router.push(`/${locale}/dashboard`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-desert-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-clay-900 mb-6 font-display">
            {isAr ? "اختر الباقة المناسبة لنشاطك السياحي" : "Choose the right plan for your business"}
          </h1>
          <p className="text-xl text-clay-600">
            {isAr 
              ? "انضم إلى منصة الواحة الحمراء وضاعف حجوزاتك السياحية من خلال باقاتنا المرنة" 
              : "Join RedOasis and multiply your tourism bookings with our flexible plans"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-transform hover:-translate-y-2 ${
                plan.popular ? 'border-oasis-500' : 'border-transparent'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-oasis-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-current" />
                  {isAr ? "الأكثر طلباً" : "Most Popular"}
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-clay-900 mb-2">
                  {isAr ? plan.name : plan.nameEn}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-clay-900">
                    {plan.price}
                  </span>
                  <span className="text-clay-500 font-medium">
                    {isAr ? "د.ج / شهرياً" : "DZD / month"}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {(isAr ? plan.features : plan.featuresEn).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-clay-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleSubscribe(plan.id)}
                isLoading={loading === plan.id}
                className={`w-full py-6 text-lg ${
                  plan.popular ? 'bg-oasis-600 hover:bg-oasis-700' : 'bg-clay-800 hover:bg-clay-900'
                }`}
              >
                {isAr ? "اشترك الآن" : "Subscribe Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
