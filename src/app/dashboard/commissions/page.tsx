'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">العمولات (Commissions)</h1>
        <Button>حاسبة العمولات</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">إجمالي العمولات</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-primary">125,000 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">معلقة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">35,000 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">مدفوعة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">80,000 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">متنازع عليها</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">10,000 ر.س</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل العمولات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-3">رقم الصفقة</th>
                  <th className="p-3">المستفيد</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">#DL-1002</td>
                  <td className="p-3">محمد (مسوق)</td>
                  <td className="p-3">تسويق خارجي</td>
                  <td className="p-3">15,000 ر.س</td>
                  <td className="p-3"><Badge variant="outline" className="text-yellow-600 border-yellow-600">معلقة</Badge></td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 ml-2">اعتماد</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
