'use client';

import React, { useRef, useState } from 'react';
import {
  Sliders,
  Palette,
  Type,
  AlignLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  Layers,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Node } from '@xyflow/react';

const MIN_WIDTH = 200;
const MAX_WIDTH = 420;
const DEFAULT_RIGHT_WIDTH = 300;
const COMPACT_WIDTH = 216;
const STANDARD_WIDTH = 300;

function clampWidth(value: number): number {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)));
}

interface MindMapRightPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (id: string, updatedData: Record<string, unknown>) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width?: number;
  onWidthChange?: (w: number) => void;
}

const colorPresets = [
  '#0f766e', // Teal Accent
  '#10b981', // Emerald
  '#6558E8', // Violet
  '#3B82F6', // Blue
  '#F4AD43', // Amber
  '#E65B68', // Rose
  '#EC4899', // Pink
  '#1e293b'  // Slate Dark
];

const fontSizeOptions = [
  { value: '12px', label: '12', title: 'เล็ก (12px)' },
  { value: '14px', label: '14', title: 'ปกติ (14px)' },
  { value: '16px', label: '16', title: 'ปานกลาง (16px)' },
  { value: '18px', label: '18', title: 'ใหญ่ (18px)' },
  { value: '20px', label: '20', title: 'ใหญ่พิเศษ (20px)' }
];

export default function MindMapRightPanel({
  selectedNode,
  onUpdateNode,
  isCollapsed,
  onToggleCollapse,
  width,
  onWidthChange
}: MindMapRightPanelProps) {
  const initialData = (selectedNode?.data ?? {}) as Record<string, unknown>;
  const [label, setLabel] = useState((initialData.label as string) || '');
  const [description, setDescription] = useState((initialData.description as string) || '');
  const [color, setColor] = useState((initialData.color as string) || 'var(--gw-accent)');
  const [fontSize, setFontSize] = useState((initialData.fontSize as string) || '14px');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [internalWidth, setInternalWidth] = useState(() =>
    clampWidth(width ?? DEFAULT_RIGHT_WIDTH)
  );
  const [isResizing, setIsResizing] = useState(false);
  const dragStateRef = useRef<{
    startX: number;
    startWidth: number;
    pointerId: number;
  } | null>(null);

  const currentWidth = clampWidth(
    onWidthChange && width !== undefined ? width : internalWidth
  );
  const isCompact = currentWidth <= 240;

  const updateWidth = (next: number) => {
    const clamped = clampWidth(next);
    if (onWidthChange) {
      onWidthChange(clamped);
    }
    if (!onWidthChange || width === undefined) {
      setInternalWidth(clamped);
    }
  };

  const handleToggleWidthPreset = () => {
    updateWidth(isCompact ? STANDARD_WIDTH : COMPACT_WIDTH);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      startX: e.clientX,
      startWidth: currentWidth,
      pointerId: e.pointerId
    };
    setIsResizing(true);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    const delta = dragStateRef.current.startX - e.clientX;
    updateWidth(dragStateRef.current.startWidth + delta);
  };

  const handleResizePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
    setIsResizing(false);
  };

  const handleResizeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateWidth(currentWidth + 16);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateWidth(currentWidth - 16);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;
    onUpdateNode(selectedNode.id, {
      label,
      description,
      color,
      fontSize
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  return (
    <div
      style={{ '--panel-width': `${currentWidth}px` } as React.CSSProperties}
      className={`gw-panel rounded-2xl relative z-10 flex flex-col h-full ${
        isResizing ? 'transition-none' : 'transition-all duration-300'
      } ${isCollapsed ? 'w-12' : 'w-full md:w-[var(--panel-width)]'}`}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="gw-glass absolute right-2 top-3 md:-left-3 md:right-auto md:top-5 z-30 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] cursor-pointer"
        title={isCollapsed ? 'ขยายแผงตั้งค่า' : 'ย่อแผงตั้งค่า'}
        aria-label={isCollapsed ? 'ขยายแผงตั้งค่า' : 'ย่อแผงตั้งค่า'}
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4 md:w-3.5 md:h-3.5" /> : <ChevronRight className="w-4 h-4 md:w-3.5 md:h-3.5" />}
      </button>

      {/* Desktop Inner-Edge Resize Handle */}
      {!isCollapsed && (
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="ปรับความกว้างแผงตั้งค่าโหนด"
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          aria-valuenow={currentWidth}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerEnd}
          onPointerCancel={handleResizePointerEnd}
          onKeyDown={handleResizeKeyDown}
          className="hidden md:flex items-center justify-center absolute top-14 bottom-4 -left-1.5 w-3 z-20 cursor-col-resize touch-none select-none group/resize focus:outline-none"
        >
          <div
            className={`w-1 h-10 rounded-full transition-all ${
              isResizing
                ? 'bg-[var(--gw-accent)] opacity-100 scale-y-110'
                : 'bg-[var(--gw-border-strong)] opacity-0 group-hover/resize:opacity-100 group-focus-visible/resize:opacity-100'
            }`}
          />
        </div>
      )}

      {isCollapsed ? (
        <div className="flex flex-col items-center py-5 gap-2">
          <button
            type="button"
            onClick={() => onToggleCollapse()}
            className="w-10 h-10 rounded-lg text-[var(--gw-text-muted)] hover:bg-[var(--gw-accent-soft)] flex items-center justify-center cursor-pointer"
            title="ตั้งค่าโหนด"
            aria-label="ตั้งค่าโหนด"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-3 pr-11 md:pr-0 md:pl-2 border-b gw-divider">
            <div className="flex items-center gap-2 min-w-0">
              <Sliders className="w-4 h-4 text-[var(--gw-accent)] shrink-0" />
              <h3 className="font-bold text-xs text-[var(--gw-text)] uppercase tracking-wider truncate">
                Node Properties
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {selectedNode && (
                <span className="gw-badge text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  {String((selectedNode.data as Record<string, unknown>)?.level || 'Node')}
                </span>
              )}
              <button
                type="button"
                onClick={handleToggleWidthPreset}
                className="hidden md:inline-flex items-center justify-center min-w-[36px] min-h-[36px] rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-colors cursor-pointer"
                title={isCompact ? `ขยายแผง (${STANDARD_WIDTH}px)` : `ย่อแผง (${COMPACT_WIDTH}px)`}
                aria-label={isCompact ? `ปรับความกว้างเป็นมาตรฐาน ${STANDARD_WIDTH} พิกเซล` : `ปรับความกว้างเป็นกะทัดรัด ${COMPACT_WIDTH} พิกเซล`}
              >
                {isCompact ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!selectedNode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[var(--gw-text-muted)]">
              <div className="w-12 h-12 rounded-xl gw-glass flex items-center justify-center mb-3">
                <Sliders className="w-6 h-6 text-[var(--gw-text-muted)]" />
              </div>
              <p className="text-xs font-semibold text-[var(--gw-text)]">ยังไม่ได้เลือกโหนด</p>
              <p className="text-[11px] mt-1 text-[var(--gw-text-muted)]">
                คลิกเลือกโหนดใดก็ได้บนแคนวาส เพื่อแก้ไขข้อความ สี และขนาดตัวอักษร
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text)] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  Node Title
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="gw-search w-full min-h-[44px] px-3 py-2 text-xs rounded-xl text-[var(--gw-text)] font-medium focus:outline-none"
                  placeholder="ชื่อโหนด..."
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text)] flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  Description / คำอธิบาย
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="gw-search w-full px-3 py-2 text-xs rounded-xl text-[var(--gw-text)] focus:outline-none resize-none"
                  placeholder="เพิ่มคำอธิบายสรุปสำหรับโหนดนี้..."
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text)] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  Theme Color
                </label>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-label={`เลือกสี ${c}`}
                      aria-pressed={color === c}
                      className={`min-w-[36px] min-h-[36px] rounded-lg transition-transform flex items-center justify-center cursor-pointer ${
                        color === c ? 'ring-2 ring-offset-2 ring-[var(--gw-accent)] scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--gw-text)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                  Font Size
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1" role="group" aria-label="ขนาดตัวอักษร">
                  {fontSizeOptions.map((opt) => {
                    const isActive = fontSize === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSize(opt.value)}
                        title={opt.title}
                        aria-label={`ขนาดตัวอักษร ${opt.title}`}
                        aria-pressed={isActive}
                        className={`min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[var(--gw-accent)] text-white shadow-xs'
                            : 'gw-button text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parent Info */}
              <div
                className="p-3 rounded-xl border gw-divider text-xs text-[var(--gw-text-muted)]"
                style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
              >
                <p className="font-semibold text-[var(--gw-text)]">Node ID: {selectedNode.id}</p>
                <p className="text-[11px] mt-0.5">
                  ประเภท: {String((selectedNode.data as Record<string, unknown>)?.level || '')}
                </p>
              </div>

              {/* Apply Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  aria-label="บันทึกการเปลี่ยนแปลงโหนด"
                  className="gw-button-primary w-full min-h-[44px] py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      บันทึกการแก้ไขแล้ว!
                    </>
                  ) : (
                    'Apply Changes'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
