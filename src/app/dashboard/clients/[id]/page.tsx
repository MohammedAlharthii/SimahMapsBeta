'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, Mail, MapPin, Globe, Plus, Clock, Home, DollarSign, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">تفاصيل العميل - أحمد محمد</h1>
        <Button><Plus className="ml-2 h-4 w-4" /> إجراء جديد</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>معلومات العميل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> 0501234567</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> ahmed@example.com</div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> سعودي</div>
            <div className="flex items-center gap-2 font-semibold">الميزانية: 1,500,000 ريال</div>
            <Badge>مؤهل</Badge>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="requests">الطلبات</TabsTrigger>
              <TabsTrigger value="followups">المتابعات</TabsTrigger>
              <TabsTrigger value="matches">العقارات المطابقة</TabsTrigger>
              <TabsTrigger value="deals">الصفقات</TabsTrigger>
              <TabsTrigger value="activity">سجل النشاط</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="p-6">نظرة عامة على العميل</CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="followups" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full"><Phone className="h-4 w-4 text-primary" /></div>
                  <div>
                    <h4 className="font-semibold">اتصال هاتفي</h4>
                    <p className="text-sm text-muted-foreground">تم مناقشة متطلبات الفيلا في شمال الرياض.</p>
                    <span className="text-xs text-muted-foreground mt-2 block">منذ ساعتين - بواسطة الموظف خالد</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
