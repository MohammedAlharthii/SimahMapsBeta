'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, BarChart3, CheckSquare, XSquare, Plus } from 'lucide-react'

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الصفقات (Deals)</h1>
        <Button><Plus className="ml-2 h-4 w-4" /> صفقة جديدة</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">إجمالي قيمة الصفقات</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">24,500,000 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">الصفقات النشطة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">12</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">الصفقات المكتملة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">45</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">متوسط حجم الصفقة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">1,800,000 ر.س</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">مسار الصفقات (Pipeline)</TabsTrigger>
          <TabsTrigger value="table">جدول (Table)</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {['تفاوض', 'توقيع العقد', 'انتظار الدفع', 'مكتملة', 'ملغاة'].map(stage => (
              <div key={stage} className="min-w-[250px] space-y-4">
                <h3 className="font-semibold text-lg bg-muted p-2 rounded-md">{stage}</h3>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">بيع فيلا الملقا</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2 text-sm text-muted-foreground">
                    <div>العميل: سعد فهد</div>
                    <div className="font-semibold text-primary">المبلغ: 3,200,000 ر.س</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
