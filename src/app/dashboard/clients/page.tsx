'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Filter, Phone, User, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">العملاء (Clients)</h1>
        <Button><Plus className="ml-2 h-4 w-4" /> إضافة عميل جديد</Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث بالاسم، الجوال، الإيميل..." className="pr-10" />
        </div>
        <Button variant="outline"><Filter className="ml-2 h-4 w-4" /> تصفية</Button>
      </div>
      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">لوحة (Kanban)</TabsTrigger>
          <TabsTrigger value="table">جدول (Table)</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {['جديد', 'تم التواصل', 'مؤهل', 'تفاوض', 'مغلق (ربح)', 'مغلق (خسارة)'].map(stage => (
              <div key={stage} className="min-w-[250px] space-y-4">
                <h3 className="font-semibold text-lg bg-muted p-2 rounded-md">{stage}</h3>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">أحمد محمد</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0501234567</div>
                    <div className="flex items-center gap-2"><User className="h-4 w-4" /> الموظف: خالد</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> آخر تواصل: أمس</div>
                    <div className="font-semibold text-primary">الميزانية: 1,500,000 ريال</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              عرض الجدول هنا (Table View)
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
