#!/bin/bash
# =============================================================================
# 🚀 سكريبت التثبيت التلقائي لمنصة سيما العقارية على خادم VPS (Ubuntu / Debian)
# Automated 1-Click VPS Deployment Script for SIMA Real Estate CRM
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================================${NC}"
echo -e "${GREEN}      بدء إعداد وتثبيت منصة سيما العقارية على الخادم (VPS)       ${NC}"
echo -e "${BLUE}===================================================================${NC}"

# Check root or sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}يرجى تشغيل السكريبت بصلاحية sudo: sudo bash setup-vps.sh${NC}"
  exit 1
fi

# Variables (You can adjust passwords here)
DB_NAME="aqar_crm"
DB_USER="sima_user"
DB_PASS="sima_db_pass_$(openssl rand -hex 6)"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
JWT_SECRET="$(openssl rand -base64 32)"

# 1. Update OS packages
echo -e "\n${YELLOW}[1/7] تحديث حزم النظام وتثبيت المتطلبات الأساسية...${NC}"
apt-get update -y
apt-get install -y curl wget git build-essential ufw nginx certbot python3-certbot-nginx

# 2. Install Node.js 20 LTS & PM2
echo -e "\n${YELLOW}[2/7] تثبيت Node.js 20 LTS ومدير العمليات PM2...${NC}"
if ! command -v node &> /dev/null || [[ $(node -v) != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2

echo -e "${GREEN}✓ Node.js $(node -v) و NPM $(npm -v) جاهز بنجاح!${NC}"

# 3. Install & Configure Local MySQL Database
echo -e "\n${YELLOW}[3/7] تثبيت وتأمين قاعدة بيانات MySQL المحلية...${NC}"
apt-get install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Create database, user, and grant privileges
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}✓ تم إنشاء قاعدة البيانات المحلية (${DB_NAME}) والمستخدم بنجاح!${NC}"

# 4. Configure .env file
echo -e "\n${YELLOW}[4/7] توليد وتحديث ملف المتغيرات .env...${NC}"
cd "$APP_DIR"

SERVER_IP=$(curl -s ifconfig.me || echo "localhost")

cat > .env << EOL
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@127.0.0.1:3306/${DB_NAME}"
NEXTAUTH_URL="http://${SERVER_IP}"
NEXTAUTH_SECRET="${JWT_SECRET}"
CARTO_API_KEY="cb1_3w2i_1_0086e70d092d4c1ac7eb1dc2"
NODE_ENV="production"
PORT=3000
EOL

echo -e "${GREEN}✓ تم حفظ ملف .env مع بيانات الربط المحلي لـ MySQL!${NC}"

# 5. Install Dependencies & Migrate Database
echo -e "\n${YELLOW}[5/7] تثبيت مكتبات المشروع ومزامنة جداول قاعدة البيانات...${NC}"
npm install
npx prisma generate
npx prisma db push --accept-data-loss
npm run db:seed

echo -e "${GREEN}✓ تمت مزامنة الجداول وحساب المدير بنجاح!${NC}"

# 6. Build Next.js Production App & Run with PM2
echo -e "\n${YELLOW}[6/7] بناء نسخة الإنتاج وتشغيل المنصة عبر PM2...${NC}"
npm run build

pm2 delete sima-aqar-crm 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 on boot
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root || true

echo -e "${GREEN}✓ منصة سيما تعمل الآن في الخلفية عبر PM2 على المنفذ 3000!${NC}"

# 7. Configure Nginx Reverse Proxy
echo -e "\n${YELLOW}[7/7] ضبط خادم Nginx لعكس الاتصال (Port 80/443)...${NC}"
cp nginx/sima.conf /etc/nginx/sites-available/sima
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/sima /etc/nginx/sites-enabled/sima

nginx -t
systemctl restart nginx

# Firewall setup
ufw allow 'Nginx Full' || true
ufw allow 22/tcp || true
ufw --force enable || true

echo -e "\n${BLUE}===================================================================${NC}"
echo -e "${GREEN}🎉 تم الانتهاء بنجاح! منصة سيما العقارية جاهزة وتعمل على الـ VPS!${NC}"
echo -e "${BLUE}===================================================================${NC}"
echo -e "🌐 رابط الموقع المباشر: ${YELLOW}http://${SERVER_IP}${NC}"
echo -e "🗄️ قاعدة البيانات المحلية: ${YELLOW}${DB_NAME}${NC} (المستخدم: ${DB_USER})"
echo -e "🔑 حساب مدير النظام:"
echo -e "   - البريد: ${GREEN}admin@aqar-crm.com${NC}"
echo -e "   - كلمة المرور: ${GREEN}admin123${NC}"
echo -e "\n💡 لإضافة دومين وشهادة SSL مجانية، شغّل الأمر التالي فقط:"
echo -e "   ${YELLOW}sudo certbot --nginx -d your-domain.com${NC}"
echo -e "${BLUE}===================================================================${NC}"
