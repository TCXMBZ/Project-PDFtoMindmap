'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Palette,
  Sliders,
  Check,
  Save,
  HardDrive,
  Bell,
  Globe,
  Sparkles,
  Camera
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockUser } from '@/data/mockUser';

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'appearance' | 'preferences'>(
    (initialTab as any) || 'profile'
  );

  // Form State
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [institution, setInstitution] = useState('วิทยาลัยเทคนิค / สถาบันอาชีวศึกษา');
  const [bio, setBio] = useState('นักศึกษาระดับ ปวส. สาขาวิชาเทคโนโลยีสารสนเทศ');

  // Preferences State
  const [aiLanguage, setAiLanguage] = useState<'th' | 'en'>('th');
  const [autoSaveCanvas, setAutoSaveCanvas] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  // Feedback State
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'ข้อมูลส่วนตัว (Profile)', icon: User },
    { id: 'account', label: 'บัญชีและการจัดเก็บ (Account)', icon: Shield },
    { id: 'appearance', label: 'หน้าตาและธีม (Appearance)', icon: Palette },
    { id: 'preferences', label: 'การตั้งค่าระบบ (Preferences)', icon: Sliders },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <h1 className="text-2xl font-extrabold text-[#202033] tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-sm text-[#85859A] mt-1">
            จัดการโปรไฟล์ผู้ใช้งาน การจัดเก็บข้อมูล และการตั้งค่า AI สำหรับ MindMap AI
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E9E9F1]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'border-[#6558E8] text-[#6558E8]'
                    : 'border-transparent text-[#85859A] hover:text-[#202033]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E9E9F1] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#E9E9F1]">
              <div className="relative w-20 h-20 shrink-0">
                <img
                  src={mockUser.avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-[#F0EFFF]"
                />
                <button
                  type="button"
                  onClick={() => alert('คลิกเพื่อเปลี่ยนรูปภาพประจำตัว')}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#6558E8] text-white hover:bg-[#5548D8] shadow-sm"
                  title="เปลี่ยนรูปภาพ"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-[#202033]">{name}</h3>
                <p className="text-xs text-[#85859A]">{email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F0EFFF] text-[#6558E8] text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {mockUser.plan}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A4A68]">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] focus:outline-none focus:border-[#6558E8]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A4A68]">อีเมลสถาบันการศึกษา</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] focus:outline-none focus:border-[#6558E8]"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#4A4A68]">สถาบัน / สถานศึกษา</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] focus:outline-none focus:border-[#6558E8]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#4A4A68]">ข้อมูลแนะนำตัวย่อ</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] focus:outline-none focus:border-[#6558E8] resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E9F1] flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-[#18A979] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!
                </span>
              ) : (
                <span className="text-xs text-[#85859A]">แก้ไขข้อมูลแล้วกดปุ่มบันทึก</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#6558E8] hover:bg-[#5548D8] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Account */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl border border-[#E9E9F1] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#202033] flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#6558E8]" />
                พื้นที่จัดเก็บเอกสาร (Cloud Storage)
              </h3>
              <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#202033]">ใช้งานแล้ว {mockUser.storageUsed}</span>
                  <span className="text-[#85859A]">จากทั้งหมด {mockUser.storageLimit}</span>
                </div>
                <div className="w-full bg-[#E9E9F1] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#6558E8] h-full rounded-full" style={{ width: '8.5%' }} />
                </div>
                <p className="text-[11px] text-[#85859A]">
                  เหลือพื้นที่อีก 457.5 MB สำหรับอัปโหลดเอกสาร PDF / DOCX
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E9F1] space-y-4">
              <h4 className="font-bold text-sm text-[#202033]">ความปลอดภัยของบัญชี</h4>
              <button
                type="button"
                onClick={() => alert('เปิดหน้าต่างเปลี่ยนรหัสผ่านจำลอง')}
                className="px-4 py-2 rounded-xl border border-[#E9E9F1] text-xs font-semibold text-[#4A4A68] hover:bg-[#F7F8FC]"
              >
                เปลี่ยนรหัสผ่าน (Change Password)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Appearance */}
        {activeTab === 'appearance' && (
          <div className="bg-white rounded-2xl border border-[#E9E9F1] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#202033] mb-1">ธีมและรูปแบบการแสดงผล</h3>
              <p className="text-xs text-[#85859A]">ปรับแต่งโทนสีและขนาดตัวอักษรของระบบ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border-2 border-[#6558E8] bg-[#F0EFFF]/30 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-[#202033]">Light Theme (ค่าเริ่มต้น)</p>
                  <p className="text-[11px] text-[#85859A] mt-0.5">สะอาดตา โทนสีม่วง Professional Modern</p>
                </div>
                <Check className="w-5 h-5 text-[#6558E8]" />
              </div>

              <div
                onClick={() => alert('Dark Mode พร้อมรองรับในเวอร์ชันถัดไป')}
                className="p-4 rounded-xl border border-[#E9E9F1] hover:border-[#85859A] cursor-pointer opacity-70 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-[#202033]">Dark Theme (เร็วๆ นี้)</p>
                  <p className="text-[11px] text-[#85859A] mt-0.5">ถนอมสายตาสำหรับการอ่านเวลากลางคืน</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E9F1] space-y-2">
              <label className="text-xs font-semibold text-[#4A4A68]">ฟอนต์หลักที่ใช้ในระบบ</label>
              <div className="p-3 bg-[#F7F8FC] rounded-xl text-xs text-[#4A4A68] border border-[#E9E9F1]">
                <strong>Sarabun</strong> (ภาษาไทย) & <strong>Inter</strong> (ภาษาอังกฤษ / โค้ด)
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl border border-[#E9E9F1] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-base text-[#202033]">การตั้งค่าการทำงานของ AI</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <div>
                  <p className="font-bold text-[#202033]">ภาษาหลักในการสรุปเนื้อหา</p>
                  <p className="text-[11px] text-[#85859A] mt-0.5">ภาษาที่ AI จะใช้สร้าง Mind Map และข้อความสรุป</p>
                </div>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E9E9F1] font-semibold text-[#6558E8] cursor-pointer"
                >
                  <option value="th">ภาษาไทย (Thai)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <div>
                  <p className="font-bold text-[#202033]">บันทึกการลากโหนดอัตโนมัติ (Auto-save Canvas)</p>
                  <p className="text-[11px] text-[#85859A] mt-0.5">บันทึกตำแหน่งโหนดทุกครั้งที่มีการขยับ</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSaveCanvas}
                  onChange={(e) => setAutoSaveCanvas(e.target.checked)}
                  className="w-4 h-4 accent-[#6558E8] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <div>
                  <p className="font-bold text-[#202033]">การแจ้งเตือนทางอีเมล</p>
                  <p className="text-[11px] text-[#85859A] mt-0.5">รับสรุปผลคะแนนแบบทดสอบและการแชร์ไฟล์</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 accent-[#6558E8] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E9F1] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#6558E8] hover:bg-[#5548D8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#85859A]">กำลังโหลดการตั้งค่า...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
