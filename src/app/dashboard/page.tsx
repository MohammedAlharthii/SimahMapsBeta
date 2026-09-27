"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Eye,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  RefreshCw,
  Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [simaOffersCount, setSimaOffersCount] = useState(0);
  const [partnerOffersCount, setPartnerOffersCount] = useState(0);
  
  const [viewsCount, setViewsCount] = useState(0);
  const [recentViews, setRecentViews] = useState<any[]>([]);

  const [usersCount, setUsersCount] = useState(0);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch properties
      try {
        const propRes = await fetch("/api/properties?limit=100");
        if (propRes.ok) {
          const propData = await propRes.json();
          const props = propData.properties || [];
          setPropertiesCount(props.length);
          const sima = props.filter((p: any) => p.purpose !== "INVESTMENT" && p.purpose !== "PARTNER").length;
          const partner = props.filter((p: any) => p.purpose === "INVESTMENT" || p.purpose === "PARTNER").length;
          setSimaOffersCount(sima);
          setPartnerOffersCount(partner);
        }
      } catch (e) {
        console.warn("Properties fetch error", e);
      }

      // 2. Fetch Ad Views Log
      try {
        const viewsRes = await fetch("/api/properties/view-log");
        if (viewsRes.ok) {
          const viewsData = await viewsRes.json();
          setViewsCount(viewsData.total || 0);
          setRecentViews(viewsData.logs?.slice(0, 5) || []);
        }
      } catch (e) {
        console.warn("View log fetch error", e);
      }

      // 3. Fetch Users
      try {
        const usersRes = await fetch("/api/users");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const allUsers = usersData.users || [];
          setUsersCount(allUsers.length);
          setPendingUsers(allUsers.filter((u: any) => !u.isActive).slice(0, 5));
        }
      } catch (e) {
        console.warn("Users fetch error", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveUser = async (id: string, name: string) => {
    try {
      setApprovingId(id);
      const res = await fetch(`/api/users/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success(`تم تفعيل حساب ${name} بنجاح!`);
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error("فشل تفعيل الحساب");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">نظرة عامة على المنظومة</h1>
          <p className="text-xs text-zinc-400">متابعة حية للعروض العقارية، مشاهدات الإعلانات، والمستخدمين</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عقار جديد</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#F15A24]/60 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>خريطة سيما</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <Link
          href="/dashboard/properties"
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-5 rounded-3xl transition shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#F15A24] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-500 group-hover:text-white transition">إدارة العروض ←</span>
          </div>
          <p className="text-xs text-zinc-400">إجمالي العقارات المعروضة</p>
          <h3 className="text-2xl font-black text-white font-mono mt-1">{propertiesCount}</h3>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800/80 text-[10px]">
            <span className="text-orange-400 font-medium">✨ {simaOffersCount} عروض سيما</span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400 font-medium">🏢 {partnerOffersCount} عروض شركاء</span>
          </div>
        </Link>

        {/* Total Verified Ad Views */}
        <Link
          href="/dashboard/ad-views"
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-5 rounded-3xl transition shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-500 group-hover:text-white transition">سجل المشاهدات ←</span>
          </div>
          <p className="text-xs text-zinc-400">مشاهدات الإعلانات الموثقة (OTP)</p>
          <h3 className="text-2xl font-black text-white font-mono mt-1">{viewsCount}</h3>
          <p className="text-[10px] text-emerald-400 mt-3 pt-3 border-t border-zinc-800/80">
            عملاء موثقون شاهدوا تفاصيل العقارات
          </p>
        </Link>

        {/* Registered Users */}
        <Link
          href="/dashboard/users"
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-5 rounded-3xl transition shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-500 group-hover:text-white transition">إدارة الصلاحيات ←</span>
          </div>
          <p className="text-xs text-zinc-400">إجمالي مستخدمي النظام</p>
          <h3 className="text-2xl font-black text-white font-mono mt-1">{usersCount}</h3>
          <p className="text-[10px] text-blue-400 mt-3 pt-3 border-t border-zinc-800/80">
            فريق العمل والمسوقين المعتمدين
          </p>
        </Link>

        {/* Pending Approvals */}
        <Link
          href="/dashboard/users"
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-5 rounded-3xl transition shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-500 group-hover:text-white transition">مراجعة ←</span>
          </div>
          <p className="text-xs text-zinc-400">طلبات الحسابات بانتظار الاعتماد</p>
          <h3 className="text-2xl font-black text-amber-400 font-mono mt-1">{pendingUsers.length}</h3>
          <p className="text-[10px] text-zinc-400 mt-3 pt-3 border-t border-zinc-800/80">
            يتطلب قرار اعتماد من مدير النظام
          </p>
        </Link>
      </div>

      {/* Two Column Section: Recent Ad Viewers & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ad Viewers (OTP) */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">أحدث المهتمين ومشاهدات الإعلانات</h2>
            </div>
            <Link href="/dashboard/ad-views" className="text-xs text-[#F15A24] font-semibold hover:underline">
              عرض السجل الكامل ({viewsCount})
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#F15A24]" />
              جاري التحميل...
            </div>
          ) : recentViews.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              لا توجد مشاهدات موثقة حتى الآن. ستظهر هنا فور قيام الزائر بإدخال OTP وفتح أي إعلان.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentViews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-xs">
                      {item.channel === "phone" ? <Phone className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">{item.contact}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">{item.propertyTitle}</div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-[10px] text-zinc-500">
                      {new Date(item.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {item.channel === "phone" && (
                      <a
                        href={`https://wa.me/${item.contact.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-400 hover:underline font-semibold"
                      >
                        واتساب مباشر
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending User Requests */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">طلبات الحسابات الجديدة</h2>
            </div>
            <Link href="/dashboard/users" className="text-xs text-[#F15A24] font-semibold hover:underline">
              إدارة الكل
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#F15A24]" />
              جاري التحميل...
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
              <span>لا توجد طلبات معلقة حالياً، جميع الحسابات مفعلة.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/30 transition"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{u.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                  </div>

                  <button
                    onClick={() => handleApproveUser(u.id, u.name)}
                    disabled={approvingId === u.id}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {approvingId === u.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>اعتماد الحساب</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
