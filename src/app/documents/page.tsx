'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderOpen,
  Upload,
  Search,
  Grid,
  List,
  FileText,
  FileCode,
  File,
  Clock,
  Sparkles,
  Trash2
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockDocuments } from '@/data/mockDocuments';
import { DocumentItem, FileType } from '@/types';

const SIZE_UNITS: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
};

function parseFileSizeToBytes(sizeStr: string): number {
  const match = sizeStr.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
  if (!match) return parseFloat(sizeStr) || 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return value * (SIZE_UNITS[unit] ?? 1);
}

const THAI_MONTHS: Record<string, number> = {
  'ม.ค.': 0,
  'ก.พ.': 1,
  'มี.ค.': 2,
  'เม.ย.': 3,
  'พ.ค.': 4,
  'มิ.ย.': 5,
  'ก.ค.': 6,
  'ส.ค.': 7,
  'ก.ย.': 8,
  'ต.ค.': 9,
  'พ.ย.': 10,
  'ธ.ค.': 11
};

function parseDocumentDate(dateStr: string): number {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = THAI_MONTHS[parts[1]];
    let year = parseInt(parts[2], 10);
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      if (year > 2400) year -= 543;
      return new Date(year, month, day).getTime();
    }
  }
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        if (sortBy === 'size') {
          return parseFileSizeToBytes(b.fileSize) - parseFileSizeToBytes(a.fileSize);
        }
        return parseDocumentDate(b.uploadDate) - parseDocumentDate(a.uploadDate);
      });
  }, [documents, searchQuery, selectedType, sortBy]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบเอกสาร "${name}" ใช่หรือไม่?`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'docx':
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'txt':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 gw-badge"
          >
            <File className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="gw-panel gw-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--gw-text)]">
              My Documents
            </h1>
            <p className="text-sm text-[var(--gw-text-muted)] mt-1">
              จัดการเอกสารทั้งหมด ค้นหา กรองประเภทไฟล์ และส่งต่อให้ AI สรุปสาระสำคัญ
            </p>
          </div>

          <Link
            href="/documents/upload"
            className="gw-button-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="gw-panel gw-reveal p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search */}
          <div className="gw-search relative flex-1 rounded-xl flex items-center">
            <Search className="w-4 h-4 text-[var(--gw-text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาเอกสารตามชื่อไฟล์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs md:text-sm bg-transparent focus:outline-none text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)]"
            />
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* File Type Filter */}
            <div className="gw-segment flex items-center p-1 rounded-xl text-xs">
              {['all', 'pdf', 'docx', 'txt'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all uppercase cursor-pointer ${
                    selectedType === t
                      ? 'gw-segment-active font-semibold'
                      : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
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
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
                aria-label="เรียงตาม"
                className="gw-button h-10 px-3 pr-8 rounded-xl text-xs font-medium text-[var(--gw-text)] focus:outline-none cursor-pointer"
              >
                <option value="date" className="bg-[var(--gw-bg)] text-[var(--gw-text)]">เรียงตามวันที่ล่าสุด</option>
                <option value="name" className="bg-[var(--gw-bg)] text-[var(--gw-text)]">เรียงตามชื่อ A-Z</option>
                <option value="size" className="bg-[var(--gw-bg)] text-[var(--gw-text)]">เรียงตามขนาดไฟล์</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="gw-segment flex items-center p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'gw-segment-active'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'gw-segment-active'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Documents Content */}
        {filteredDocuments.length === 0 ? (
          /* Empty State */
          <div className="gw-panel gw-reveal rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl gw-badge flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[var(--gw-text)]">ไม่พบเอกสาร</h3>
            <p className="text-xs text-[var(--gw-text-muted)] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `ไม่พบไฟล์ที่ตรงกับคำค้นหา "${searchQuery}" ลองปรับคำค้นหาหรือเลือกประเภทไฟล์ใหม่`
                : 'คุณยังไม่มีเอกสารในหมวดหมู่นี้ เริ่มต้นอัปโหลดเพื่อสรุป Mind Map ด้วย AI ได้ทันที'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="gw-button px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ล้างคำค้นหา
                </button>
              )}
              <Link
                href="/documents/upload"
                className="gw-button-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
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
                className="gw-panel gw-reveal rounded-2xl p-5 hover:border-[var(--gw-accent)] transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {getFileIcon(doc.fileType)}
                    <span className="gw-positive inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gw-positive)]" />
                      พร้อมใช้งาน
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] transition-colors line-clamp-1">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-[var(--gw-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                    {doc.overview || 'ไม่มีคำอธิบายสรุปสำหรับเอกสารนี้'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t gw-divider">
                  <div className="flex items-center justify-between text-xs text-[var(--gw-text-muted)] mb-3">
                    <span>{doc.fileSize} • {doc.pageCount} หน้า</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {doc.uploadDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                      className="flex-1 py-2 rounded-xl gw-badge hover:bg-[var(--gw-accent)] hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Open & Analyze
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="p-2 rounded-xl text-[var(--gw-text-muted)] hover:text-[var(--gw-danger)] hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                      title="ลบเอกสาร"
                      aria-label={`ลบเอกสาร ${doc.name}`}
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
          <div className="gw-panel gw-reveal rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className="border-b gw-divider text-[var(--gw-text-muted)] font-semibold"
                    style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
                  >
                    <th className="py-3.5 px-5">เอกสาร</th>
                    <th className="py-3.5 px-4">ขนาดไฟล์</th>
                    <th className="py-3.5 px-4">จำนวนหน้า</th>
                    <th className="py-3.5 px-4">วันที่อัปโหลด</th>
                    <th className="py-3.5 px-4">สถานะ</th>
                    <th className="py-3.5 px-5 text-right">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y gw-divider">
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-[var(--gw-accent-soft)]/40 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.fileType)}
                          <div>
                            <p className="font-semibold text-sm text-[var(--gw-text)]">{doc.name}</p>
                            <span className="text-[10px] text-[var(--gw-text-muted)] uppercase">.{doc.fileType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--gw-text)]">{doc.fileSize}</td>
                      <td className="py-3.5 px-4 text-[var(--gw-text)]">{doc.pageCount} หน้า</td>
                      <td className="py-3.5 px-4 text-[var(--gw-text-muted)]">{doc.uploadDate}</td>
                      <td className="py-3.5 px-4">
                        <span className="gw-positive inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gw-positive)]" />
                          พร้อมใช้งาน
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                            className="gw-button-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            เปิดดู
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc.id, doc.name)}
                            className="p-1.5 rounded-lg text-[var(--gw-text-muted)] hover:text-[var(--gw-danger)] hover:bg-rose-500/10 cursor-pointer"
                            title="ลบเอกสาร"
                            aria-label={`ลบเอกสาร ${doc.name}`}
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
          </div>
        )}
      </div>
    </AppLayout>
  );
}
