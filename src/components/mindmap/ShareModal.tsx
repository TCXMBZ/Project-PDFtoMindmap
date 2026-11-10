'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Globe, Lock, Users, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mindMapTitle: string;
}

export default function ShareModal({ isOpen, onClose, mindMapTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mindmap.ai/m/shared-db';

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#E9E9F1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202033]">แชร์แผนผังความคิด</h3>
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

        <div className="p-5 space-y-4">
          {/* Permission selector */}
          <div className="p-3.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] space-y-2">
            <label className="text-xs font-semibold text-[#4A4A68] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#6558E8]" />
              สิทธิ์การเข้าถึงสำหรับทุกคนที่มีลิงก์
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAccessLevel('view')}
                className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                  accessLevel === 'view'
                    ? 'bg-white border-[#6558E8] text-[#6558E8] shadow-xs font-semibold'
                    : 'border-[#E9E9F1] text-[#85859A]'
                }`}
              >
                ดูได้อย่างเดียว (Viewer)
              </button>
              <button
                type="button"
                onClick={() => setAccessLevel('edit')}
                className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                  accessLevel === 'edit'
                    ? 'bg-white border-[#6558E8] text-[#6558E8] shadow-xs font-semibold'
                    : 'border-[#E9E9F1] text-[#85859A]'
                }`}
              >
                แก้ไขร่วมกันได้ (Editor)
              </button>
            </div>
          </div>

          {/* Copy Link input */}
          <div>
            <label className="text-xs font-semibold text-[#85859A] mb-1.5 block">
              ลิงก์สำหรับแชร์ (Public Link)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 h-10 px-3 text-xs bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#4A4A68] select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="h-10 px-4 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    คัดลอก
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Collaborator Mock */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-[#85859A] flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5" />
              ผู้ที่มีสิทธิ์เข้าถึงแล้ว
            </span>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-[#E9E9F1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#6558E8] text-white flex items-center justify-center font-bold text-[11px]">
                  ธ
                </div>
                <div>
                  <p className="font-semibold text-[#202033]">ธนพัฒน์ วงศ์สว่าง (คุณ)</p>
                  <p className="text-[10px] text-[#85859A]">เจ้าของ (Owner)</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#6558E8] bg-[#F0EFFF] px-2 py-0.5 rounded-md">
                Full Access
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E9E9F1] bg-[#F7F8FC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8]"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
}

