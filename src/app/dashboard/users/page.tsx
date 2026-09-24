"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, UserPlus, Shield, User, Check, X, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("تعذر تحميل قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    try {
      setApprovingId(id);
      const res = await fetch(`/api/users/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success(`تم تفعيل حساب ${name} بنجاح! يمكنه الآن تسجيل الدخول للمنصة.`);
        fetchUsers();
      } else {
        toast.error("فشل تفعيل الحساب");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setApprovingId(null);
    }
  };

  const tabs = [
    { id: "all", label: "جميع المستخدمين" },
    { id: "pending", label: "بانتظار الموافقة" },
    { id: "active", label: "المفعلين" },
  ];

  const filteredUsers = users.filter((u) => {
    if (activeTab === "pending" && u.isActive) return false;
    if (activeTab === "active" && !u.isActive) return false;

    if (roleFilter && u.role !== roleFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (u.name || "").toLowerCase().includes(q);
      const matchEmail = (u.email || "").toLowerCase().includes(q);
      const matchPhone = (u.phone || "").toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">إدارة المستخدمين والصلاحيات</h1>
          <p className="text-sm text-zinc-400">اعتماد وتفعيل حسابات المستخدمين وإدارة صلاحيات النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-300">
            إجمالي المسجلين: <strong className="text-white">{users.length}</strong>
          </span>
          <span className="text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300">
            بانتظار الموافقة: <strong className="text-amber-400">{users.filter((u) => !u.isActive).length}</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-[#F15A24] text-[#F15A24]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === "pending" && users.filter((u) => !u.isActive).length > 0 && (
              <span className="bg-[#F15A24] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {users.filter((u) => !u.isActive).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد الإلكتروني أو الجوال..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#F15A24]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-zinc-800 rounded-xl px-4 py-2.5 text-xs bg-zinc-900/80 text-white w-full md:w-52 focus:outline-none focus:border-[#F15A24]"
        >
          <option value="">جميع الأدوار والصلاحيات</option>
          <option value="SYSTEM_ADMIN">مدير نظام (System Admin)</option>
          <option value="GENERAL_MANAGER">مدير عام</option>
          <option value="SALES_MANAGER">مدير مبيعات</option>
          <option value="PROPERTY_MANAGER">مسؤول عقارات</option>
          <option value="CUSTOMER_SERVICE">خدمة عملاء</option>
          <option value="INTERNAL_MARKETER">مسوق داخلي</option>
          <option value="EXTERNAL_MARKETER">مسوق خارجي</option>
          <option value="CLIENT">مستخدم / عميل</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#F15A24]" />
            <span className="text-xs">جاري تحميل بيانات المستخدمين...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            <p className="text-sm">لا توجد حسابات مطابقة للبحث أو التصنيف الحالي.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-zinc-950/70 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5 font-bold">المستخدم</th>
                  <th className="px-6 py-3.5 font-bold">الدور / الصلاحية</th>
                  <th className="px-6 py-3.5 font-bold">حالة الحساب</th>
                  <th className="px-6 py-3.5 font-bold">تاريخ الانضمام</th>
                  <th className="px-6 py-3.5 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F15A24]/10 border border-[#F15A24]/30 flex items-center justify-center text-[#F15A24] font-bold">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{user.name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">{user.email}</div>
                          {user.phone && <div className="text-[10px] text-zinc-500 font-mono">{user.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-200">
                        <Shield className="w-3 h-3 text-[#F15A24]" />
                        <span className="font-semibold">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>مفعل ومعتمد</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
                          <span>بانتظار موافقة الإدارة</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-[11px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-SA") : "-"}
                    </td>
                    <td className="px-6 py-4 text-left">
                      {!user.isActive ? (
                        <button
                          onClick={() => handleApprove(user.id, user.name)}
                          disabled={approvingId === user.id}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          {approvingId === user.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>اعتماد وتفعيل</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-500">الحساب نشط</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
