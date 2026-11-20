'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  GitFork,
  MessageSquareText,
  GraduationCap,
  Users,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';

export interface NavItem {
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORKSPACE_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', shortLabel: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Documents', shortLabel: 'Docs', href: '/documents', icon: FolderOpen },
  { label: 'Mind Maps', shortLabel: 'Maps', href: '/mindmaps', icon: GitFork },
  { label: 'AI Chat', shortLabel: 'Chat', href: '/chat', icon: MessageSquareText },
  { label: 'Study Center', shortLabel: 'Study', href: '/study', icon: GraduationCap },
  { label: 'Shared with me', shortLabel: 'Shared', href: '/shared', icon: Users },
  { label: 'Settings', shortLabel: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  onOpenHelp?: () => void;
}

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  onOpenHelp,
}: SidebarProps) {
  const pathname = usePathname();
  const railRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) {
      return true;
    }
    return pathname.startsWith(href) && href !== '/';
  };

  const handleRailKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!railRef.current) return;
    const focusables = Array.from(
      railRef.current.querySelectorAll<HTMLElement>('a[href], button')
    );
    if (focusables.length === 0) return;

    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex = -1;
    if (e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % focusables.length;
    } else if (e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = focusables.length - 1;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      focusables[nextIndex].focus();
    }
  };

  return (
    <>
      {/* Desktop Floating Icon Rail */}
      <aside
        ref={railRef}
        aria-label="Workspace navigation"
        onKeyDown={handleRailKeyDown}
        className="gw-rail gw-glass hidden lg:flex flex-col items-center gap-1.5 p-2 rounded-2xl sticky top-5 shrink-0 w-[64px] self-start z-20"
      >
        <nav className="flex flex-col items-center gap-1.5 w-full">
          {WORKSPACE_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gw-accent)] ${
                  active
                    ? 'gw-segment-active text-white'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)]'
                }`}
              >
                <Icon className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-105" />
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-150 gw-panel text-[var(--gw-text)] z-40"
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="w-7 h-px bg-[var(--gw-border)] my-1" />

        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="Help Center"
            title="Help Center"
            className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gw-accent)]"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-150 gw-panel text-[var(--gw-text)] z-40"
            >
              Help Center
            </span>
          </button>
        )}
      </aside>

      {/* Mobile Slide-Over Drawer (triggered from Topbar menu button) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-3 bottom-3 left-3 w-72 gw-panel rounded-2xl p-4 flex flex-col z-50">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--gw-border)]">
              <span className="text-sm font-semibold text-[var(--gw-text)]">
                Workspace Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {WORKSPACE_NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'gw-segment-active text-white'
                        : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {onOpenHelp && (
              <div className="pt-3 border-t border-[var(--gw-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenHelp();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] hover:bg-[var(--gw-accent-soft)] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Help Center</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
