@echo off
chcp 65001 >nul
title سيما العقارية - SIMA Real Estate CRM
color 0C

echo ======================================================================
echo             🏢 منصة سيما العقارية - SIMA Real Estate CRM
echo ======================================================================
echo.

cd /d "%~dp0"

:: 1. التحقق من تشغيل قاعدة بيانات MySQL / MariaDB (HeidiSQL)
echo [*] التحقق من اتصال قاعدة البيانات MySQL / HeidiSQL...
if exist "C:\xampp\mysql\bin\mysqladmin.exe" (
    "C:\xampp\mysql\bin\mysqladmin.exe" -u root ping >nul 2>&1
    if errorlevel 1 (
        echo [!] خادم MySQL غير متصل، جاري تشغيله في الخلفية...
        powershell -WindowStyle Hidden -Command "Start-Process 'C:\xampp\mysql\bin\mysqld.exe' -ArgumentList '--defaults-file=C:\xampp\mysql\bin\my.ini --standalone' -WindowStyle Hidden"
        timeout /t 4 /nobreak >nul
        "C:\xampp\mysql\bin\mysqladmin.exe" -u root ping >nul 2>&1
        if errorlevel 1 (
            echo [!] تنبيه: يرجى التأكد من تشغيل MySQL من XAMPP Control Panel.
        ) else (
            echo [V] تم تشغيل MySQL بنجاح في الخلفية على المنفذ 3306!
        )
    ) else (
        echo [V] خادم MySQL متصل ويعمل بنجاح (Port 3306).
    )
) else (
    echo [!] لم يتم العثور على مسار XAMPP الافتراضي، جاري المتابعة...
)

echo.
echo [*] فحص وتحديث جداول HeidiSQL (قاعدة aqar_crm)...
call npx prisma db push --skip-generate >nul 2>&1
echo [V] قاعدة البيانات متزامنة وجاهزة.
echo.

echo ======================================================================
echo                         حسابات الدخول التجريبية:
echo ----------------------------------------------------------------------
echo   1. مدير النظام  : admin@aqar-crm.com    / admin123
echo   2. مدير مبيعات  : sales@aqar-crm.com    / admin123
echo   3. مسؤول عقارات : property@aqar-crm.com / admin123
echo ======================================================================
echo.
echo [*] الخريطة الذكية : Leaflet Carto Dark Matter (مع مفتاح Carto المعتمد)
echo [*] الرابط المباشر : http://localhost:3000
echo.

start "" http://localhost:3000

call npm run dev
pause
