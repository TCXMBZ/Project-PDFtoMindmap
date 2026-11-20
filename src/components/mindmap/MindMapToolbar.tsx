'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  CheckCircle2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Share2,
  Save,
  Sparkles,
  Edit2,
  LayoutGrid
} from 'lucide-react';

interface MindMapToolbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  isSaved: boolean;
  onOpenExport: () => void;
  onOpenShare: () => void;
  onAiGenerate: () => void;
  isAiGenerating: boolean;
  onAutoLayout?: () => void;
}

export default function MindMapToolbar({
  title,
  onTitleChange,
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  isSaved,
  onOpenExport,
  onOpenShare,
  onAiGenerate,
  isAiGenerating,
  onAutoLayout
}: MindMapToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (currentTitle.trim()) {
      onTitleChange(currentTitle.trim());
    } else {
      setCurrentTitle(title);
    }
  };

  return (
    <div className="gw-glass min-h-[56px] rounded-2xl px-3 sm:px-4 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 sm:gap-3 z-20 max-w-full">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/mindmaps"
          className="gw-button min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px] p-2 rounded-xl text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          title="กลับไปหน้ารวม Mind Maps"
          aria-label="กลับไปหน้ารวม Mind Maps"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="gw-search min-h-[44px] sm:min-h-[36px] text-sm font-bold text-[var(--gw-text)] px-2.5 py-1 rounded-lg outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentTitle(title);
                setIsEditingTitle(true);
              }}
              className="min-h-[44px] sm:min-h-[36px] flex items-center gap-2 text-sm sm:text-base font-bold text-[var(--gw-text)] hover:text-[var(--gw-accent)] transition-colors truncate max-w-[180px] sm:max-w-xs md:max-w-md group cursor-pointer"
              title="คลิกเพื่อเปลี่ยนชื่อ"
            >
              <span className="truncate">{title}</span>
              <Edit2 className="w-3.5 h-3.5 text-[var(--gw-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          )}

          {/* Save status badge */}
          <span className="gw-positive hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            {isSaved ? 'บันทึกแล้ว' : 'กำลังแก้ไข...'}
          </span>
        </div>
      </div>

      {/* Center: Controls (Undo/Redo & Zoom) */}
      <div className="gw-segment flex items-center gap-1 p-1 rounded-xl">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="min-h-[44px] sm:min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          title="เลิกทำ (Undo)"
          aria-label="เลิกทำ"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="min-h-[44px] sm:min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          title="ทำซ้ำ (Redo)"
          aria-label="ทำซ้ำ"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[var(--gw-border)] mx-1" />

        <button
          type="button"
          onClick={onZoomOut}
          className="min-h-[44px] sm:min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          title="ย่อมุมมอง (Zoom Out)"
          aria-label="ย่อมุมมอง"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          className="min-h-[44px] sm:min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          title="ขยายมุมมอง (Zoom In)"
          aria-label="ขยายมุมมอง"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onFitView}
          className="min-h-[44px] sm:min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          title="จัดพอดีหน้าจอ (Fit View)"
          aria-label="จัดพอดีหน้าจอ"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {onAutoLayout && (
          <button
            type="button"
            onClick={onAutoLayout}
            className="gw-button min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            title="จัดเรียงผังอัตโนมัติ"
            aria-label="จัดเรียงผังอัตโนมัติ"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
            <span className="hidden sm:inline">จัดเรียง</span>
          </button>
        )}

        {/* AI Generate Mind Map button */}
        <button
          type="button"
          onClick={onAiGenerate}
          disabled={isAiGenerating}
          className="gw-button-primary hidden lg:flex min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          title="จัดโครงสร้างอัตโนมัติด้วย AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isAiGenerating ? 'กำลังวิเคราะห์...' : 'AI Generate'}
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="gw-button min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          title="ส่งออก Mind Map"
        >
          <Download className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          type="button"
          onClick={onOpenShare}
          className="gw-button min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          title="แชร์ลิงก์"
        >
          <Share2 className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          className="gw-button-primary min-h-[44px] sm:min-h-[36px] px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
