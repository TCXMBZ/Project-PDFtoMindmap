'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  FileText,
  GitFork,
  ArrowRight,
  Clock,
  UserCheck,
  Search,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

type SharedFilter = 'all' | 'mindmap' | 'document';

interface SharedItem {
  id: string;
  title: string;
  type: 'mindmap' | 'document';
  author: string;
  date: string;
  nodes?: number;
  pages?: number;
  href: string;
}

const SHARED_ITEMS: SharedItem[] = [
  {
    id: 'sh-1',
    title: 'Database Architecture & Normalization',
    type: 'mindmap',
    author: 'อาจารย์ ดร. สมศักดิ์ (ผู้สอน)',
    date: '20 ต.ค. 2026',
    nodes: 18,
    href: '/mindmaps/mm-1',
  },
  {
    id: 'sh-2',
    title: 'Software Development Life Cycle (SDLC) Group 4',
    type: 'mindmap',
    author: 'กิตติศักดิ์ & ทีมโครงงาน',
    date: '18 ต.ค. 2026',
    nodes: 14,
    href: '/mindmaps/mm-1',
  },
  {
    id: 'sh-3',
    title: 'Operating System Internals.pdf',
    type: 'document',
    author: 'ฝ่ายวิชาการ',
    date: '15 ต.ค. 2026',
    pages: 54,
    href: '/documents/doc-5/analyze',
  },
];

export default function SharedPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SharedFilter>('all');

  const filteredItems = useMemo(() => {
    return SHARED_ITEMS.filter((item) => {
      const matchesType = filter === 'all' || item.type === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [query, filter]);

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        {/* Header Panel */}
        <div className="gw-panel gw-reveal rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="gw-badge inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
                <Users className="w-3.5 h-3.5" />
                Collaboration
              </span>
              <h1 className="text-2xl font-extrabold text-[var(--gw-text)] mt-2 tracking-tight">
                Shared with me
              </h1>
              <p className="text-sm text-[var(--gw-text-muted)] mt-1">
                เอกสารและแผนผังความคิดที่อาจารย์หรือเพื่อนร่วมชั้นแชร์ให้คุณร่วมศึกษา
              </p>
            </div>

            {/* Filter Segment */}
            <div
              className="gw-segment inline-flex items-center p-1 rounded-xl gap-1 self-start sm:self-center"
              role="tablist"
              aria-label="กรองรายการที่แชร์"
            >
              {(
                [
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'mindmap', label: 'Mind Maps' },
                  { id: 'document', label: 'เอกสาร' },
                ] as const
              ).map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(tab.id)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'gw-segment-active'
                        : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="gw-search rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[var(--gw-text-subtle)] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อเอกสาร, แผนผังความคิด หรือผู้แชร์..."
              className="w-full bg-transparent text-xs sm:text-sm text-[var(--gw-text)] placeholder:text-[var(--gw-text-subtle)] focus:outline-none"
            />
          </div>
        </div>

        {/* Shared Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="gw-panel gw-reveal rounded-2xl p-10 text-center">
            <Users className="w-10 h-10 text-[var(--gw-text-subtle)] mx-auto mb-3" />
            <p className="font-semibold text-sm text-[var(--gw-text)]">
              ไม่พบรายการที่แชร์ที่ตรงกับการค้นหา
            </p>
            <p className="text-xs text-[var(--gw-text-muted)] mt-1">
              ลองเปลี่ยนคำค้นหาหรือเลือกดูทั้งหมด
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(item.href)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(item.href);
                  }
                }}
                className="gw-panel gw-reveal rounded-2xl p-5 hover:-translate-y-0.5 hover:border-[var(--gw-accent)] transition cursor-pointer flex flex-col justify-between group focus-visible:outline-2 focus-visible:outline-[var(--gw-accent)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="gw-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {item.type === 'mindmap' ? (
                        <GitFork className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      {item.type === 'mindmap'
                        ? `${item.nodes} โหนด`
                        : `${item.pages} หน้า`}
                    </span>
                    <span className="text-[11px] text-[var(--gw-text-subtle)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--gw-text-muted)] mt-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--gw-positive)] shrink-0" />
                    แชร์โดย:{' '}
                    <span className="font-medium text-[var(--gw-text)] truncate">
                      {item.author}
                    </span>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--gw-border)] flex items-center justify-between text-xs font-semibold text-[var(--gw-accent)]">
                  <span>เปิดดูข้อมูล</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
