"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { User, Mail, Phone, Lock, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "الاسم الكامل مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    phone: z.string().min(10, "رقم الجوال يجب أن يكون 10 أرقام على الأقل"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "يجب الموافقة على الشروط وسياسة الاستخدام" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email.trim().toLowerCase(),
          phone: data.phone,
          password: data.password,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "حدث خطأ أثناء التسجيل");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-zinc-800 text-center relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تم إرسال طلب التسجيل بنجاح</h2>
          <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
            تم استلام بياناتك بنجاح. حسابك الآن قيد انتظار اعتماد وتفعيل مسؤول النظام في شركة سيما العقارية قبل التمكن من الدخول إلى المنصة واستعراض الخريطة.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full py-3 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all"
          >
            الانتقال إلى بوابة الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 border border-zinc-800 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="سيما العقارية"
            className="h-16 w-auto object-contain mb-2 drop-shadow-xl"
          />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">سـيـمـا العقارية</h1>
          </div>
          <p className="text-zinc-400 text-xs mt-1">طلب الانضمام والتسجيل في منصة سيما العقارية</p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-[11px] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>يتطلب تفعيل الحساب موافقة الإدارة</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="محمد عبدالله"
                  className="w-full ps-9 pe-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
                />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم الجوال</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="05XXXXXXXX"
                  className="w-full ps-9 pe-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="user@example.com"
                className="w-full ps-9 pe-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
              />
            </div>
            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full ps-9 pe-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
                />
              </div>
              {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full ps-9 pe-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-[10px] mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
              <input
                type="checkbox"
                {...register("terms")}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-[#F15A24] focus:ring-[#F15A24]"
              />
              <span>أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمنصة</span>
            </label>
            {errors.terms && <p className="text-red-400 text-[10px] mt-1">{errors.terms.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إرسال الطلب...</span>
              </>
            ) : (
              <span>إرسال طلب التسجيل للاعتماد</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
          لديك حساب مفعل بالفعل؟{" "}
          <Link href="/auth/login" className="text-[#F15A24] font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
