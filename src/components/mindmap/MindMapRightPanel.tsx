'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Palette,
  Type,
  AlignLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { Node } from '@xyflow/react';

interface MindMapRightPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (id: string, updatedData: any) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const colorPresets = [
  '#6558E8', // Primary Violet
  '#8B7CF6', // Light Violet
  '#18A979', // Emerald
  '#F4AD43', // Amber
  '#E65B68', // Red
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#202033'  // Dark
];

export default function MindMapRightPanel({
  selectedNode,
  onUpdateNode,
  isCollapsed,
  onToggleCollapse
}: MindMapRightPanelProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6558E8');
  const [fontSize, setFontSize] = useState('14px');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      const data = selectedNode.data as any;
      setLabel(data.label || '');
      setDescription(data.description || '');
      setColor(data.color || '#6558E8');
      setFontSize(data.fontSize || '14px');
    }
  }, [selectedNode]);

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
      className={`relative z-10 bg-white border-l border-[#E9E9F1] transition-all duration-300 flex flex-col h-full shadow-xs ${
        isCollapsed ? 'w-12' : 'w-72 sm:w-80'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -left-3 top-5 z-20 w-6 h-6 bg-white border border-[#E9E9F1] rounded-full shadow-xs flex items-center justify-center text-[#85859A] hover:text-[#202033]"
        title={isCollapsed ? 'ขยายแผงตั้งค่า' : 'ย่อแผงตั้งค่า'}
      >
        {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center py-5 space-y-4">
          <button
            onClick={() => onToggleCollapse()}
            className="w-8 h-8 rounded-lg text-[#85859A] hover:bg-[#F7F8FC] flex items-center justify-center"
            title="ตั้งค่าโหนด"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#6558E8]" />
              <h3 className="font-bold text-xs text-[#202033] uppercase tracking-wider">
                Node Properties
              </h3>
            </div>
            {selectedNode && (
              <span className="text-[11px] font-semibold text-[#6558E8] bg-[#F0EFFF] px-2 py-0.5 rounded-md">
                {(selectedNode.data as any)?.level || 'Node'}
              </span>
            )}
          </div>

          {!selectedNode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#85859A]">
              <div className="w-12 h-12 rounded-xl bg-[#F7F8FC] flex items-center justify-center mb-3">
                <Sliders className="w-6 h-6 text-[#85859A]" />
              </div>
              <p className="text-xs font-semibold text-[#202033]">ยังไม่ได้เลือกโหนด</p>
              <p className="text-[11px] mt-1 text-[#85859A]">
                คลิกเลือกโหนดใดก็ได้บนแคนวาส เพื่อแก้ไขข้อความ สี และขนาดตัวอักษร
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A4A68] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#6558E8]" />
                  Node Title
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] font-medium focus:outline-none focus:border-[#6558E8] focus:bg-white"
                  placeholder="ชื่อโหนด..."
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A4A68] flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[#6558E8]" />
                  Description / คำอธิบาย
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] focus:outline-none focus:border-[#6558E8] focus:bg-white resize-none"
                  placeholder="เพิ่มคำอธิบายสรุปสำหรับโหนดนี้..."
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A4A68] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#6558E8]" />
                  Theme Color
                </label>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-8 rounded-lg transition-transform flex items-center justify-center ${
                        color === c ? 'ring-2 ring-offset-2 ring-[#6558E8] scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A4A68] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#6558E8]" />
                  Font Size
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl text-[#202033] focus:outline-none focus:border-[#6558E8]"
                >
                  <option value="12px">เล็ก (12px)</option>
                  <option value="14px">ปกติ (14px)</option>
                  <option value="16px">ปานกลาง (16px)</option>
                  <option value="18px">ใหญ่ (18px)</option>
                  <option value="20px">ใหญ่พิเศษ (20px)</option>
                </select>
              </div>

              {/* Parent Info */}
              <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] text-xs text-[#85859A]">
                <p className="font-semibold text-[#4A4A68]">Node ID: {selectedNode.id}</p>
                <p className="text-[11px] mt-0.5">ประเภท: {(selectedNode.data as any)?.level}</p>
              </div>

              {/* Apply Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6558E8] hover:bg-[#5548D8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
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

