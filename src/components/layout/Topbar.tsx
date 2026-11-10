'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  User,
  Settings,
  LogOut,
  FileText,
  GitFork,
  X,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { mockUser, mockNotifications } from '@/data/mockUser';
import { mockDocuments } from '@/data/mockDocuments';
import { mockMindMapsList } from '@/data/mockMindMaps';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onOpenHelp: () => void;
}

export default function Topbar({ onToggleMobileMenu, onOpenHelp }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const filteredDocs = searchQuery.trim()
    ? mockDocuments.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredMindMaps = searchQuery.trim()
    ? mockMindMapsList.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Build Breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0 || paths[0] === 'dashboard') {
      return [{ label: 'Dashboard', href: '/dashboard' }];
    }

    const breadcrumbs = [{ label: 'Home', href: '/dashboard' }];

    if (paths[0] === 'documents') {
      breadcrumbs.push({ label: 'My Documents', href: '/documents' });
      if (paths[1] === 'upload') {
        breadcrumbs.push({ label: 'Upload Document', href: '/documents/upload' });
      } else if (paths[2] === 'analyze') {
        breadcrumbs.push({ label: 'Document Analyzer', href: `/documents/${paths[1]}/analyze` });
      }
    } else if (paths[0] === 'mindmaps') {
      breadcrumbs.push({ label: 'My Mind Maps', href: '/mindmaps' });
      if (paths[1]) {
        breadcrumbs.push({ label: 'Mind Map Editor', href: `/mindmaps/${paths[1]}` });
      }
    } else if (paths[0] === 'chat') {
      breadcrumbs.push({ label: 'AI Chat Assistant', href: '/chat' });
    } else if (paths[0] === 'study') {
      breadcrumbs.push({ label: 'Study Center', href: '/study' });
    } else if (paths[0] === 'settings') {
      breadcrumbs.push({ label: 'Settings', href: '/settings' });
    } else if (paths[0] === 'shared') {
      breadcrumbs.push({ label: 'Shared with me', href: '/shared' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-[68px] sticky top-0 z-30 bg-white border-b border-[#E9E9F1] px-4 md:px-7 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#85859A] hover:text-[#202033] hover:bg-[#F7F8FC]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs md:text-sm">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href + idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#85859A]" />}
                {isLast ? (
                  <span className="font-semibold text-[#202033]">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[#85859A] hover:text-[#6558E8] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Search, Notifications, Help, Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Bar */}
        <div ref={searchRef} className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#85859A] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาเอกสาร, Mind Map..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-40 sm:w-56 md:w-72 h-10 pl-9 pr-8 text-xs md:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-xl focus:outline-none focus:border-[#6558E8] focus:bg-white focus:ring-2 focus:ring-[#6558E8]/10 transition-all text-[#202033] placeholder-[#85859A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 text-[#85859A] hover:text-[#202033]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-[#E9E9F1] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-[#E9E9F1] bg-[#F7F8FC] flex items-center justify-between text-xs text-[#85859A]">
                <span>ผลการค้นหาสำหรับ &ldquo;{searchQuery}&rdquo;</span>
                <span>{(filteredDocs.length + filteredMindMaps.length)} รายการ</span>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-3">
                {filteredDocs.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#85859A] uppercase px-2 mb-1">
                      เอกสาร (Documents)
                    </p>
                    {filteredDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          router.push(`/documents/${doc.id}/analyze`);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F0EFFF] text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#202033] group-hover:text-[#6558E8] truncate">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-[#85859A]">{doc.fileSize} • {doc.pageCount} หน้า</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredMindMaps.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#85859A] uppercase px-2 mb-1">
                      แผนผังความคิด (Mind Maps)
                    </p>
                    {filteredMindMaps.map((map) => (
                      <button
                        key={map.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          router.push(`/mindmaps/${map.id}`);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F0EFFF] text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#F0EFFF] text-[#6558E8] flex items-center justify-center shrink-0">
                          <GitFork className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#202033] group-hover:text-[#6558E8] truncate">
                            {map.title}
                          </p>
                          <p className="text-[11px] text-[#85859A]">{map.nodeCount} โหนด • {map.documentName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredDocs.length === 0 && filteredMindMaps.length === 0 && (
                  <div className="py-6 text-center text-xs text-[#85859A]">
                    ไม่พบข้อมูลที่ตรงกับคำค้นหา
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative w-10 h-10 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] flex items-center justify-center text-[#4A4A68] hover:text-[#6558E8] hover:border-[#6558E8]/40 transition-colors"
            title="การแจ้งเตือน"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E65B68] rounded-full ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E9E9F1] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3.5 border-b border-[#E9E9F1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#202033]">การแจ้งเตือน</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-medium bg-[#6558E8] text-white px-2 py-0.5 rounded-full">
                      {unreadCount} ใหม่
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#6558E8] hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    อ่านทั้งหมด
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E9E9F1]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-[#F7F8FC] transition-colors flex gap-3 ${
                      !item.read ? 'bg-[#F0EFFF]/30' : ''
                    }`}
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#6558E8] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#202033]">{item.title}</p>
                      <p className="text-xs text-[#85859A] mt-0.5 leading-relaxed">{item.message}</p>
                      <span className="text-[10px] text-[#85859A] mt-1.5 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Center Shortcut */}
        <button
          onClick={onOpenHelp}
          className="w-10 h-10 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] flex items-center justify-center text-[#4A4A68] hover:text-[#6558E8] hover:border-[#6558E8]/40 transition-colors"
          title="ช่วยเหลือและคู่มือ"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Avatar & Dropdown */}
        <div ref={profileRef} className="relative pl-1">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F7F8FC] transition-colors"
          >
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#6558E8]/20"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E9E9F1] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-4 border-b border-[#E9E9F1] bg-[#F7F8FC]">
                <p className="text-sm font-semibold text-[#202033]">{mockUser.name}</p>
                <p className="text-xs text-[#85859A] truncate">{mockUser.email}</p>
                <div className="mt-2 text-[11px] font-medium text-[#6558E8] bg-[#F0EFFF] px-2 py-0.5 rounded-md inline-block">
                  {mockUser.plan}
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href="/settings?tab=profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4A4A68] hover:bg-[#F0EFFF] hover:text-[#6558E8] rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-[#85859A]" />
                  ข้อมูลส่วนตัว (Profile)
                </Link>
                <Link
                  href="/settings?tab=account"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4A4A68] hover:bg-[#F0EFFF] hover:text-[#6558E8] rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#85859A]" />
                  การตั้งค่าบัญชี (Settings)
                </Link>
              </div>

              <div className="p-2 border-t border-[#E9E9F1]">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    alert('ออกจากระบบจำลองสำหรับ Prototype');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#E65B68] hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ (Sign Out)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

