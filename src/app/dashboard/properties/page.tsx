"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Grid,
  Table2,
  Trash2,
  ExternalLink,
  MapPin,
  Building2,
  Sparkles,
  Bed,
  Bath,
  Maximize,
  Filter,
  Loader2,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface PropertyItem {
  id: string;
  title: string;
  titleAr?: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  type: string;
  status: string;
  purpose: string;
  city: string;
  address?: string;
  district?: string;
  images?: { url: string; alt?: string }[];
  isFeatured?: boolean;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [purposeFilter, setPurposeFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/properties?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (err) {
      console.error("Failed to load properties:", err);
      toast.error("تعذر جلب قائمة العروض");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف "${title}"؟`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("تم حذف العرض بنجاح");
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("فشل حذف العرض العقاري");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = properties.filter((p) => {
    const isPartner = p.purpose === "INVESTMENT" || p.purpose === "PARTNER";
    if (purposeFilter === "SIMA" && isPartner) return false;
    if (purposeFilter === "PARTNER" && !isPartner) return false;

    if (typeFilter !== "ALL" && p.type.toUpperCase() !== typeFilter.toUpperCase()) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.titleAr || p.title || "").toLowerCase().includes(q);
      const matchCity = (p.city || "").toLowerCase().includes(q);
      const matchAddress = (p.address || p.district || "").toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchAddress) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">إدارة العروض العقارية</h1>
          <p className="text-xs text-zinc-400">استعراض، إضافة، وتحديث جميع الصكوك والعروض على خريطة سيما</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProperties}
            disabled={loading}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg text-xs transition ${
                view === "grid" ? "bg-[#F15A24] text-white" : "text-zinc-400 hover:text-white"
              }`}
              title="عرض كبطاقات"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded-lg text-xs transition ${
                view === "table" ? "bg-[#F15A24] text-white" : "text-zinc-400 hover:text-white"
              }`}
              title="عرض كجدول"
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عقار جديد</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-grow w-full md:max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="بحث بالعنوان، المدينة، أو الحي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F15A24]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#F15A24]"
          >
            <option value="ALL">جميع التصنيفات</option>
            <option value="SIMA">عروض سيما</option>
            <option value="PARTNER">عروض شركاء سيما</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#F15A24]"
          >
            <option value="ALL">جميع الأنواع</option>
            <option value="VILLA">فلل</option>
            <option value="BUILDING">عمائر</option>
            <option value="OFFICE">مكاتب</option>
            <option value="SHOP">محلات</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#F15A24]" />
          <span className="text-xs">جاري تحميل قائمة العروض العقارية...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
          <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">لا توجد عروض عقارية مطابقة</h3>
          <p className="text-xs text-zinc-400 mb-4">يمكنك إضافة عرض جديد أو تعديل معايير البحث.</p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F15A24] text-white text-xs font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عقار الآن</span>
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((property) => {
            const isPartner = property.purpose === "INVESTMENT" || property.purpose === "PARTNER";
            const img = property.images?.[0]?.url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";
            const title = property.titleAr || property.title;

            return (
              <div
                key={property.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition flex flex-col group shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-md ${
                        isPartner ? "bg-amber-600" : "bg-[#F15A24]"
                      }`}
                    >
                      {isPartner ? "عروض شركاء سيما" : "عروض سيما"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-zinc-800 text-white font-mono font-bold text-sm">
                    {new Intl.NumberFormat("ar-SA").format(property.price)} <small className="text-zinc-400">ر.س</small>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">{title}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                      <span className="truncate">{property.city} - {property.district || property.address || property.city}</span>
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-300">
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3 h-3 text-[#F15A24]" /> {property.area} م²
                    </span>
                    {property.bedrooms ? (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-[#F15A24]" /> {property.bedrooms} غرف
                      </span>
                    ) : null}
                    {property.bathrooms ? (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3 text-[#F15A24]" /> {property.bathrooms} حمام
                      </span>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <Link
                      href={`/properties/${property.id}`}
                      target="_blank"
                      className="text-xs font-semibold text-zinc-300 hover:text-[#F15A24] flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>معاينة العرض</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(property.id, title)}
                      disabled={deletingId === property.id}
                      className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                      title="حذف العرض"
                    >
                      {deletingId === property.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">العقار</th>
                  <th className="py-3 px-4">التصنيف</th>
                  <th className="py-3 px-4">السعر</th>
                  <th className="py-3 px-4">المدينة / الحي</th>
                  <th className="py-3 px-4">المساحة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((property) => {
                  const isPartner = property.purpose === "INVESTMENT" || property.purpose === "PARTNER";
                  const title = property.titleAr || property.title;
                  return (
                    <tr key={property.id} className="hover:bg-zinc-800/50 transition">
                      <td className="py-3 px-4 font-semibold text-white">
                        <Link href={`/properties/${property.id}`} target="_blank" className="hover:text-[#F15A24] transition">
                          {title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPartner ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-orange-500/10 text-[#F15A24] border border-orange-500/20"
                          }`}
                        >
                          {isPartner ? "عروض شركاء سيما" : "عروض سيما"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {new Intl.NumberFormat("ar-SA").format(property.price)} ر.س
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {property.city} - {property.district || property.address || ""}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-300">
                        {property.area} م²
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/properties/${property.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                            title="معاينة"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id, title)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
