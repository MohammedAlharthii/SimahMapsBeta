'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, KeyRound, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OtpVerificationModalProps {
  offerTitle?: string;
  offerPrice?: number;
  isOpen: boolean;
  onVerified: (contact: { type: 'phone' | 'email'; value: string }) => void;
  onClose?: () => void;
}

export default function OtpVerificationModal({
  offerTitle,
  offerPrice,
  isOpen,
  onVerified,
  onClose,
}: OtpVerificationModalProps) {
  const [channel, setChannel] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetValue = channel === 'phone' ? phone.trim() : email.trim();
    if (!targetValue) {
      setError(channel === 'phone' ? 'يرجى إدخال رقم الجوال' : 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (channel === 'phone' && !/^05\d{8}$/.test(targetValue.replace(/\D/g, ''))) {
      setError('يرجى إدخال رقم جوال سعودي صالح يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }

    if (channel === 'email' && !targetValue.includes('@')) {
      setError('يرجى إدخال عنوان بريد إلكتروني صالح');
      return;
    }

    setLoading(true);

    try {
      // Generate a 4-digit random OTP
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);

      // In real-world, calls SMS gateway or email service.
      // We simulate realistic delivery and show the code prominently
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success(
        channel === 'phone'
          ? `تم إرسال رمز التحقق إلى ${targetValue} عبر الرسائل القصيرة!`
          : `تم إرسال رمز التحقق إلى ${targetValue}!`,
        { duration: 6000 }
      );

      setStep('verify');
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError('تعذر إرسال رمز التحقق، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const enteredCode = otpCode.join('');

    if (enteredCode.length < 4) {
      setError('يرجى إدخال رمز التحقق المكون من 4 أرقام');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Check against generated code (or master demo code '1234')
      if (enteredCode === generatedCode || enteredCode === '1234') {
        toast.success('تم تأكيد هويتك بنجاح! جاري عرض تفاصيل العقار...');
        const contactInfo = {
          type: channel,
          value: channel === 'phone' ? phone : email,
        };

        // Store verification in sessionStorage so client isn't prompted repeatedly
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('sima_otp_verified', 'true');
          sessionStorage.setItem('sima_otp_user', JSON.stringify(contactInfo));
        }

        onVerified(contactInfo);
      } else {
        setError('رمز التحقق غير صحيح، يرجى التأكد وإعادة المحاولة');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = cleanVal;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (cleanVal && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto" dir="rtl">
      {/* Ambience glow */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#F15A24]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black text-zinc-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button if applicable */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Clean Logo Header */}
        <div className="text-center flex flex-col items-center mb-5">
          <img
            src="/logo.png"
            alt="سيما العقارية"
            className="h-16 w-auto object-contain mb-3 drop-shadow-xl"
          />

          <h2 className="text-xl font-black text-white tracking-tight">
            التحقق السريع لعرض تفاصيل العرض
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            {offerTitle ? (
              <span className="text-zinc-200 font-semibold">{offerTitle}</span>
            ) : (
              'أدخل وسيلة التواصل لاستلام رمز التحقق (OTP) وعرض تفاصيل العقار فوراً'
            )}
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-[11px] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>تحقق آمن لحماية بيانات العقار وخصوصية المالك</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE CHANNEL & ENTER PHONE/EMAIL */}
        {step === 'input' && (
          <div>
            {/* Channel Tabs */}
            <div className="flex p-1 bg-zinc-950 rounded-2xl border border-zinc-800 mb-4">
              <button
                type="button"
                onClick={() => {
                  setChannel('phone');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  channel === 'phone'
                    ? 'bg-gradient-to-r from-[#F15A24] to-[#EA580C] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>عبر رقم الجوال</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannel('email');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  channel === 'email'
                    ? 'bg-gradient-to-r from-[#F15A24] to-[#EA580C] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>عبر البريد الإلكتروني</span>
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {channel === 'phone' ? (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    رقم الجوال لتلقي رمز التحقق (SMS)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      required
                      dir="ltr"
                      className="w-full ps-10 pe-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] text-right font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">مثال: 0501234567</span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    البريد الإلكتروني لتلقي رمز التحقق
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      dir="ltr"
                      className="w-full ps-10 pe-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] text-right font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري إرسال الرمز...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال رمز التحقق (OTP)</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: ENTER OTP CODE */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Live Simulated OTP Banner for Easy Testing */}
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center">
              <span className="text-[11px] text-zinc-400 block mb-0.5">
                تم إرسال رمز التحقق إلى <strong className="text-white font-mono">{channel === 'phone' ? phone : email}</strong>
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-orange-500/40 rounded-xl text-xs text-[#F15A24] font-bold mt-1">
                <span>رمز التحقق المباشر:</span>
                <span className="font-mono text-sm tracking-widest text-white">{generatedCode || '1234'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 text-center mb-2">
                أدخل رمز التحقق المكون من 4 أرقام:
              </label>

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3" dir="ltr">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 bg-zinc-950 border-2 border-zinc-800 focus:border-[#F15A24] rounded-2xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#F15A24]/20 transition-all font-mono"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الرمز وعرض تفاصيل العرض</span>
                </>
              )}
            </button>

            {/* Resend / Change contact options */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setOtpCode(['', '', '', '']);
                }}
                className="hover:text-white underline text-[11px]"
              >
                تغيير {channel === 'phone' ? 'رقم الجوال' : 'البريد'}
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!canResend || loading}
                className={`flex items-center gap-1 text-[11px] ${
                  canResend ? 'text-[#F15A24] hover:underline font-bold' : 'text-zinc-500 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{canResend ? 'إعادة إرسال الرمز' : `إعادة الإرسال بعد (${countdown}ث)`}</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Member Login Alternative */}
        <div className="mt-5 text-center text-xs text-zinc-400 border-t border-zinc-800/80 pt-3.5">
          لديك حساب موظف أو مسوق معتمد؟{" "}
          <a href="/auth/login" className="text-[#F15A24] font-bold hover:underline">
            تسجيل الدخول بكلمة المرور
          </a>
        </div>
      </div>
    </div>
  );
}
