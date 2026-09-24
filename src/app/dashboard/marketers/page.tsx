'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Users, UserPlus } from 'lucide-react'

export default function MarketersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المسوقين (Marketers)</h1>
        <Button><UserPlus className="ml-2 h-4 w-4" /> إضافة مسوق</Button>
      </div>

      <Tabs defaultValue="internal">
        <TabsList>
          <TabsTrigger value="internal">مسوقين داخليين</TabsTrigger>
          <TabsTrigger value="external">مسوقين خارجيين</TabsTrigger>
        </TabsList>
        <TabsContent value="internal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">سارة أحمد</CardTitle>
                  <Badge className="bg-green-100 text-green-800">نشط</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">0501112223</div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">الإحالات</div>
                    <div className="font-bold">42</div>
                  </div>
                  <div className="bg-muted p-2 rounded text-center">
                    <div className="text-xs text-muted-foreground">العمولات</div>
                    <div className="font-bold">85,000</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">عرض التفاصيل</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="external" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              لا يوجد مسوقين خارجيين حالياً
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
