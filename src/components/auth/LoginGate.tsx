'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Lock, Mail, User, Phone, ArrowLeft, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Loader2, Sparkles, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginGateProps {
  onSuccess?: () => void;
}

export default function LoginGate({ onSuccess }: LoginGateProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Handle Login
  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const emailToUse = customEmail || loginEmail;
    const passToUse = customPass || loginPassword;

    if (!emailToUse || !passToUse) {
      setLoginError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: emailToUse.trim().toLowerCase(),
        password: passToUse,
      });

      if (res?.error) {
        setLoginError(
          res.error.includes('موافقة')
            ? 'حسابك مسجل لكنه قيد انتظار موافقة الإدارة'
            : 'بيانات الدخول غير صحيحة أو الحساب غير مفعل'
        );
      } else {
        toast.success('تم تسجيل الدخول بنجاح! أهلاً بك في سيما العقارية');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setLoginError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
    } finally {
      setLoginLoading(false);
    }
  };

  // Quick preset login helper
  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    handleLogin(undefined, email, pass);
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setRegError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('كلمة المرور يجب أن لا تقل عن 6 أحرف');
      return;
    }

    setRegLoading(true);
    setRegError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail.trim().toLowerCase(),
          phone: regPhone,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegSuccess(true);
        toast.success('تم إرسال طلبك بنجاح!');
      } else {
        setRegError(data.message || 'حدث خطأ أثناء إرسال طلب التسجيل');
      }
    } catch (err) {
      setRegError('فشل الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#09090B] overflow-y-auto p-4 sm:p-6" dir="rtl">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#F15A24]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Login Panel Card */}
      <div className="relative w-full max-w-lg bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 z-10 transition-all">
        {/* Clean Unboxed Logo & Branding Header */}
        <div className="text-center flex flex-col items-center mb-6">
          <div className="relative mb-3 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#F15A24]/30 to-amber-500/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
            <img
              src="/logo.png"
              alt="سيما العقارية"
              className="relative h-20 w-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">سـيـمـا العقارية</h1>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm">
            بوابة الدخول الموحدة لمنظومة التسويق العقاري والخريطة الذكية
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-[11px] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>يتطلب الدخول حساباً معتمداً من إدارة المنصة</span>
          </div>
        </div>

        {/* Tab Switcher: Login / Register */}
        <div className="flex p-1 bg-zinc-950/80 rounded-2xl border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#F15A24] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRegError(null);
              setRegSuccess(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#F15A24] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            طلب حساب جديد
          </button>
        </div>

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <div>
            {loginError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    className="w-full ps-10 pe-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full ps-10 pe-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التحقق والدخول...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول والدخول إلى المنصة</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Accounts for Fast Evaluation */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 mb-2.5">
                <KeyRound className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>حسابات تجريبية سريعة للدخول المباشر:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@aqar-crm.com', 'admin123')}
                  className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#F15A24]/50 text-right transition-all group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-[#F15A24]">👑 مدير النظام</div>
                  <div className="text-[9px] text-zinc-500 font-mono">admin@aqar-crm.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('sales@aqar-crm.com', 'admin123')}
                  className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#F15A24]/50 text-right transition-all group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-[#F15A24]">💼 مدير مبيعات</div>
                  <div className="text-[9px] text-zinc-500 font-mono">sales@aqar-crm.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('property@aqar-crm.com', 'admin123')}
                  className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#F15A24]/50 text-right transition-all group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-[#F15A24]">🏢 مسؤول عقارات</div>
                  <div className="text-[9px] text-zinc-500 font-mono">property@aqar-crm.com</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE: REGISTER (PENDING ADMIN APPROVAL) */}
        {mode === 'register' && (
          <div>
            {regSuccess ? (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">تم استلام طلبك بنجاح!</h3>
                <p className="text-xs text-zinc-400 mb-5 leading-relaxed max-w-sm mx-auto">
                  حسابك الآن في قائمة انتظار الموافقة. سيقوم مدير النظام بتفعيل حسابك قريباً لتتمكن من الدخول واستعراض العقارات والخريطة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setRegSuccess(false);
                  }}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  العودة لنافذة تسجيل الدخول
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                {regError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">الاسم الكامل</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="مثال: محمد عبدالله"
                      required
                      className="w-full ps-10 pe-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@example.com"
                      required
                      className="w-full ps-10 pe-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم الجوال</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      required
                      className="w-full ps-10 pe-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">كلمة المرور</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full ps-10 pe-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                  <span>ملاحظة: التسجيل يخضع للمراجعة والاعتماد من إدارة شركة سيما العقارية قبل التفعيل.</span>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {regLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <span>إرسال طلب التسجيل للاعتماد</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
