'use client';

import React, { useState } from 'react';
import { X, Download, FileImage, FileText, Code, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mindMapTitle: string;
}

export default function ExportModal({ isOpen, onClose, mindMapTitle }: ExportModalProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

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
      color: 'bg-emerald-50 text-[#18A979]'
    },
    {
      id: 'pdf',
      name: 'เอกสาร PDF (Vector)',
      desc: 'ขยายได้ไม่แตก คมชัด พร้อมพิมพ์หรือแนบส่งงานอาจารย์',
      icon: FileText,
      color: 'bg-red-50 text-red-500'
    },
    {
      id: 'json',
      name: 'โครงสร้างข้อมูล MindMap (JSON)',
      desc: 'ส่งออกเพื่อนำไปเปิดบนโปรแกรมอื่นหรือสำรองข้อมูลสำเนา',
      icon: Code,
      color: 'bg-[#F0EFFF] text-[#6558E8]'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#E9E9F1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202033]">ส่งออก Mind Map</h3>
              <p className="text-xs text-[#85859A]">{mindMapTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#85859A] hover:bg-[#F7F8FC]"
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
                className="p-4 rounded-xl border border-[#E9E9F1] hover:border-[#6558E8] hover:bg-[#F7F8FC] transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${opt.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#202033] group-hover:text-[#6558E8] transition-colors">
                      {opt.name}
                    </h4>
                    <p className="text-[11px] text-[#85859A] mt-0.5">{opt.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleExport(opt.id)}
                  disabled={isThisDownloading}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E9E9F1] group-hover:bg-[#6558E8] group-hover:text-white group-hover:border-[#6558E8] text-xs font-semibold text-[#4A4A68] transition-all shrink-0 flex items-center gap-1.5"
                >
                  {isThisDownloading ? (
                    'กำลังดาวน์โหลด...'
                  ) : isThisDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
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

        <div className="p-4 border-t border-[#E9E9F1] bg-[#F7F8FC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A4A68] hover:bg-[#E9E9F1]"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

