@echo off
chcp 65001 > nul
title MindMap AI - Starting System...
color 0b

echo ====================================================
echo        🧠 MindMap AI - AI-Powered Prototype
echo        สถาบันการอาชีวศึกษา / โครงงาน ปวส.
echo ====================================================
echo.

cd /d "%~dp0"

echo [*] กำลังตั้งค่า Node.js Environment...
set PATH=C:\Program Files\nodejs;%PATH%

echo [*] กำลังเปิดเว็บเซิร์ฟเวอร์ Next.js...
start "" cmd /c "timeout /t 3 > nul && start http://localhost:3000"

echo.
echo [*] กำลังรันคำสั่ง: npm run dev
echo [*] เมื่อขึ้นคำว่า "Ready" เว็บไซต์จะเปิดขึ้นมาอัตโนมัติ
echo [*] กรุณาอย่าปิดหน้าต่างสีดำนี้ขณะกำลังใช้งาน
echo ====================================================
echo.

npm run dev

pause
