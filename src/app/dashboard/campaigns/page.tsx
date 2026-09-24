'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, BarChart, Users, DollarSign, Target } from 'lucide-react'

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الحملات التسويقية (Campaigns)</h1>
        <Button><Plus className="ml-2 h-4 w-4" /> حملة جديدة</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">الميزانية الكلية</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-bold">50,000 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">المنفق</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-bold">22,500 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">العملاء المحتملين</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-bold">450</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">متوسط تكلفة العميل</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-bold">50 ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">معدل التحويل</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-bold">3.2%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الحملات الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-3">اسم الحملة</th>
                  <th className="p-3">المنصة</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">المنفق / الميزانية</th>
                  <th className="p-3">Leads</th>
                  <th className="p-3">ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">تسويق فلل شمال الرياض</td>
                  <td className="p-3">Google Ads</td>
                  <td className="p-3"><Badge className="bg-green-100 text-green-800">نشطة</Badge></td>
                  <td className="p-3">15,000 / 30,000</td>
                  <td className="p-3">320</td>
                  <td className="p-3 text-green-600">+150%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
