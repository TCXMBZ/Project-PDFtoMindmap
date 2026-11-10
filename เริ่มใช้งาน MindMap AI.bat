@echo off
chcp 65001 > nul
title MindMap AI - Starting System...
color 0b

echo ====================================================
echo        🧠 MindMap AI - AI-Powered Prototype
echo        สถาบันการอาชีวศึกษา / โครงงาน ปวส.
echo ====================================================
echo.
echo [*] กำลังตั้งค่า Node.js Environment...
set PATH=C:\Program Files\nodejs;%PATH%

echo [*] กำลังเปิดเว็บเซิร์ฟเวอร์ Next.js...
start http://localhost:3000

echo.
echo [*] กำลังรันคำสั่ง: npm run dev
echo [*] กรุณาอย่าปิดหน้าต่างนี้ขณะใช้งานระบบ
echo ====================================================
echo.

npm run dev

pause

