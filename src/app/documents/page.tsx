'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderOpen,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  FileText,
  FileCode,
  File,
  Clock,
  Sparkles,
  Trash2,
  Download,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  ArrowUpDown
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockDocuments } from '@/data/mockDocuments';
import { DocumentItem, FileType } from '@/types';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter & Sort
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || doc.fileType === selectedType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'size') return parseFloat(b.fileSize) - parseFloat(a.fileSize);
        return 0; // date default
      });
  }, [documents, searchQuery, selectedType, sortBy]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบเอกสาร "${name}" ใช่หรือไม่?`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setActiveMenuId(null);
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':
        return <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></div>;
      case 'docx':
        return <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></div>;
      case 'txt':
        return <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0"><FileCode className="w-5 h-5" /></div>;
      default:
        return <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center shrink-0"><File className="w-5 h-5" /></div>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold text-[#202033] tracking-tight">
              My Documents
            </h1>
            <p className="text-sm text-[#85859A] mt-1">
              จัดการเอกสารทั้งหมด ค้นหา กรองประเภทไฟล์ และส่งต่อให้ AI สรุปสาระสำคัญ
            </p>
          </div>

          <Link
            href="/documents/upload"
            className="px-5 py-2.5 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            + Upload Document
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9E9F1] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#85859A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาเอกสารตามชื่อไฟล์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs md:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl focus:outline-none focus:border-[#6558E8] focus:bg-white text-[#202033] placeholder-[#85859A]"
            />
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* File Type Filter */}
            <div className="flex items-center bg-[#F7F8FC] p-1 rounded-xl border border-[#E9E9F1] text-xs">
              {['all', 'pdf', 'docx', 'txt'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all uppercase ${
                    selectedType === t
                      ? 'bg-white text-[#6558E8] shadow-xs font-semibold'
                      : 'text-[#85859A] hover:text-[#202033]'
                  }`}
                >
                  {t === 'all' ? 'ทั้งหมด' : t}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="เรียงตาม"
                className="h-10 px-3 pr-8 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] text-xs font-medium text-[#4A4A68] focus:outline-none focus:border-[#6558E8] cursor-pointer"
              >
                <option value="date">เรียงตามวันที่ล่าสุด</option>
                <option value="name">เรียงตามชื่อ A-Z</option>
                <option value="size">เรียงตามขนาดไฟล์</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F7F8FC] p-1 rounded-xl border border-[#E9E9F1]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-[#6558E8] shadow-xs' : 'text-[#85859A]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-[#6558E8] shadow-xs' : 'text-[#85859A]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Documents Content */}
        {filteredDocuments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E9E9F1] p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#202033]">ไม่พบเอกสาร</h3>
            <p className="text-xs text-[#85859A] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `ไม่พบไฟล์ที่ตรงกับคำค้นหา "${searchQuery}" ลองปรับคำค้นหาหรือเลือกประเภทไฟล์ใหม่`
                : 'คุณยังไม่มีเอกสารในหมวดหมู่นี้ เริ่มต้นอัปโหลดเพื่อสรุป Mind Map ด้วย AI ได้ทันที'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl border border-[#E9E9F1] text-xs font-semibold text-[#4A4A68] hover:bg-[#F7F8FC]"
                >
                  ล้างคำค้นหา
                </button>
              )}
              <Link
                href="/documents/upload"
                className="px-4 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                อัปโหลดไฟล์ใหม่
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-[#E9E9F1] shadow-xs hover:shadow-md hover:border-[#6558E8]/40 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {getFileIcon(doc.fileType)}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#18A979]/10 text-[#18A979]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#18A979]" />
                      พร้อมใช้งาน
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#202033] group-hover:text-[#6558E8] transition-colors line-clamp-1">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-[#85859A] mt-1 line-clamp-2 leading-relaxed">
                    {doc.overview || 'ไม่มีคำอธิบายสรุปสำหรับเอกสารนี้'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E9E9F1]">
                  <div className="flex items-center justify-between text-xs text-[#85859A] mb-3">
                    <span>{doc.fileSize} • {doc.pageCount} หน้า</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {doc.uploadDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                      className="flex-1 py-2 rounded-xl bg-[#F0EFFF] text-[#6558E8] font-semibold text-xs hover:bg-[#6558E8] hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Open & Analyze
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="p-2 rounded-xl text-[#85859A] hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                      title="ลบเอกสาร"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Table */
          <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E9E9F1] text-[#85859A] font-semibold">
                  <th className="py-3.5 px-5">เอกสาร</th>
                  <th className="py-3.5 px-4">ขนาดไฟล์</th>
                  <th className="py-3.5 px-4">จำนวนหน้า</th>
                  <th className="py-3.5 px-4">วันที่อัปโหลด</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-5 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E9F1]">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#F7F8FC]/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.fileType)}
                        <div>
                          <p className="font-semibold text-sm text-[#202033]">{doc.name}</p>
                          <span className="text-[10px] text-[#85859A] uppercase">.{doc.fileType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A4A68]">{doc.fileSize}</td>
                    <td className="py-3.5 px-4 text-[#4A4A68]">{doc.pageCount} หน้า</td>
                    <td className="py-3.5 px-4 text-[#85859A]">{doc.uploadDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#18A979]/10 text-[#18A979]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#18A979]" />
                        พร้อมใช้งาน
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                          className="px-3 py-1.5 rounded-lg bg-[#6558E8] text-white hover:bg-[#5548D8] text-xs font-semibold flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          เปิดดู
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.name)}
                          className="p-1.5 rounded-lg text-[#85859A] hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

