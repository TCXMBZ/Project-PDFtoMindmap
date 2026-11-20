'use client';

import React, { useEffect } from 'react';
import { X, BookOpen, GitFork, Zap, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="gw-popover rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[var(--gw-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gw-accent-soft)] text-[var(--gw-accent)] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="help-modal-title" className="font-bold text-lg text-[var(--gw-text)]">
                ศูนย์ช่วยเหลือ MindMap AI
              </h3>
              <p className="text-xs text-[var(--gw-text-muted)]">
                คู่มือการใช้งานและคำแนะนำสำหรับนักเรียนและนักศึกษา
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help modal"
            className="gw-button w-8 h-8 rounded-lg flex items-center justify-center text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick steps */}
          <div>
            <h4 className="font-semibold text-[var(--gw-text)] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--gw-accent)]" />
              ขั้นตอนการใช้งานง่ายๆ ใน 3 สเต็ป
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="gw-glass p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[var(--gw-accent)] text-white text-xs font-bold flex items-center justify-center mb-2">
                  1
                </span>
                <p className="font-medium text-xs text-[var(--gw-text)]">อัปโหลดเอกสาร</p>
                <p className="text-[11px] text-[var(--gw-text-muted)] mt-1">
                  รองรับ PDF, DOCX, TXT ขนาดสูงสุด 25MB
                </p>
              </div>
              <div className="gw-glass p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[var(--gw-accent)] text-white text-xs font-bold flex items-center justify-center mb-2">
                  2
                </span>
                <p className="font-medium text-xs text-[var(--gw-text)]">AI วิเคราะห์เนื้อหา</p>
                <p className="text-[11px] text-[var(--gw-text-muted)] mt-1">
                  สกัดหัวข้อ คำสำคัญ และสรุปประเด็นหลัก
                </p>
              </div>
              <div className="gw-glass p-3.5 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[var(--gw-accent)] text-white text-xs font-bold flex items-center justify-center mb-2">
                  3
                </span>
                <p className="font-medium text-xs text-[var(--gw-text)]">แปลงเป็น Mind Map</p>
                <p className="text-[11px] text-[var(--gw-text-muted)] mt-1">
                  ลาก ปรับแต่ง และส่งออกเป็นภาพหรือ PDF
                </p>
              </div>
            </div>
          </div>

          {/* Shortcut Keys for Mind Map Canvas */}
          <div>
            <h4 className="font-semibold text-[var(--gw-text)] mb-3 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[var(--gw-accent)]" />
              คีย์ลัดบน Mind Map Editor
            </h4>
            <div className="space-y-2 text-xs">
              <div className="gw-glass flex items-center justify-between p-2.5 rounded-xl">
                <span className="text-[var(--gw-text-muted)]">ลากแคนวาสเพื่อเลื่อนมุมมอง</span>
                <kbd className="px-2 py-0.5 rounded-md border border-[var(--gw-border)] bg-[var(--gw-accent-soft)] text-[11px] font-mono text-[var(--gw-text)]">
                  คลิกซ้ายค้าง + ลาก
                </kbd>
              </div>
              <div className="gw-glass flex items-center justify-between p-2.5 rounded-xl">
                <span className="text-[var(--gw-text-muted)]">ย่อ / ขยายมุมมอง (Zoom)</span>
                <kbd className="px-2 py-0.5 rounded-md border border-[var(--gw-border)] bg-[var(--gw-accent-soft)] text-[11px] font-mono text-[var(--gw-text)]">
                  Scroll Wheel / ปุ่ม +/-
                </kbd>
              </div>
              <div className="gw-glass flex items-center justify-between p-2.5 rounded-xl">
                <span className="text-[var(--gw-text-muted)]">แก้ไขข้อมูลโหนด</span>
                <kbd className="px-2 py-0.5 rounded-md border border-[var(--gw-border)] bg-[var(--gw-accent-soft)] text-[11px] font-mono text-[var(--gw-text)]">
                  คลิกที่โหนด แล้วดูแผงด้านขวา
                </kbd>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="gw-positive p-3.5 rounded-xl border border-[var(--gw-border)] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>นโยบายความเป็นส่วนตัว:</strong> เอกสารที่คุณอัปโหลดในระบบ Prototype จะถูกจำลองการประมวลผลบนเครื่องของคุณ ไม่มีการส่งข้อมูลส่วนบุคคลออกสู่ภายนอก
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--gw-border)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="gw-button-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}
