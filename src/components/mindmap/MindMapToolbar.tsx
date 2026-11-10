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
  Edit2
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
  isAiGenerating
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
    <div className="h-[64px] bg-white border-b border-[#E9E9F1] px-4 flex items-center justify-between gap-3 shrink-0 shadow-xs z-20">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/mindmaps"
          className="p-2 rounded-xl text-[#85859A] hover:text-[#202033] hover:bg-[#F7F8FC] border border-[#E9E9F1] shrink-0"
          title="กลับไปหน้ารวม Mind Maps"
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
              className="text-sm font-bold text-[#202033] px-2 py-1 rounded-lg border border-[#6558E8] outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#202033] hover:text-[#6558E8] transition-colors truncate max-w-[200px] sm:max-w-xs md:max-w-md group"
              title="คลิกเพื่อเปลี่ยนชื่อ"
            >
              <span className="truncate">{title}</span>
              <Edit2 className="w-3.5 h-3.5 text-[#85859A] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {/* Save status badge */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#18A979] bg-[#18A979]/10 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            {isSaved ? 'บันทึกแล้ว' : 'กำลังแก้ไข...'}
          </span>
        </div>
      </div>

      {/* Center: Controls (Undo/Redo & Zoom) */}
      <div className="hidden md:flex items-center gap-1 bg-[#F7F8FC] p-1 rounded-xl border border-[#E9E9F1]">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg text-[#85859A] hover:text-[#202033] hover:bg-white disabled:opacity-40 transition-colors"
          title="เลิกทำ (Undo)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg text-[#85859A] hover:text-[#202033] hover:bg-white disabled:opacity-40 transition-colors"
          title="ทำซ้ำ (Redo)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[#E9E9F1] mx-1" />

        <button
          onClick={onZoomOut}
          className="p-1.5 rounded-lg text-[#85859A] hover:text-[#202033] hover:bg-white transition-colors"
          title="ย่อมุมมอง (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomIn}
          className="p-1.5 rounded-lg text-[#85859A] hover:text-[#202033] hover:bg-white transition-colors"
          title="ขยายมุมมอง (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onFitView}
          className="p-1.5 rounded-lg text-[#85859A] hover:text-[#202033] hover:bg-white transition-colors"
          title="จัดพอดีหน้าจอ (Fit View)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* AI Generate Mind Map button */}
        <button
          onClick={onAiGenerate}
          disabled={isAiGenerating}
          className="hidden lg:flex px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6558E8] to-[#8B7CF6] text-white text-xs font-semibold hover:opacity-95 transition-all items-center gap-1.5 shadow-xs"
          title="จัดโครงสร้างอัตโนมัติด้วย AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isAiGenerating ? 'กำลังวิเคราะห์...' : 'AI Generate'}
        </button>

        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-xl border border-[#E9E9F1] bg-white hover:bg-[#F7F8FC] text-xs font-semibold text-[#4A4A68] transition-colors flex items-center gap-1.5"
          title="ส่งออก Mind Map"
        >
          <Download className="w-3.5 h-3.5 text-[#6558E8]" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onOpenShare}
          className="px-3 py-1.5 rounded-xl border border-[#E9E9F1] bg-white hover:bg-[#F7F8FC] text-xs font-semibold text-[#4A4A68] transition-colors flex items-center gap-1.5"
          title="แชร์ลิงก์"
        >
          <Share2 className="w-3.5 h-3.5 text-[#6558E8]" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={onSave}
          className="px-4 py-1.5 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}

