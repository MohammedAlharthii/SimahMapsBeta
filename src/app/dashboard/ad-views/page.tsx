'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Phone,
  Mail,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  MessageCircle,
  Copy,
  Check,
  Building,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdViewLog {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  contact: string;
  channel: 'phone' | 'email';
  verified: boolean;
  ipAddress: string;
  createdAt: string;
}

export default function AdViewsLogPage() {
  const [logs, setLogs] = useState<AdViewLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'phone' | 'email'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties/view-log');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('تعذر جلب سجلات المشاهدات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`تم نسخ: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchContact = log.contact.toLowerCase().includes(q);
    const matchTitle = log.propertyTitle.toLowerCase().includes(q);
    const matchChannel = channelFilter === 'ALL' || log.channel === channelFilter;
    return (matchContact || matchTitle) && matchChannel;
  });

  const totalViews = logs.length;
  const phoneViews = logs.filter((l) => l.channel === 'phone').length;
  const emailViews = logs.filter((l) => l.channel === 'email').length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#F15A24]/10 border border-[#F15A24]/20 text-[#F15A24]">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">سجل مشاهدات الإعلانات (OTP Logs)</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                متابعة أرقام الجوالات والبريد الإلكتروني للزوار الذين قاموا بفك قفل العروض العقارية
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>إجمالي المشاهدات الموثقة</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalViews}</div>
          <span className="text-[11px] text-zinc-500">تم التحقق من هوياتهم بنجاح</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>المشاهدات عبر الجوال (SMS)</span>
            <Phone className="w-4 h-4 text-[#F15A24]" />
          </div>
          <div className="text-2xl font-black text-white">{phoneViews}</div>
          <span className="text-[11px] text-zinc-500">عملاء محتملون برقم مباشر</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>المشاهدات عبر البريد (Email)</span>
            <Mail className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{emailViews}</div>
          <span className="text-[11px] text-zinc-500">توثيق عبر الرسائل البريدية</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-zinc-500" />
          <input
            type="text"
            placeholder="بحث برقم الجوال، البريد، أو اسم العقار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F15A24]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-500 ms-1" />
          <button
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              channelFilter === 'ALL'
                ? 'bg-[#F15A24] text-white shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            الكل ({totalViews})
          </button>
          <button
            onClick={() => setChannelFilter('phone')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              channelFilter === 'phone'
                ? 'bg-[#F15A24] text-white shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            📱 جوال ({phoneViews})
          </button>
          <button
            onClick={() => setChannelFilter('email')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              channelFilter === 'email'
                ? 'bg-[#F15A24] text-white shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            ✉️ بريد ({emailViews})
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 font-semibold">
              <tr>
                <th className="py-3.5 px-4">وسيلة التواصل (الرقم / الإيميل)</th>
                <th className="py-3.5 px-4">العقار المشاهد</th>
                <th className="py-3.5 px-4">نوع التحقق</th>
                <th className="py-3.5 px-4">وقت المشاهدة</th>
                <th className="py-3.5 px-4">عنوان IP</th>
                <th className="py-3.5 px-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const isPhone = log.channel === 'phone';
                  const dateFormatted = new Date(log.createdAt).toLocaleString('ar-SA', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  });

                  return (
                    <tr key={log.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Contact Info with Copy Button */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isPhone ? 'bg-orange-500/10 text-[#F15A24]' : 'bg-sky-500/10 text-sky-400'
                          }`}>
                            {isPhone ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-mono text-sm font-bold text-white block" dir="ltr">
                              {log.contact}
                            </span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> تم التحقق بنجاح
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Property Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col max-w-xs">
                          <Link
                            href={`/properties/${log.propertyId}`}
                            target="_blank"
                            className="font-bold text-zinc-200 hover:text-[#F15A24] transition-colors truncate flex items-center gap-1.5"
                          >
                            <span>{log.propertyTitle}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </Link>
                          {log.propertyPrice > 0 && (
                            <span className="text-[11px] text-zinc-400 font-mono">
                              {new Intl.NumberFormat('ar-SA').format(log.propertyPrice)} ر.س
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Channel Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          isPhone
                            ? 'bg-orange-500/15 text-[#F15A24] border border-orange-500/30'
                            : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        }`}>
                          {isPhone ? '📱 جوال (SMS)' : '✉️ بريد إلكتروني'}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-zinc-300 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>

                      {/* IP */}
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-xs">
                        {log.ipAddress}
                      </td>

                      {/* Actions: Direct WhatsApp, Call or Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(log.contact, log.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                            title="نسخ جهة الاتصال"
                          >
                            {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {isPhone ? (
                            <>
                              <a
                                href={`https://wa.me/${log.contact.replace(/\D/g, '').replace(/^0/, '966')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                                title="محادثة واتساب مباشرة"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${log.contact}`}
                                className="p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#F15A24] border border-orange-500/30 transition-colors"
                                title="اتصال هاتفي"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </>
                          ) : (
                            <a
                              href={`mailto:${log.contact}?subject=بخصوص استفسارك عن عقار في خريطة سيما`}
                              className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors"
                              title="إرسال بريد إلكتروني"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 text-xs">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                    <span>لا توجد مشاهدات مسجلة حتى الآن</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
