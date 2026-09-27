"use client";

import { Bell, Search, Globe, Moon, Sun, LogOut, Settings, User, MapPin } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function getRoleArabic(role?: string) {
  switch (role) {
    case 'SYSTEM_ADMIN': return 'مدير النظام';
    case 'GENERAL_MANAGER': return 'مدير عام';
    case 'SALES_MANAGER': return 'مدير مبيعات';
    case 'PROPERTY_MANAGER': return 'مسؤول عقارات';
    case 'CUSTOMER_SERVICE': return 'خدمة عملاء';
    case 'INTERNAL_MARKETER': return 'مسوق عقاري';
    case 'EXTERNAL_MARKETER': return 'مسوق خارجي';
    case 'CONTRACTS_OFFICER': return 'مسؤول عقود';
    case 'ACCOUNTANT': return 'محاسب';
    default: return 'عضو معتمد';
  }
}

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const userName = session?.user?.name || "مدير النظام";
  const userEmail = session?.user?.email || "admin@aqar-crm.com";
  const userRole = (session?.user as any)?.role || "SYSTEM_ADMIN";
  const initial = userName.trim() ? userName.trim().charAt(0).toUpperCase() : "م";

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث عن عقار، عميل، أو رقم..."
            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 pr-10 pl-4 text-sm focus:bg-white focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#F15A24] hover:bg-orange-500/20 text-xs font-semibold transition"
          title="الخريطة الرئيسية"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">خريطة سيما</span>
        </Link>
        
        <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F15A24] to-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {initial}
            </div>
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{userName}</span>
              <span className="text-[10px] text-[#F15A24] font-medium">{getRoleArabic(userRole)}</span>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{userName}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{userEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-[#F15A24]">
                  {getRoleArabic(userRole)}
                </span>
              </div>
              <Link href="/" className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-right">
                <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
                العودة إلى خريطة سيما
              </Link>
              <Link href="/dashboard/properties" className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-right">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                إدارة العروض
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 text-right border-t border-slate-100 dark:border-slate-700 mt-1 pt-2">
                <LogOut className="w-3.5 h-3.5" />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
