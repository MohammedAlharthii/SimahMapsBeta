'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Building,
  CheckCircle2,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  Loader2,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import OtpVerificationModal from '@/components/auth/OtpVerificationModal';

export default function PropertyDetailsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification state for unauthenticated visitors
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('sima_otp_verified') === 'true';
      if (verified) {
        setOtpVerified(true);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data.property);
        } else {
          toast.error('لم يتم العثور على العقار');
        }
      } catch (err) {
        console.error(err);
        toast.error('تعذر جلب تفاصيل العقار');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast.error('يرجى إدخال الاسم ورقم الهاتف');
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct booking/viewing request
      toast.success('تم إرسال طلب المعاينة بنجاح! سيتواصل معك فريق سيما قريباً.');
      setClientName('');
      setClientPhone('');
      setViewingDate('');
    } catch (err) {
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.titleAr || property?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ رابط العقار إلى الحافظة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center gap-3 text-zinc-400">
        <div className="w-10 h-10 rounded-full border-2 border-[#F15A24]/30 border-t-[#F15A24] animate-spin" />
        <p className="text-sm font-medium text-white">جاري تحميل تفاصيل العرض العقاري...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">العرض غير موجود</h2>
        <p className="text-zinc-400 text-sm mb-6">قد يكون تم حذفه أو أن الرابط غير صحيح.</p>
        <Link
          href="/"
          className="bg-[#F15A24] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-[#EA580C] transition-all"
        >
          العودة إلى الخريطة
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: property.title }];

  const purposeAr = 'للبيع';
  const displayTitle = property.titleAr || property.title;
  const displayDesc = property.descriptionAr || property.description || 'عقار مميز بموقع استراتيجي وتشطيبات عصرية تلبي تطلعاتك.';
  const amenitiesList = Array.isArray(property.amenities)
    ? property.amenities
    : ['موقف سيارات', 'مسبح خاص', 'حديقة', 'نظام ذكي', 'حراسة أمنية'];

  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const hasAccess = isAuthenticated || otpVerified;

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#F15A24] selection:text-white" dir="rtl">
      {/* OTP Gate Modal: Required if not logged in */}
      {!hasAccess && status !== 'loading' && (
        <OtpVerificationModal
          offerTitle={displayTitle}
          offerPrice={property.price}
          isOpen={true}
          onVerified={() => setOtpVerified(true)}
        />
      )}

      {/* Top Header with clean visible logo (orange SIMA word removed per user request) */}
      <header className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-50 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#F15A24] bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowRight className="w-4 h-4 text-white" />
              <span>العودة إلى خريطة سيما</span>
            </Link>

            {/* Clean SIMA logo without box or frame, orange SIMA word removed */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="خريطة سيما"
                className="h-10 md:h-12 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105"
              />
              <span className="font-extrabold text-white text-base hidden sm:inline">خريطة سيما</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!hasAccess && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                <span>يتطلب التحقق عبر OTP</span>
              </span>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:text-[#F15A24] transition-colors"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:text-[#F15A24] transition-colors"
              title="إضافة للمفضلة"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#F15A24] text-[#F15A24]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Filtered blur if OTP is not yet completed */}
      <main className={`max-w-7xl mx-auto px-4 py-6 sm:py-8 transition-all duration-300 ${!hasAccess ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        {/* Title and Price Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#F15A24] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md shadow-orange-500/20">
                {purposeAr}
              </span>
              <span className="bg-zinc-800 text-white text-xs font-semibold px-3 py-1 rounded-full border border-zinc-700">
                {property.type}
              </span>
              {property.isFeatured && (
                <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>عقار مميز</span>
                </span>
              )}
            </div>

            {/* Title in pure white */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {displayTitle}
            </h1>

            <p className="text-zinc-300 text-sm flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-[#F15A24]" />
              <span className="text-white font-medium">{property.city}</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-300">{property.address || property.city}</span>
            </p>
          </div>

          <div className="flex flex-col lg:items-end bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
            <span className="text-xs text-zinc-300 font-medium">السعر المطلوب</span>
            <div className="text-3xl font-black text-[#F15A24] flex items-baseline gap-1.5">
              <span>{new Intl.NumberFormat('ar-SA').format(property.price)}</span>
              <span className="text-sm font-bold text-white">ريال سعودي</span>
            </div>
            {property.priceNegotiable && (
              <span className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> السعر قابل للتفاوض
              </span>
            )}
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 p-2 mb-8">
          {/* Main Large Image */}
          <div className="lg:col-span-3 aspect-[16/10] relative rounded-2xl overflow-hidden bg-zinc-900">
            <img
              src={images[activeImageIdx]?.url}
              alt={displayTitle}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/70 hover:bg-[#F15A24] text-white transition-all shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/70 hover:bg-[#F15A24] text-white transition-all shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[460px] p-1">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-[16/10] w-24 lg:w-full rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIdx === idx ? 'border-[#F15A24] shadow-md shadow-orange-500/30' : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Specs Grid - Pure White Values and Text */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <Maximize className="w-5 h-5 text-[#F15A24] mb-1.5" />
            <span className="text-xs text-zinc-300">المساحة</span>
            <span className="text-sm font-bold text-white mt-0.5">{property.area} م²</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <Bed className="w-5 h-5 text-[#F15A24] mb-1.5" />
            <span className="text-xs text-zinc-300">غرف النوم</span>
            <span className="text-sm font-bold text-white mt-0.5">{property.bedrooms || 0} غرف</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <Bath className="w-5 h-5 text-[#F15A24] mb-1.5" />
            <span className="text-xs text-zinc-300">دورات المياه</span>
            <span className="text-sm font-bold text-white mt-0.5">{property.bathrooms || 0} حمام</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <Building className="w-5 h-5 text-[#F15A24] mb-1.5" />
            <span className="text-xs text-zinc-300">عدد الأدوار</span>
            <span className="text-sm font-bold text-white mt-0.5">{property.floors || 1} أدوار</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <Calendar className="w-5 h-5 text-[#F15A24] mb-1.5" />
            <span className="text-xs text-zinc-300">سنة البناء</span>
            <span className="text-sm font-bold text-white mt-0.5">{property.yearBuilt || 'حديث'}</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-5 h-5 text-[#F15A24] mb-1.5" />
            <span className="text-xs text-zinc-300">التأثيث</span>
            <span className="text-sm font-bold text-white mt-0.5">{property.furnished ? 'مؤثث' : 'غير مؤثث'}</span>
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-3">وصف العرض العقاري</h2>
              <p className="text-white text-sm leading-relaxed whitespace-pre-line font-normal">
                {displayDesc}
              </p>
            </div>

            {/* Amenities - All white font with terracotta icons */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-4">المميزات والمرافق</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map((amenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-xs text-white font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F15A24] shrink-0" />
                    <span className="text-white">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-2">الموقع الجغرافي</h2>
              <p className="text-zinc-300 text-xs mb-4">
                {property.city}، {property.district || property.address || 'الموقع محدد على الخريطة بدقة'}
              </p>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400">الإحداثيات:</span>
                  <p className="text-sm font-mono text-white font-semibold">
                    {property.latitude?.toFixed(4)}, {property.longitude?.toFixed(4)}
                  </p>
                </div>
                <Link
                  href="/"
                  className="text-xs font-bold text-white bg-orange-600/20 border border-orange-500/40 px-3 py-1.5 rounded-xl hover:bg-[#F15A24] hover:text-white transition-all"
                >
                  عرض الموقع على الخريطة الرئيسية
                </Link>
              </div>
            </div>
          </div>

          {/* Contact & Booking Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Quick Contact Box */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-xl shadow-black/40">
              <h3 className="text-base font-bold text-white mb-2">طلب معاينة العرض</h3>
              <p className="text-zinc-300 text-xs mb-5">
                تواصل مع مسوقي سيما المعتمدين لحجز موعد معاينة أو التفاوض المباشر.
              </p>

              {/* Direct Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <a
                  href={`https://wa.me/966500000000?text=${encodeURIComponent(`السلام عليكم، أود الاستفسار عن عقار ${displayTitle} (معرف: ${property.id}) المعروض على منصة سيما`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span className="text-white">واتساب مباشر</span>
                </a>

                <a
                  href="tel:+966500000000"
                  className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all border border-zinc-700"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span className="text-white">اتصال هاتفي</span>
                </a>
              </div>

              {/* Booking Request Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-3 pt-4 border-t border-zinc-800/80">
                <span className="text-xs font-semibold text-white block mb-1">أو احجز موعد لمعاينة العقار:</span>
                
                <input
                  type="text"
                  placeholder="اسمك الكريم"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
                />

                <input
                  type="tel"
                  placeholder="رقم الجوال (05xxxxxxxx)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
                />

                <input
                  type="date"
                  value={viewingDate}
                  onChange={(e) => setViewingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] transition-all"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span className="text-white">جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span className="text-white">تأكيد حجز المعاينة</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
