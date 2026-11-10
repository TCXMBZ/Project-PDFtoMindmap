'use client';

import React from 'react';
import { X, BookOpen, Sparkles, GitFork, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E9E9F1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#202033]">ศูนย์ช่วยเหลือ MindMap AI</h3>
              <p className="text-xs text-[#85859A]">คู่มือการใช้งานและคำแนะนำสำหรับนักเรียนและนักศึกษา</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#85859A] hover:bg-[#F7F8FC] hover:text-[#202033]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick steps */}
          <div>
            <h4 className="font-semibold text-[#202033] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#6558E8]" />
              ขั้นตอนการใช้งานง่ายๆ ใน 3 สเต็ป
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <span className="w-6 h-6 rounded-full bg-[#6558E8] text-white text-xs font-bold flex items-center justify-center mb-2">1</span>
                <p className="font-medium text-xs text-[#202033]">อัปโหลดเอกสาร</p>
                <p className="text-[11px] text-[#85859A] mt-1">รองรับ PDF, DOCX, TXT ขนาดสูงสุด 25MB</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <span className="w-6 h-6 rounded-full bg-[#6558E8] text-white text-xs font-bold flex items-center justify-center mb-2">2</span>
                <p className="font-medium text-xs text-[#202033]">AI วิเคราะห์เนื้อหา</p>
                <p className="text-[11px] text-[#85859A] mt-1">สกัดหัวข้อ คำสำคัญ และสรุปประเด็นหลัก</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <span className="w-6 h-6 rounded-full bg-[#6558E8] text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
                <p className="font-medium text-xs text-[#202033]">แปลงเป็น Mind Map</p>
                <p className="text-[11px] text-[#85859A] mt-1">ลาก ปรับแต่ง และส่งออกเป็นภาพหรือ PDF</p>
              </div>
            </div>
          </div>

          {/* Shortcut Keys for Mind Map Canvas */}
          <div>
            <h4 className="font-semibold text-[#202033] mb-3 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[#6558E8]" />
              คีย์ลัดบน Mind Map Editor
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F8FC]">
                <span className="text-[#4A4A68]">ลากแคนวาสเพื่อเลื่อนมุมมอง</span>
                <kbd className="px-2 py-0.5 bg-white border border-[#E9E9F1] rounded text-[11px] font-mono text-[#202033]">คลิกซ้ายค้าง + ลาก</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F8FC]">
                <span className="text-[#4A4A68]">ย่อ / ขยายมุมมอง (Zoom)</span>
                <kbd className="px-2 py-0.5 bg-white border border-[#E9E9F1] rounded text-[11px] font-mono text-[#202033]">Scroll Wheel / ปุ่ม +/-</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F8FC]">
                <span className="text-[#4A4A68]">แก้ไขข้อมูลโหนด</span>
                <kbd className="px-2 py-0.5 bg-white border border-[#E9E9F1] rounded text-[11px] font-mono text-[#202033]">คลิกที่โหนด แล้วดูแผงด้านขวา</kbd>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-[#18A979]/10 border border-[#18A979]/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#18A979] shrink-0 mt-0.5" />
            <p className="text-xs text-[#18A979] leading-relaxed">
              <strong>นโยบายความเป็นส่วนตัว:</strong> เอกสารที่คุณอัปโหลดในระบบ Prototype จะถูกจำลองการประมวลผลบนเครื่องของคุณ ไม่มีการส่งข้อมูลส่วนบุคคลออกสู่ภายนอก
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E9E9F1] bg-[#F7F8FC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-colors"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}

