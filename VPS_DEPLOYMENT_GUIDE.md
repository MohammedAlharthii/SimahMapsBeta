# 🖥️ دليل تشغيل منصة سيما العقارية على سيرفر خاص (VPS) مع قاعدة بيانات محلية

هذا الدليل يوضح لك كيفية تشغيل المنصة على أي سيرفر VPS (مثل Contabo, Hetzner, DigitalOcean, AWS, OVH) يعمل بنظام **Ubuntu 20.04 / 22.04 / 24.04** أو **Debian**، مع ربطها بقاعدة بيانات **MySQL محلية** على نفس السيرفر للحصول على أعلى سرعة واستقلالية تامة.

---

## ⚡ الطريقة الأولى: التثبيت التلقائي بضغطة زر واحدة (موصى بها ⭐)

تم تجهيز سكريبت تلقائي ذكي يقوم بجميع العمليات بدلاً عنك (تثبيت Node.js، تثبيت وتأمين MySQL، إنشاء قاعدة البيانات المحلية، إعداد Nginx، وربط PM2 للتشغيل الدائم):

### 1. ادخل إلى السيرفر عبر SSH:
```bash
ssh root@YOUR_SERVER_IP
```

### 2. اسحب المشروع من GitHub:
```bash
git clone https://github.com/MohammedAlharthii/SimahMapsBeta.git /var/www/sima
cd /var/www/sima
```

### 3. شغّل سكريبت التثبيت:
```bash
sudo bash setup-vps.sh
```

> ⏱️ **خلال دقيقتين فقط:** سيقوم السكريبت بكل شيء تلقائياً، ويعطيك رابط موقعك المباشر مع بيانات قاعدة البيانات وحساب المدير!

---

## 🐳 الطريقة الثانية: التشغيل عبر Docker Compose

إذا كنت تفضل استخدام Docker (حاوية للتطبيق + حاوية لـ MySQL المحلية معاً):

```bash
# 1. الدخول للمجلد
cd /var/www/sima

# 2. تشغيل الحاويات في الخلفية
docker compose up -d --build
```

- ستبدأ قاعدة بيانات MySQL المحلية تلقائياً.
- ستقوم الحاوية بدفع الجداول وحساب المدير تلقائياً.
- المنصة ستكون متاحة مباشرة على المنفذ `http://YOUR_SERVER_IP:3000`.

---

## 🛠️ الطريقة الثالثة: التثبيت اليدوي خطوة بخطوة

إذا أردت تنفيذ الخطوات بنفسك يدوياً:

### 1. تثبيت المتطلبات:
```bash
sudo apt update && sudo apt install -y curl git nginx mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. إعداد قاعدة بيانات MySQL المحلية:
افتح سطر أوامر MySQL:
```bash
sudo mysql
```
ثم نفّذ الأوامر التالية:
```sql
CREATE DATABASE aqar_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sima_user'@'127.0.0.1' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON aqar_crm.* TO 'sima_user'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

### 3. إعداد ملف البيئة `.env`:
أنشئ ملف `.env` في مجلد المشروع:
```env
DATABASE_URL="mysql://sima_user:StrongPassword123!@127.0.0.1:3306/aqar_crm"
NEXTAUTH_URL="http://YOUR_SERVER_IP"
NEXTAUTH_SECRET="sima-realestate-vps-super-secret-key-2026"
CARTO_API_KEY="cb1_3w2i_1_0086e70d092d4c1ac7eb1dc2"
NODE_ENV="production"
PORT=3000
```

### 4. مزامنة الجداول وبناء المشروع:
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

### 5. تشغيل المشروع عبر PM2 ليعمل 24/7:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. ضبط خادم Nginx:
```bash
sudo cp nginx/sima.conf /etc/nginx/sites-available/sima
sudo ln -sf /etc/nginx/sites-available/sima /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 تثبيت دومين وشهادة أمان مجانية (SSL / HTTPS)

إذا كان لديك دومين موجه إلى IP السيرفر (مثل `sima.com`):
```bash
sudo certbot --nginx -d sima.com -d www.sima.com
```
سيقوم Certbot بتفعيل التشفير الأخضر (HTTPS) وتجديده تلقائياً مجاناً مدى الحياة!

---

## 🔄 كيفية تحديث المنصة مستقبلاً (Update)

عندما تقوم بإجراء أي تعديلات على الكود وتريد تطبيقها على السيرفر:
```bash
cd /var/www/sima
bash update-vps.sh
```
أو يدوياً:
```bash
git pull origin main
npm install
npx prisma db push
npm run build
pm2 restart sima-aqar-crm
```

---

## 🔑 بيانات تسجيل الدخول الافتراضية:

- **المدير العام**: `admin@aqar-crm.com` / كلمة المرور: `admin123`
- **مدير المبيعات**: `sales@aqar-crm.com` / كلمة المرور: `admin123`
- **مسؤول العقارات**: `property@aqar-crm.com` / كلمة المرور: `admin123`
