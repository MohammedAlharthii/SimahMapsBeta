"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  User,
  Calendar,
  MessageCircle,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Building,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import toast from "react-hot-toast";

interface ClientItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  budget?: number | null;
  status: string;
  preferredCity?: string | null;
  notes?: string | null;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Client Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBudget, setNewBudget] = useState<number | "">("");
  const [newCity, setNewCity] = useState("الرياض");
  const [newNotes, setNewNotes] = useState("");

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("تعذر تحميل قائمة العملاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      toast.error("يرجى إدخال اسم العميل ورقم الجوال");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          email: newEmail.trim() || undefined,
          budget: newBudget ? Number(newBudget) : undefined,
          preferredCity: newCity,
          notes: newNotes.trim() || undefined,
          status: "NEW",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("تمت إضافة العميل بنجاح!");
        setIsModalOpen(false);
        setNewName("");
        setNewPhone("");
        setNewEmail("");
        setNewBudget("");
        setNewNotes("");
        fetchClients();
      } else {
        toast.error(data.error || "فشل إضافة العميل");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف العميل "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف العميل بنجاح");
        setClients((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error("فشل حذف العميل");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال");
    }
  };

  const filtered = clients.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (c.name || "").toLowerCase().includes(q);
      const matchPhone = (c.phone || "").toLowerCase().includes(q);
      const matchEmail = (c.email || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">عميل جديد</span>;
      case "CONTACTED":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">تم التواصل</span>;
      case "QUALIFIED":
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">مؤهل للشراء</span>;
      case "CLOSED_WON":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">صفقة ناجحة</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">قيد المتابعة</span>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">إدارة العملاء</h1>
          <p className="text-xs text-zinc-400">سجل العملاء، الميزانيات المستهدفة، والتواصل المباشر</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchClients}
            disabled={loading}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#F15A24] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-grow w-full md:max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="بحث بالاسم، الجوال، أو البريد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F15A24]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#F15A24]"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="NEW">جديد</option>
            <option value="CONTACTED">تم التواصل</option>
            <option value="QUALIFIED">مؤهل</option>
            <option value="CLOSED_WON">صفقة ناجحة</option>
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#F15A24]" />
          <span className="text-xs">جاري تحميل قائمة العملاء...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
          <User className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">لا يوجد عملاء مسجلين</h3>
          <p className="text-xs text-zinc-400 mb-4">أضف عملاءك لمتابعة اهتماماتهم العقارية والتواصل المباشر.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F15A24] text-white text-xs font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عميل الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const cleanPhone = client.phone.replace(/\D/g, "");
            const waNumber = cleanPhone.startsWith("05") ? `966${cleanPhone.slice(1)}` : cleanPhone;

            return (
              <div
                key={client.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-zinc-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{client.name}</h3>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{client.phone}</p>
                    </div>
                    {getStatusBadge(client.status)}
                  </div>

                  {client.email && (
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono mb-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{client.email}</span>
                    </p>
                  )}

                  {client.budget ? (
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs flex items-center justify-between mb-2">
                      <span className="text-zinc-400">الميزانية التقديرية:</span>
                      <span className="text-white font-mono font-bold">
                        {new Intl.NumberFormat("ar-SA").format(client.budget)} ر.س
                      </span>
                    </div>
                  ) : null}

                  {client.notes && (
                    <p className="text-xs text-zinc-300 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/50 line-clamp-2">
                      {client.notes}
                    </p>
                  )}
                </div>

                {/* Quick Contact & Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`السلام عليكم ${client.name}، معك فريق خريطة سيما بخصوص استفسارك العقاري`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>

                    <a
                      href={`tel:${client.phone}`}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition border border-zinc-700"
                      title="اتصال"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
                    title="حذف العميل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white">إضافة عميل جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  اسم العميل <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="محمد العبدالله"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  رقم الجوال <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">الميزانية المتوقعة (ريال)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="2000000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">ملاحظات واهتمامات العميل</label>
                <textarea
                  rows={2}
                  placeholder="يبحث عن فيلا مودرن في شمال الرياض مساحة 400م..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#F15A24]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#F15A24] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-500/25 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>حفظ العميل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
