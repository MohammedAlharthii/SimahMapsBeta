import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, propertyTitle, propertyPrice, contact, channel, verified } = body;

    if (!contact) {
      return NextResponse.json({ error: 'جهة الاتصال مطلوبة' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1';

    // Record into AuditLog
    const log = await prisma.auditLog.create({
      data: {
        action: 'AD_VIEW_VERIFIED',
        entity: 'PROPERTY',
        entityId: propertyId || 'UNKNOWN',
        newValue: {
          contact,
          channel: channel || 'email',
          propertyTitle: propertyTitle || 'عرض عقاري',
          propertyPrice: propertyPrice || 0,
          verified: verified ?? true,
          viewedAt: new Date().toISOString(),
        },
        ipAddress,
      },
    });

    console.log(`[Ad View Logged] ${contact} viewed property ${propertyId} (${propertyTitle}) from IP: ${ipAddress}`);

    return NextResponse.json({ success: true, logId: log.id });
  } catch (err: any) {
    console.error('Failed to log ad view:', err);
    return NextResponse.json({ error: 'فشل تسجيل مشاهدة الإعلان' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        action: 'AD_VIEW_VERIFIED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    const formatted = logs.map((log) => {
      const details = (log.newValue as any) || {};
      return {
        id: log.id,
        propertyId: log.entityId,
        propertyTitle: details.propertyTitle || 'عقار',
        propertyPrice: details.propertyPrice || 0,
        contact: details.contact || 'غير محدد',
        channel: details.channel || 'phone',
        verified: details.verified ?? true,
        ipAddress: log.ipAddress || '127.0.0.1',
        createdAt: log.createdAt,
      };
    });

    return NextResponse.json({ logs: formatted });
  } catch (err: any) {
    console.error('Failed to fetch ad logs:', err);
    return NextResponse.json({ error: 'تعذر جلب سجلات المشاهدات' }, { status: 500 });
  }
}
