'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Upload,
  MessageSquare,
  FileText,
  GitFork,
  Sparkles,
  GraduationCap,
  ArrowRight,
  HardDrive,
  Layers,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentDocumentsTable from '@/components/dashboard/RecentDocumentsTable';
import RecentMindMapsGrid from '@/components/dashboard/RecentMindMapsGrid';
import { mockDocuments } from '@/data/mockDocuments';
import { mockMindMapsList } from '@/data/mockMindMaps';
import { mockUser } from '@/data/mockUser';

export default function DashboardPage() {
  const firstName = mockUser.name.split(' ')[0];

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Top Header Row */}
        <div className="gw-panel gw-reveal rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="gw-badge inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                สวัสดีคุณ {firstName}
              </span>
              <span className="text-xs font-medium text-[var(--gw-text-subtle)]">
                {mockUser.plan}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--gw-text)] mt-2 tracking-tight">
              Overview
            </h1>
            <p className="text-sm text-[var(--gw-text-muted)] mt-1">
              จัดการเอกสารและสร้าง Mind Map ด้วยพลังของ AI เพื่อการเรียนรู้ที่มีประสิทธิภาพ
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/documents/upload"
              className="cursor-pointer gw-button px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-[var(--gw-accent)]" />
              อัปโหลดเอกสาร
            </Link>
            <Link
              href="/mindmaps/mm-1"
              className="cursor-pointer gw-button-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Mind Map
            </Link>
          </div>
        </div>

        {/* Overview Asymmetric Grid (0.82fr 1.5fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.5fr] gap-5 items-stretch">
          {/* Left Hero Summary Panel */}
          <div className="gw-panel gw-reveal rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gw-accent-soft)] text-[var(--gw-accent)] border border-[var(--gw-border)] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-[var(--gw-text)]">
                      Workspace Summary
                    </h2>
                    <p className="text-xs text-[var(--gw-text-muted)]">
                      ภาพรวมคลังความรู้ของคุณ
                    </p>
                  </div>
                </div>
                <span className="gw-positive px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <div className="rounded-xl p-3 bg-[rgba(var(--gw-surface-rgb),0.48)] border border-[var(--gw-border)]">
                  <p className="text-[11px] text-[var(--gw-text-muted)]">เอกสาร</p>
                  <p className="text-lg font-bold text-[var(--gw-text)] mt-0.5">
                    {mockDocuments.length}
                  </p>
                </div>
                <div className="rounded-xl p-3 bg-[rgba(var(--gw-surface-rgb),0.48)] border border-[var(--gw-border)]">
                  <p className="text-[11px] text-[var(--gw-text-muted)]">Mind Maps</p>
                  <p className="text-lg font-bold text-[var(--gw-text)] mt-0.5">
                    {mockMindMapsList.length}
                  </p>
                </div>
                <div className="rounded-xl p-3 bg-[rgba(var(--gw-surface-rgb),0.48)] border border-[var(--gw-border)]">
                  <p className="text-[11px] text-[var(--gw-text-muted)]">AI สรุป</p>
                  <p className="text-lg font-bold text-[var(--gw-text)] mt-0.5">28</p>
                </div>
              </div>

              {/* Storage mini-card */}
              <div className="mt-4 rounded-xl p-3.5 bg-[rgba(var(--gw-surface-rgb),0.48)] border border-[var(--gw-border)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--gw-text)] inline-flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                    พื้นที่จัดเก็บ
                  </span>
                  <span className="text-[var(--gw-text-muted)]">
                    {mockUser.storageUsed} / {mockUser.storageLimit}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[rgba(var(--gw-surface-rgb),0.6)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--gw-accent)]"
                    style={{ width: '8.5%' }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Workspace Links */}
            <div className="space-y-2 pt-2 border-t border-[var(--gw-border)]">
              <Link
                href="/documents"
                className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-[rgba(var(--gw-surface-rgb),0.55)] transition-colors group"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-[var(--gw-text)]">
                  <FileText className="w-4 h-4 text-[var(--gw-accent)]" />
                  จัดการเอกสารทั้งหมด
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--gw-text-subtle)] group-hover:text-[var(--gw-accent)] group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                href="/mindmaps"
                className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-[rgba(var(--gw-surface-rgb),0.55)] transition-colors group"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-[var(--gw-text)]">
                  <GitFork className="w-4 h-4 text-[var(--gw-accent)]" />
                  คลัง Mind Maps
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--gw-text-subtle)] group-hover:text-[var(--gw-accent)] group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                href="/chat"
                className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-[rgba(var(--gw-surface-rgb),0.55)] transition-colors group"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-[var(--gw-text)]">
                  <MessageSquare className="w-4 h-4 text-[var(--gw-accent)]" />
                  ถาม AI จากเอกสาร
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--gw-text-subtle)] group-hover:text-[var(--gw-accent)] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Right Activity Chart Panel */}
          <div className="gw-reveal">
            <ActivityChart />
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="gw-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value={`${mockDocuments.length} ไฟล์`}
            change="+2 สัปดาห์นี้"
            icon={FileText}
            iconBg="bg-sky-500/12"
            iconColor="text-sky-500"
          />
          <StatCard
            title="Total Mind Maps"
            value={`${mockMindMapsList.length} แผนผัง`}
            change="+1 เมื่อวาน"
            icon={GitFork}
            iconBg="bg-[var(--gw-accent-soft)]"
            iconColor="text-[var(--gw-accent)]"
          />
          <StatCard
            title="AI Summaries"
            value="28 สรุป"
            change="98.4% แม่นยำ"
            icon={Sparkles}
            iconBg="bg-amber-500/12"
            iconColor="text-amber-500"
          />
          <StatCard
            title="Study Activities"
            value="15 เซสชัน"
            change="+4 แบบทดสอบ"
            icon={GraduationCap}
            iconBg="bg-emerald-500/12"
            iconColor="text-emerald-500"
          />
        </div>

        {/* Lower Asymmetric Grid (1.3fr 1fr) */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-5 items-start">
          <div className="gw-reveal">
            <RecentDocumentsTable documents={mockDocuments} />
          </div>
          <div className="gw-reveal">
            <RecentMindMapsGrid mindmaps={mockMindMapsList} compact />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
