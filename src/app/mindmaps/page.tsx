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
  Trash2,
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
        <div className="gw-panel gw-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--gw-text)] tracking-tight">
              My Mind Maps
            </h1>
            <p className="text-sm text-[var(--gw-text-muted)] mt-1">
              แผนผังความคิดทั้งหมดที่คุณสร้างหรือ AI สร้างขึ้นอัตโนมัติจากเอกสาร
            </p>
          </div>

          <Link
            href="/mindmaps/mm-1"
            className="gw-button-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Mind Map
          </Link>
        </div>

        {/* Search */}
        <div className="gw-panel gw-reveal p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="gw-search relative flex-1 rounded-xl">
            <Search className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหา Mind Map ตามชื่อหรือเอกสารอ้างอิง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs md:text-sm bg-transparent focus:outline-none text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)]"
            />
          </div>
          <span className="text-xs text-[var(--gw-text-muted)] hidden sm:inline">
            แสดง {filtered.length} จาก {mindmaps.length} รายการ
          </span>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="gw-panel gw-reveal rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl gw-badge flex items-center justify-center mx-auto mb-4">
              <GitFork className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[var(--gw-text)]">ไม่พบแผนผังความคิด</h3>
            <p className="text-xs text-[var(--gw-text-muted)] mt-1">ลองเปลี่ยนคำค้นหา หรือสร้าง Mind Map ใหม่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="gw-panel gw-reveal rounded-2xl p-5 hover:border-[var(--gw-accent)] transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="gw-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold">
                      <GitFork className="w-3.5 h-3.5" />
                      {item.nodeCount} โหนด
                    </span>
                    <span className="text-[11px] text-[var(--gw-text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.lastModified}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--gw-text-muted)] mt-1 flex items-center gap-1 truncate">
                    <FolderOpen className="w-3.5 h-3.5 text-[var(--gw-text-muted)] shrink-0" />
                    {item.documentName}
                  </p>

                  {/* Node Preview Pills */}
                  <div className="mt-4 pt-3 border-t gw-divider flex flex-wrap gap-1.5">
                    {item.previewNodes.map((n, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg border gw-divider text-[var(--gw-text-muted)]"
                        style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
                      >
                        • {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t gw-divider flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 text-[var(--gw-text-muted)] hover:text-[var(--gw-danger)] rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="ลบแผนผัง"
                    aria-label={`ลบแผนผัง ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push(`/mindmaps/${item.id}`)}
                    className="gw-button-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
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
