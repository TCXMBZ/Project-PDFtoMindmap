'use client';

import React, { useEffect, useState } from 'react';
import { X, Download, FileImage, FileText, Code, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mindMapTitle: string;
}

export default function ExportModal({ isOpen, onClose, mindMapTitle }: ExportModalProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = (format: string) => {
    setDownloading(format);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(format);
      setTimeout(() => setDownloaded(null), 2000);
    }, 800);
  };

  const exportOptions = [
    {
      id: 'png',
      name: 'รูปภาพความละเอียดสูง (PNG)',
      desc: 'เหมาะสำหรับใส่ในรายงาน สไลด์นำเสนอ หรือแชร์บนโซเชียล',
      icon: FileImage,
      color: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
    },
    {
      id: 'pdf',
      name: 'เอกสาร PDF (Vector)',
      desc: 'ขยายได้ไม่แตก คมชัด พร้อมพิมพ์หรือแนบส่งงานอาจารย์',
      icon: FileText,
      color: 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
    },
    {
      id: 'json',
      name: 'โครงสร้างข้อมูล MindMap (JSON)',
      desc: 'ส่งออกเพื่อนำไปเปิดบนโปรแกรมอื่นหรือสำรองข้อมูลสำเนา',
      icon: Code,
      color: 'gw-badge'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="gw-popover rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-5 border-b gw-divider flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gw-badge flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 id="export-modal-title" className="font-bold text-base text-[var(--gw-text)]">
                ส่งออก Mind Map
              </h3>
              <p className="text-xs text-[var(--gw-text-muted)]">{mindMapTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {exportOptions.map((opt) => {
            const Icon = opt.icon;
            const isThisDownloading = downloading === opt.id;
            const isThisDownloaded = downloaded === opt.id;

            return (
              <div
                key={opt.id}
                className="p-4 rounded-xl border gw-divider hover:border-[var(--gw-accent)] transition-all flex items-center justify-between gap-3 group"
                style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${opt.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] transition-colors">
                      {opt.name}
                    </h4>
                    <p className="text-[11px] text-[var(--gw-text-muted)] mt-0.5">{opt.desc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExport(opt.id)}
                  disabled={isThisDownloading}
                  className="gw-button px-3.5 py-1.5 rounded-lg group-hover:bg-[var(--gw-accent)] group-hover:text-white group-hover:border-[var(--gw-accent)] text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  {isThisDownloading ? (
                    'กำลังดาวน์โหลด...'
                  ) : isThisDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--gw-positive)] group-hover:text-white" />
                      สำเร็จ!
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      ดาวน์โหลด
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div
          className="p-4 border-t gw-divider flex justify-end"
          style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="gw-button px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
