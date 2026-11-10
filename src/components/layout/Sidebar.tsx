'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Network,
  LayoutDashboard,
  FolderOpen,
  GitFork,
  Users,
  FileSearch,
  MessageSquareText,
  GraduationCap,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { mockUser } from '@/data/mockUser';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  onOpenHelp?: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenHelp
}: SidebarProps) {
  const pathname = usePathname();

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Documents', href: '/documents', icon: FolderOpen },
        { label: 'My Mind Maps', href: '/mindmaps', icon: GitFork },
        { label: 'Shared with me', href: '/shared', icon: Users },
      ]
    },
    {
      title: 'AI TOOLS',
      items: [
        { label: 'Document Analyzer', href: '/documents/doc-1/analyze', icon: FileSearch },
        { label: 'AI Chat', href: '/chat', icon: MessageSquareText },
        { label: 'Study Center', href: '/study', icon: GraduationCap },
      ]
    },
    {
      title: 'STUDY CENTER',
      items: [
        { label: 'Quizzes', href: '/study?tab=quizzes', icon: Sparkles },
        { label: 'Flashcards', href: '/study?tab=flashcards', icon: BookOpen },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
    if (href.includes('?tab=')) {
      // Study center sub items handled
      return false;
    }
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E9E9F1] transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-[250px]'}
          w-[270px] shadow-xs
        `}
      >
        {/* Brand Header */}
        <div className="h-[68px] flex items-center justify-between px-5 border-b border-[#E9E9F1]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6558E8] to-[#8B7CF6] flex items-center justify-center text-white shadow-xs shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-[#202033] flex items-center gap-1.5">
                  MindMap <span className="text-[#6558E8]">AI</span>
                </span>
                <span className="text-[11px] text-[#85859A]">Smart Learning</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-[#85859A] hover:text-[#202033] hover:bg-[#F0EFFF] transition-colors"
            title={isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#85859A] uppercase">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative
                        ${
                          active
                            ? 'bg-[#F0EFFF] text-[#6558E8] font-semibold'
                            : 'text-[#4A4A68] hover:bg-[#F7F8FC] hover:text-[#202033]'
                        }
                        ${isCollapsed ? 'justify-center px-0' : ''}
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform duration-200 shrink-0 ${
                          active
                            ? 'text-[#6558E8]'
                            : 'text-[#85859A] group-hover:text-[#6558E8] group-hover:scale-105'
                        }`}
                      />
                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Active indicator bar */}
                      {active && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#6558E8] rounded-l-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-[#E9E9F1] space-y-2">
          {/* Quick links */}
          <div className="space-y-1">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors
                ${pathname.startsWith('/settings') ? 'bg-[#F0EFFF] text-[#6558E8]' : 'text-[#4A4A68] hover:bg-[#F7F8FC]'}
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed ? 'Settings' : undefined}
            >
              <Settings className="w-5 h-5 text-[#85859A]" />
              {!isCollapsed && <span>Settings</span>}
            </Link>

            <button
              onClick={() => {
                if (onOpenHelp) onOpenHelp();
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-[#4A4A68] hover:bg-[#F7F8FC] transition-colors
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed ? 'Help Center' : undefined}
            >
              <HelpCircle className="w-5 h-5 text-[#85859A]" />
              {!isCollapsed && <span>Help Center</span>}
            </button>
          </div>

          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]
              ${isCollapsed ? 'justify-center p-1.5' : ''}
            `}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#18A979] rounded-full ring-2 ring-white" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#202033] truncate">{mockUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-medium text-[#6558E8] bg-[#F0EFFF] px-1.5 py-0.5 rounded-sm">
                    {mockUser.plan}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

