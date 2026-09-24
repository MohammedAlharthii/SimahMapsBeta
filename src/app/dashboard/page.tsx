"use client";

import { Building2, Users, Handshake, BarChart3, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const pieData = [
  { name: "متاح", value: 400 },
  { name: "مباع", value: 300 },
  { name: "مؤجر", value: 300 },
  { name: "محجوز", value: 200 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#64748b"];

const barData = [
  { name: "يناير", صفقات: 4000 },
  { name: "فبراير", صفقات: 3000 },
  { name: "مارس", صفقات: 2000 },
  { name: "أبريل", صفقات: 2780 },
  { name: "مايو", صفقات: 1890 },
  { name: "يونيو", صفقات: 2390 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> إضافة عقار
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي العقارات" value="1,240" icon={<Building2 />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="إجمالي العملاء" value="3,842" icon={<Users />} color="text-green-600" bg="bg-green-50" />
        <StatCard title="الصفقات النشطة" value="142" icon={<Handshake />} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="إيرادات الشهر" value="450K SAR" icon={<BarChart3 />} color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">المبيعات الشهرية</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="صفقات" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">حالة العقارات</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                <span className="text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">متابعات اليوم</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">اتصال بعميل محتمل - أحمد محمد</h3>
                  <p className="text-sm text-slate-500 mt-1">بخصوص شقة 3 غرف في حي الياسمين</p>
                </div>
                <div className="mr-auto text-xs text-slate-400">10:30 ص</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">أحدث النشاطات</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">تم إغلاق صفقة إيجار</h3>
                  <p className="text-sm text-slate-500 mt-1">فيلا في حي النرجس بواسطة الموظف خالد</p>
                </div>
                <div className="mr-auto text-xs text-slate-400">منذ ساعتين</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: { title: string; value: string; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
