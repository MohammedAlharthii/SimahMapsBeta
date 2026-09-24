'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Download } from 'lucide-react'

// Note: Recharts to be imported when implementing full functionality
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">التقارير (Reports)</h1>
        <Button variant="outline"><Download className="ml-2 h-4 w-4" /> تصدير التقرير</Button>
      </div>

      <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="w-64">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">المبيعات والصفقات</SelectItem>
              <SelectItem value="properties">العقارات</SelectItem>
              <SelectItem value="clients">العملاء</SelectItem>
              <SelectItem value="marketers">أداء المسوقين</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-64">
          <Select defaultValue="month">
            <SelectTrigger>
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>تحديث</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>إيرادات المبيعات</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center bg-muted/20 border-dashed border-2 m-4 rounded-md">
            <div className="text-center text-muted-foreground flex flex-col items-center">
              <BarChart3 className="h-10 w-10 mb-2 opacity-50" />
              <p>رسم بياني للإيرادات (سيتم إضافة Recharts)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>توزيع الصفقات حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-muted/20 border-dashed border-2 m-4 rounded-md">
            <div className="text-center text-muted-foreground flex flex-col items-center">
              <PieChartIcon className="h-10 w-10 mb-2 opacity-50" />
              <p>رسم بياني دائري</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أفضل الموظفين أداءً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">{i}</div>
                    <span className="font-medium">موظف مبيعات {i}</span>
                  </div>
                  <div className="font-bold">{10 - i} صفقات</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
