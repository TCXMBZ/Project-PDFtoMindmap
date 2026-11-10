'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GitFork,
  Plus,
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Trash2,
  Share2,
  FolderOpen
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockMindMapsList } from '@/data/mockMindMaps';
import { MindMapItem } from '@/types';

export default function MindMapsListPage() {
  const router = useRouter();
  const [mindmaps, setMindmaps] = useState<MindMapItem[]>(mockMindMapsList);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mindmaps.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.documentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบแผนผังความคิด "${title}" ใช่หรือไม่?`)) {
      setMindmaps((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold text-[#202033] tracking-tight">
              My Mind Maps
            </h1>
            <p className="text-sm text-[#85859A] mt-1">
              แผนผังความคิดทั้งหมดที่คุณสร้างหรือ AI สร้างขึ้นอัตโนมัติจากเอกสาร
            </p>
          </div>

          <Link
            href="/mindmaps/mm-1"
            className="px-5 py-2.5 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            + New Mind Map
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9E9F1] shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#85859A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหา Mind Map ตามชื่อหรือเอกสารอ้างอิง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs md:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl focus:outline-none focus:border-[#6558E8] focus:bg-white text-[#202033]"
            />
          </div>
          <span className="text-xs text-[#85859A] hidden sm:inline">
            แสดง {filtered.length} จาก {mindmaps.length} รายการ
          </span>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E9E9F1] p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center mx-auto mb-4">
              <GitFork className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#202033]">ไม่พบแผนผังความคิด</h3>
            <p className="text-xs text-[#85859A] mt-1">ลองเปลี่ยนคำค้นหา หรือสร้าง Mind Map ใหม่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-[#E9E9F1] shadow-xs hover:shadow-lg hover:border-[#6558E8]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#F0EFFF] text-[#6558E8]">
                      <GitFork className="w-3.5 h-3.5" />
                      {item.nodeCount} โหนด
                    </span>
                    <span className="text-[11px] text-[#85859A] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.lastModified}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#202033] group-hover:text-[#6558E8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#85859A] mt-1 flex items-center gap-1 truncate">
                    <FolderOpen className="w-3.5 h-3.5 text-[#85859A]" />
                    {item.documentName}
                  </p>

                  {/* Node Preview Pills */}
                  <div className="mt-4 pt-3 border-t border-[#E9E9F1] flex flex-wrap gap-1.5">
                    {item.previewNodes.map((n, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F7F8FC] border border-[#E9E9F1] text-[#4A4A68]"
                      >
                        • {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E9E9F1] flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 text-[#85859A] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="ลบแผนผัง"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => router.push(`/mindmaps/${item.id}`)}
                    className="px-4 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    เปิดแก้ไข
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

