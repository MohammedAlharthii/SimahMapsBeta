#!/bin/bash
# =============================================================================
# 🔄 سكريبت تحديث المنصة على الـ VPS عند تعديل الكود
# =============================================================================

set -e

echo "📥 جلب آخر التحديثات من GitHub..."
git pull origin main

echo "📦 تحديث الحزم ومخطط قاعدة البيانات..."
npm install
npx prisma generate
npx prisma db push --accept-data-loss

echo "🏗️ إعادة بناء تطبيق Next.js..."
npm run build

echo "🚀 إعادة تشغيل الخادم عبر PM2..."
pm2 restart sima-aqar-crm

echo "✅ تم تحديث منصة سيما بنجاح بدون توقف!"
