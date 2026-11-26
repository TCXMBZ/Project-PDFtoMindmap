'use client';

import React, { useEffect, useState } from 'react';
import { X, Share2, Copy, Check, Globe, Users } from 'lucide-react';
import { mockUser } from '@/data/mockUser';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mindMapTitle: string;
}

export default function ShareModal({ isOpen, onClose, mindMapTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mindmap.ai/m/shared-db';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        aria-labelledby="share-modal-title"
        className="gw-popover rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-5 border-b gw-divider flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gw-badge flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="share-modal-title" className="font-bold text-base text-[var(--gw-text)]">
                แชร์แผนผังความคิด
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

        <div className="p-5 space-y-4">
          {/* Permission selector */}
          <div
            className="p-3.5 rounded-xl border gw-divider space-y-2"
            style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
          >
            <label className="text-xs font-semibold text-[var(--gw-text)] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
              สิทธิ์การเข้าถึงสำหรับทุกคนที่มีลิงก์
            </label>
            <div className="gw-segment grid grid-cols-2 gap-1.5 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setAccessLevel('view')}
                className={`py-2 px-3 rounded-lg font-medium transition cursor-pointer ${
                  accessLevel === 'view'
                    ? 'gw-segment-active font-semibold'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
              >
                ดูได้อย่างเดียว (Viewer)
              </button>
              <button
                type="button"
                onClick={() => setAccessLevel('edit')}
                className={`py-2 px-3 rounded-lg font-medium transition cursor-pointer ${
                  accessLevel === 'edit'
                    ? 'gw-segment-active font-semibold'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
              >
                แก้ไขร่วมกันได้ (Editor)
              </button>
            </div>
          </div>

          {/* Copy Link input */}
          <div>
            <label className="text-xs font-semibold text-[var(--gw-text-muted)] mb-1.5 block">
              ลิงก์สำหรับแชร์ (Public Link)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                aria-label="ลิงก์สำหรับแชร์"
                className="gw-search flex-1 h-10 px-3 text-xs rounded-xl text-[var(--gw-text)] select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="gw-button-primary h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
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
            <span className="text-xs font-semibold text-[var(--gw-text-muted)] flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5" />
              ผู้ที่มีสิทธิ์เข้าถึงแล้ว
            </span>
            <div
              className="flex items-center justify-between text-xs p-2.5 rounded-xl border gw-divider"
              style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[var(--gw-accent)] text-white flex items-center justify-center font-bold text-[11px]">
                  {mockUser.name.trim().charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-semibold text-[var(--gw-text)]">{mockUser.name} (คุณ)</p>
                  <p className="text-[10px] text-[var(--gw-text-muted)]">เจ้าของ (Owner)</p>
                </div>
              </div>
              <span className="gw-badge text-[10px] font-semibold px-2 py-0.5 rounded-md">
                Full Access
              </span>
            </div>
          </div>
        </div>

        <div
          className="p-4 border-t gw-divider flex justify-end"
          style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="gw-button-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
}
