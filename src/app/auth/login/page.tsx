"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") || "/";

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (res?.error) {
        setError(
          res.error.includes("موافقة")
            ? "حسابك مسجل لكنه قيد انتظار موافقة الإدارة"
            : "بيانات الدخول غير صحيحة أو الحساب غير مفعل"
        );
      } else {
        toast.success("تم تسجيل الدخول بنجاح! جاري توجيهك إلى المنصة...");
        router.push(from);
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setValue("email", email);
    setValue("password", pass);
    onSubmit({ email, password: pass });
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-zinc-800/80 relative z-10">
        {/* Logo and Brand Header (Unboxed clean image) */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="relative mb-3 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#F15A24]/30 to-amber-500/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
            <img
              src="/logo.png"
              alt="سيما العقارية"
              className="relative h-20 w-auto object-contain drop-shadow-2xl transition-transform hover:scale-105"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">سـيـمـا العقارية</h1>
          </div>
          <p className="text-zinc-400 text-xs mt-1">بوابة الدخول إلى منصة وخريطة سيما العقارية</p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-[11px] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>يتطلب الدخول حساباً معتمداً من إدارة المنصة</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="name@aqar-crm.com"
                className="w-full ps-10 pe-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
              />
            </div>
            {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full ps-10 pe-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
              />
            </div>
            {errors.password && <p className="text-red-400 text-[11px] mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-[#F15A24] focus:ring-[#F15A24]"
              />
              <span>تذكرني</span>
            </label>
            <span className="text-zinc-500 text-[11px]">نسيت كلمة المرور؟ تواصل مع الإدارة</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول والدخول إلى المنصة</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
          ليس لديك حساب؟{" "}
          <Link href="/auth/register" className="text-[#F15A24] font-bold hover:underline">
            طلب تسجيل حساب جديد
          </Link>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-5 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 mb-2">
            <KeyRound className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>بيانات الدخول السريع للتجربة المباشرة:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@aqar-crm.com", "admin123")}
              className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#F15A24]/40 text-right transition-all group"
            >
              <div className="text-[10px] font-bold text-white group-hover:text-[#F15A24]">👑 مدير النظام</div>
              <div className="text-[8px] text-zinc-500 font-mono">admin@aqar-crm.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("sales@aqar-crm.com", "admin123")}
              className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#F15A24]/40 text-right transition-all group"
            >
              <div className="text-[10px] font-bold text-white group-hover:text-[#F15A24]">💼 مدير مبيعات</div>
              <div className="text-[8px] text-zinc-500 font-mono">sales@aqar-crm.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("property@aqar-crm.com", "admin123")}
              className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-[#F15A24]/40 text-right transition-all group"
            >
              <div className="text-[10px] font-bold text-white group-hover:text-[#F15A24]">🏢 مسؤول عقارات</div>
              <div className="text-[8px] text-zinc-500 font-mono">property@aqar-crm.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
