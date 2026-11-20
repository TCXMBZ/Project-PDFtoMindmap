'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  FileCode,
  File,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DocumentItem } from '@/types';

interface RecentDocumentsTableProps {
  documents: DocumentItem[];
  onDelete?: (id: string) => void;
}

export default function RecentDocumentsTable({
  documents,
  onDelete,
}: RecentDocumentsTableProps) {
  const router = useRouter();
  const [docList, setDocList] = useState(documents);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-9 h-9 rounded-xl bg-rose-500/12 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'docx':
        return (
          <div className="w-9 h-9 rounded-xl bg-sky-500/12 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'txt':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-500/12 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent-soft)] text-[var(--gw-accent)] border border-[var(--gw-border)] flex items-center justify-center shrink-0">
            <File className="w-4 h-4" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="gw-positive inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gw-positive)]" />
            พร้อมใช้งาน
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            กำลังประมวลผล
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-500">
            เกิดข้อผิดพลาด
          </span>
        );
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบเอกสาร "${name}" ใช่หรือไม่?`)) {
      setDocList((prev) => prev.filter((d) => d.id !== id));
      if (onDelete) onDelete(id);
    }
  };

  return (
    <div className="gw-panel rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[var(--gw-border)] flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-[var(--gw-text)]">
            เอกสารล่าสุด (Recent Documents)
          </h3>
          <p className="text-xs text-[var(--gw-text-muted)]">
            เอกสารที่คุณอัปโหลดและประมวลผลแล้ว
          </p>
        </div>
        <Link
          href="/documents"
          className="cursor-pointer text-xs font-semibold text-[var(--gw-accent)] hover:text-[var(--gw-accent-hover)] flex items-center gap-1 shrink-0 transition-colors"
        >
          ดูทั้งหมด ({docList.length})
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clean Glass List Rows (Desktop) */}
      <div className="hidden md:divide-y md:divide-[var(--gw-border)] md:block">
        {docList.slice(0, 5).map((doc) => (
          <div
            key={doc.id}
            className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[rgba(var(--gw-surface-rgb),0.45)] transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {getFileIcon(doc.fileType)}
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[var(--gw-text)] group-hover:text-[var(--gw-accent)] transition-colors truncate">
                  {doc.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[var(--gw-text-muted)] mt-0.5">
                  <span className="gw-badge px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase">
                    .{doc.fileType}
                  </span>
                  <span>
                    {doc.fileSize} • {doc.pageCount} หน้า
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--gw-text-subtle)]">
                    <Clock className="w-3 h-3" />
                    {doc.uploadDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {getStatusBadge(doc.status)}
              <button
                type="button"
                onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                className="cursor-pointer gw-button px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:text-[var(--gw-accent)]"
                title="วิเคราะห์และสร้าง Mind Map"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--gw-accent)]" />
                วิเคราะห์ AI
              </button>
              <button
                type="button"
                onClick={() => handleDelete(doc.id, doc.name)}
                className="cursor-pointer p-1.5 rounded-lg text-[var(--gw-text-subtle)] hover:text-rose-500 hover:bg-rose-500/12 transition-colors"
                title="ลบเอกสาร"
                aria-label={`ลบเอกสาร ${doc.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[var(--gw-border)]">
        {docList.slice(0, 5).map((doc) => (
          <div key={doc.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(doc.fileType)}
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[var(--gw-text)] truncate">
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-[var(--gw-text-muted)]">
                    {doc.fileSize} • {doc.pageCount} หน้า
                  </p>
                </div>
              </div>
              {getStatusBadge(doc.status)}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--gw-border)] text-xs">
              <span className="text-[var(--gw-text-subtle)] flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                {doc.uploadDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                  className="cursor-pointer gw-button-primary px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  วิเคราะห์ AI
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id, doc.name)}
                  className="cursor-pointer p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/12"
                  aria-label={`ลบเอกสาร ${doc.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
