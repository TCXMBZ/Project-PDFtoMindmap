'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  File,
  Eye,
  Trash2,
  ExternalLink,
  MoreVertical,
  Clock,
  Sparkles
} from 'lucide-react';
import { DocumentItem } from '@/types';

interface RecentDocumentsTableProps {
  documents: DocumentItem[];
  onDelete?: (id: string) => void;
}

export default function RecentDocumentsTable({ documents, onDelete }: RecentDocumentsTableProps) {
  const router = useRouter();
  const [docList, setDocList] = useState(documents);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>;
      case 'docx':
        return <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>;
      case 'txt':
        return <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0"><FileCode className="w-4 h-4" /></div>;
      default:
        return <div className="w-8 h-8 rounded-lg bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center shrink-0"><File className="w-4 h-4" /></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#18A979]/10 text-[#18A979]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18A979]" />
            พร้อมใช้งาน
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F4AD43]/10 text-[#F4AD43]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4AD43] animate-ping" />
            กำลังประมวลผล
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-500">
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
    <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#E9E9F1] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-[#202033]">เอกสารล่าสุด (Recent Documents)</h3>
          <p className="text-xs text-[#85859A]">เอกสารที่คุณอัปโหลดและประมวลผลแล้ว</p>
        </div>
        <Link
          href="/documents"
          className="text-xs font-semibold text-[#6558E8] hover:text-[#5548D8] flex items-center gap-1"
        >
          ดูทั้งหมด ({docList.length})
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F7F8FC] border-b border-[#E9E9F1] text-[#85859A] font-semibold">
              <th className="py-3.5 px-5">ชื่อเอกสาร</th>
              <th className="py-3.5 px-4">ประเภทไฟล์</th>
              <th className="py-3.5 px-4">วันที่อัปโหลด</th>
              <th className="py-3.5 px-4">สถานะ</th>
              <th className="py-3.5 px-5 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E9F1]">
            {docList.slice(0, 5).map((doc) => (
              <tr key={doc.id} className="hover:bg-[#F7F8FC]/60 transition-colors group">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.fileType)}
                    <div>
                      <p className="font-semibold text-sm text-[#202033] group-hover:text-[#6558E8] transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-[#85859A]">
                        {doc.fileSize} • {doc.pageCount} หน้า
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 uppercase font-semibold text-[#4A4A68]">
                  <span className="px-2 py-0.5 rounded-md bg-[#F0EFFF] text-[#6558E8] text-[11px]">
                    .{doc.fileType}
                  </span>
                </td>
                <td className="py-4 px-4 text-[#85859A]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#85859A]" />
                    {doc.uploadDate}
                  </span>
                </td>
                <td className="py-4 px-4">{getStatusBadge(doc.status)}</td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                      className="px-3 py-1.5 rounded-lg bg-[#F0EFFF] text-[#6558E8] hover:bg-[#6558E8] hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                      title="วิเคราะห์และสร้าง Mind Map"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      วิเคราะห์ AI
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="p-1.5 rounded-lg text-[#85859A] hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="ลบเอกสาร"
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

      {/* Mobile Card View (Section 8 Responsive Requirement) */}
      <div className="md:hidden divide-y divide-[#E9E9F1]">
        {docList.slice(0, 5).map((doc) => (
          <div key={doc.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {getFileIcon(doc.fileType)}
                <div>
                  <p className="font-semibold text-sm text-[#202033]">{doc.name}</p>
                  <p className="text-[11px] text-[#85859A]">{doc.fileSize} • {doc.pageCount} หน้า</p>
                </div>
              </div>
              {getStatusBadge(doc.status)}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E9E9F1] text-xs">
              <span className="text-[#85859A] flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                {doc.uploadDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/documents/${doc.id}/analyze`)}
                  className="px-3 py-1 rounded-lg bg-[#6558E8] text-white text-xs font-medium"
                >
                  วิเคราะห์ AI
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.name)}
                  className="p-1 text-red-500"
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

