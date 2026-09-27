"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Handshake,
  Phone,
  Megaphone,
  Receipt,
  BarChart3,
  UserCog,
  Settings,
  Menu,
  ChevronRight,
  MapPin,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { name: "خريطة سيما", href: "/", icon: MapPin },
  { name: "مشاهدات الإعلانات (OTP)", href: "/dashboard/ad-views", icon: Eye },
  { name: "العقارات", href: "/dashboard/properties", icon: Building2 },
  { name: "العملاء", href: "/dashboard/clients", icon: Users },
  { name: "الصفقات", href: "/dashboard/deals", icon: Handshake },
  { name: "المتابعات", href: "/dashboard/followups", icon: Phone },
  { name: "المسوقين", href: "/dashboard/marketers", icon: Megaphone },
  { name: "الحملات", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "العمولات", href: "/dashboard/commissions", icon: Receipt },
  { name: "التقارير", href: "/dashboard/reports", icon: BarChart3 },
  { name: "المستخدمين", href: "/dashboard/users", icon: UserCog },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-zinc-950 border-l border-zinc-800/80 transition-all duration-300 flex flex-col h-full text-zinc-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header with clean unboxed logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80 shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="/logo.png"
              alt="خريطة سيما"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base leading-tight">خريطة سيما</span>
              <span className="text-[10px] text-zinc-400 font-medium">نظام التشغيل العقاري</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white mr-auto transition-colors"
          title={collapsed ? "توسيع القائمة" : "تصغير القائمة"}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-[#F15A24]/15 text-[#F15A24] font-bold shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-[#F15A24]" : "text-zinc-500 group-hover:text-zinc-300"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
