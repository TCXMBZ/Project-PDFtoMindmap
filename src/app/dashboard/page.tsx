'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Upload,
  MessageSquare,
  FileText,
  GitFork,
  Sparkles,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Brain
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
  const router = useRouter();

  return (
    <AppLayout>
      <div className="space-y-7 pb-10">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#F0EFFF]/40 p-6 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#6558E8]">
                👋 สวัสดีคุณ {mockUser.name.split(' ')[0]}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202033] mt-1.5 tracking-tight">
              Welcome back!
            </h1>
            <p className="text-sm text-[#85859A] mt-1">
              จัดการเอกสารและสร้าง Mind Map ด้วยพลังของ AI เพื่อการเรียนรู้ที่มีประสิทธิภาพ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/documents/upload"
              className="px-4 py-2.5 rounded-xl border border-[#E9E9F1] bg-white text-xs font-semibold text-[#4A4A68] hover:bg-[#F7F8FC] hover:border-[#6558E8]/40 transition-all flex items-center gap-2 shadow-xs"
            >
              <Upload className="w-4 h-4 text-[#6558E8]" />
              อัปโหลดเอกสาร
            </Link>
            <Link
              href="/mindmaps/mm-1"
              className="px-5 py-2.5 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              + Create New Mind Map
            </Link>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value="6 ไฟล์"
            change="+2 สัปดาห์นี้"
            icon={FileText}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Total Mind Maps"
            value="4 แผนผัง"
            change="+1 สร้างเมื่อวาน"
            icon={GitFork}
            iconBg="bg-[#F0EFFF]"
            iconColor="text-[#6558E8]"
          />
          <StatCard
            title="AI Summaries"
            value="28 สรุป"
            change="ความแม่นยำ 98.4%"
            icon={Sparkles}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            title="Study Activities"
            value="15 เซสชัน"
            change="+4 แบบทดสอบผ่าน"
            icon={GraduationCap}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </div>

        {/* Quick Actions Bar */}
        <div>
          <h2 className="text-sm font-bold text-[#85859A] uppercase tracking-wider mb-3">
            การทำงานด่วน (Quick Actions)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/documents/upload"
              className="p-5 rounded-2xl bg-white border border-[#E9E9F1] hover:border-[#6558E8] hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#202033] group-hover:text-[#6558E8] transition-colors flex items-center justify-between">
                  Upload Document
                  <ArrowRight className="w-4 h-4 text-[#85859A] group-hover:text-[#6558E8] group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-[#85859A] mt-1">
                  อัปโหลดไฟล์ PDF, DOCX, TXT เพื่อให้ AI วิเคราะห์
                </p>
              </div>
            </Link>

            <Link
              href="/mindmaps/mm-1"
              className="p-5 rounded-2xl bg-white border border-[#E9E9F1] hover:border-[#6558E8] hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#202033] group-hover:text-[#6558E8] transition-colors flex items-center justify-between">
                  Create Mind Map
                  <ArrowRight className="w-4 h-4 text-[#85859A] group-hover:text-[#6558E8] group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-[#85859A] mt-1">
                  เปิด Canvas สร้างหรือปรับแต่งโหนดด้วย React Flow
                </p>
              </div>
            </Link>

            <Link
              href="/chat"
              className="p-5 rounded-2xl bg-white border border-[#E9E9F1] hover:border-[#6558E8] hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#202033] group-hover:text-[#6558E8] transition-colors flex items-center justify-between">
                  Ask AI
                  <ArrowRight className="w-4 h-4 text-[#85859A] group-hover:text-[#6558E8] group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-[#85859A] mt-1">
                  พูดคุย สอบถาม และเจาะลึกเนื้อหาเอกสารกับ AI
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Learning Analytics Chart */}
        <ActivityChart />

        {/* Recent Documents Table */}
        <RecentDocumentsTable documents={mockDocuments} />

        {/* Recent Mind Maps Grid */}
        <RecentMindMapsGrid mindmaps={mockMindMapsList} />
      </div>
    </AppLayout>
  );
}

