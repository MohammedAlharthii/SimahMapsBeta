"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Loader2,
  DollarSign,
  Maximize,
  Bed,
  Bath,
  Image as ImageIcon,
  CheckCircle2,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  الرياض: { lat: 24.7136, lng: 46.6753 },
  جدة: { lat: 21.5433, lng: 39.1728 },
  الدمام: { lat: 26.4207, lng: 50.0888 },
  "مكة المكرمة": { lat: 21.3891, lng: 39.8579 },
  "المدينة المنورة": { lat: 24.5247, lng: 39.5692 },
  الخبر: { lat: 26.2172, lng: 50.1971 },
};

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState<"VILLA" | "BUILDING" | "OFFICE" | "SHOP">("VILLA");
  const [purpose, setPurpose] = useState<"SALE" | "INVESTMENT">("SALE"); // SALE = عروض سيما, INVESTMENT = عروض شركاء سيما
  const [price, setPrice] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [floors, setFloors] = useState<number | "">("");
  const [city, setCity] = useState("الرياض");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800");
  const [descriptionAr, setDescriptionAr] = useState("");

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleAr || !price || !area) {
      toast.error("يرجى ملء جميع الحقول الإلزامية (عنوان العقار، السعر، والمساحة)");
      return;
    }

    setLoading(true);

    try {
      const coords = cityCoordinates[city] || { lat: 24.7136, lng: 46.6753 };
      // Add slight jitter so multiple properties don't stack on exact same spot
      const lat = coords.lat + (Math.random() - 0.5) * 0.05;
      const lng = coords.lng + (Math.random() - 0.5) * 0.05;

      const payload = {
        title: titleEn.trim() || titleAr.trim(),
        titleAr: titleAr.trim(),
        description: descriptionAr.trim(),
        descriptionAr: descriptionAr.trim(),
        type,
        status: "AVAILABLE",
        purpose, // SALE = عروض سيما, INVESTMENT = عروض شركاء سيما
        price: Number(price),
        area: Number(area),
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        floors: floors ? Number(floors) : 1,
        city,
        district: district.trim() || undefined,
        address: address.trim() || `${city} - ${district}`,
        latitude: lat,
        longitude: lng,
        images: imageUrl ? [{ url: imageUrl.trim(), alt: titleAr }] : [],
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("تم نشر العرض العقاري بنجاح وإضافته للخريطة!");
        router.push("/dashboard/properties");
        router.refresh();
      } else {
        toast.error(data.error || "حدث خطأ أثناء حفظ العقار");
      }
    } catch (err) {
      console.error(err);
      toast.error("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/properties"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لإدارة العروض</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">إضافة عرض عقاري جديد</h1>
          <p className="text-xs text-zinc-400">أدخل تفاصيل العرض لنشره مباشرة على خريطة سيما ولوحة التحكم</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-sm font-bold text-white">
            <Building2 className="w-4 h-4 text-[#F15A24]" />
            <span>البيانات الأساسية والتصنيف</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                عنوان العرض بالعربي <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: فيلا مودرن فاخرة بحي النرجس"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                العنوان بالإنجليزي (اختياري)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Modern Luxury Villa in Al Narjis"
                dir="ltr"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24]"
              />
            </div>
          </div>

          {/* Classification & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                تصنيف العرض <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPurpose("SALE")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    purpose === "SALE"
                      ? "bg-[#F15A24] border-[#F15A24] text-white shadow-md shadow-orange-500/20"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عروض سيما</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPurpose("INVESTMENT")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    purpose === "INVESTMENT"
                      ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>عروض شركاء سيما</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نوع العقار</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#F15A24]"
              >
                <option value="VILLA">فيلا سكنية</option>
                <option value="BUILDING">عمارة تجارية / سكنية</option>
                <option value="OFFICE">مقر مكتبي</option>
                <option value="SHOP">محل / معرض تجاري</option>
              </select>
            </div>
          </div>
        </div>

        {/* Price & Specs Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-sm font-bold text-white">
            <DollarSign className="w-4 h-4 text-[#F15A24]" />
            <span>السعر والمواصفات الفنية</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                السعر (ريال سعودي) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="2500000"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                المساحة (م²) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
                placeholder="450"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">غرف النوم</label>
              <input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : "")}
                placeholder="5"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">دورات المياه</label>
              <input
                type="number"
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : "")}
                placeholder="4"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Location & Media Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-sm font-bold text-white">
            <MapPin className="w-4 h-4 text-[#F15A24]" />
            <span>الموقع الجغرافي والصور</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">المدينة</label>
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#F15A24]"
              >
                {Object.keys(cityCoordinates).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">الحي</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="حي العليا"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">العنوان بالتفصيل</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="شارع التحلية، بجوار المركز"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">رابط صورة العقار الرئيسية</label>
            <div className="relative">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                dir="ltr"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">وصف العقار والمميزات</label>
            <textarea
              rows={3}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="عقار فاخر بتشطيبات عصرية بموقع حيوي واستراتيجي..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#F15A24]"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/properties"
            className="px-5 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            إلغاء
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ والنشر...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>نشر العرض على الخريطة الآن</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
