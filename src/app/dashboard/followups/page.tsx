'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Clock, Phone, MapPin, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FollowupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المتابعات (Follow-ups)</h1>
        <Button><Plus className="ml-2 h-4 w-4" /> إضافة متابعة</Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">متابعات متأخرة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-2 rounded-full"><Phone className="h-4 w-4 text-red-600" /></div>
                <div>
                  <h4 className="font-semibold">اتصال بعميل: محمد عبدالله</h4>
                  <p className="text-sm text-muted-foreground">كانت مجدولة أمس 10:00 صباحاً</p>
                </div>
              </div>
              <Button variant="outline" size="sm"><CheckCircle className="ml-2 h-4 w-4" /> إنجاز</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>متابعات اليوم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full"><Calendar className="h-4 w-4 text-blue-600" /></div>
                <div>
                  <h4 className="font-semibold">اجتماع مع: شركة الأفق</h4>
                  <p className="text-sm text-muted-foreground">اليوم 02:00 مساءً</p>
                </div>
              </div>
              <Button variant="outline" size="sm"><CheckCircle className="ml-2 h-4 w-4" /> إنجاز</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
