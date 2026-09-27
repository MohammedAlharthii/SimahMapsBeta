# 🚀 دليل رفع وتشغيل منصة سيما العقارية على Vercel مجاناً 100%

هذا الدليل يوضح لك بالخطوات البسيطة كيفية رفع المشروع على **Vercel** مع ربطه بقاعدة بيانات **MySQL السحابية المجانية** للحصول على رابط إنترنت عالمي مجاني وسريع.

---

### الخطوة 1: إنشاء قاعدة بيانات MySQL سحابية مجانية (TiDB Cloud)
لأن Vercel يستضيف كود الموقع والـ APIs، نحتاج إلى قاعدة بيانات MySQL تعمل أونلاين على السحابة:

1. ادخل إلى موقع [TiDB Cloud](https://tidbcloud.com) وسجل حساباً مجانياً (يدعم تسجيل الدخول عبر Google أو GitHub).
2. اضغط على **Create Cluster** واختر الخطة المجانية: **Serverless (Free Forever)**.
3. اختر أقرب منطقة (مثلاً `Frankfurt - eu-central-1` أو `Singapore`).
4. بعد إنشاء القاعدة، اضغط على **Connect**:
   - اختر **Connect With**: `Prisma` أو `General / MySQL CLI`.
   - انسخ رابط الاتصال (**Connection String**).
   - سيبدو الرابط بالشكل التالي:
     ```text
     mysql://[USER]:[PASSWORD]@gateway01.[REGION].prod.aws.tidbcloud.com:4000/aqar_crm?sslaccept=strict
     ```
   *(احفظ هذا الرابط؛ سنضعه في Vercel تحت اسم `DATABASE_URL`)*.

---

### الخطوة 2: رفع الكود على GitHub
تم تجهيز وضبط ملفات المشروع محلياً وعمل Commit جاهز. اتبع الآتي:

1. افتح [GitHub.com](https://github.com) وأنشئ مستودعاً جديداً (**New Repository**)، مثلاً باسم: `sima-realestate`.
2. انسخ رابط المستودع الجديد (مثلاً: `https://github.com/USERNAME/sima-realestate.git`).
3. في مجلد المشروع، افتح سطر الأوامر (Terminal) ونفّذ الأمرين التاليين فقط:
   ```bash
   git remote add origin https://github.com/USERNAME/sima-realestate.git
   git push -u origin main
   ```

---

### الخطوة 3: النشر على Vercel (بنقرة واحدة)
1. افتح موقع [Vercel.com](https://vercel.com) وسجل دخولك بحساب GitHub.
2. اضغط على زر **Add New...** ثم اختر **Project**.
3. ستجد مستودع `sima-realestate`، اضغط أمامه على **Import**.
4. في صفحة الإعدادات، افتح قسم **Environment Variables** وأضف المتغيرات الثلاثة التالية:
   - **الاسم الأول**: `DATABASE_URL`
     - **القيمة**: (رابط TiDB Cloud الذي نسخته في الخطوة 1)
   - **الاسم الثاني**: `NEXTAUTH_SECRET`
     - **القيمة**: `aqar-crm-super-secret-key-2026-auth`
   - **الاسم الثالث**: `CARTO_API_KEY`
     - **القيمة**: `cb1_3w2i_1_0086e70d092d4c1ac7eb1dc2`
5. اضغط على زر **Deploy**.
6. ستقوم Vercel ببناء المشروع ونشره خلال 60 ثانية، وستحصل على رابط عالمي دائم مثل:
   `https://sima-realestate.vercel.app`

---

### الخطوة 4: مزامنة الجداول وحساب المدير
بعد الحصول على رابط `DATABASE_URL` السحابي، يمكنك مزامنة الجداول وحسابات المدراء إلى القاعدة السحابية من جهازك بتنفيذ أمرين فقط:
```bash
# 1. دفع الجداول لقاعدة السحابة
npx prisma db push

# 2. زرع حسابات المدراء والعقارات التجريبية
npx prisma db seed
```
*(أو يمكنك وضع الرابط في ملف `.env` محلياً وتشغيل الأمرين لمرة واحدة).*

---

### 🔑 بيانات الدخول بعد النشر:
- **المدير العام**: `admin@aqar-crm.com` / `admin123`
- **مدير المبيعات**: `sales@aqar-crm.com` / `admin123`
- **مسؤول العقارات**: `property@aqar-crm.com` / `admin123`
- **الزوار**: التحقق الفوري عبر رمز OTP (الجوال أو الإيميل).
