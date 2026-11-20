'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Sidebar, { WORKSPACE_NAV_ITEMS } from './Sidebar';
import Topbar from './Topbar';
import HelpModal from './HelpModal';
import { useGlass } from './GlassContext';

gsap.registerPlugin(useGSAP);

interface AppLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function AppLayout({ children, noPadding = false }: AppLayoutProps) {
  const pathname = usePathname();
  const { backgroundImage, theme } = useGlass();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [failedBg, setFailedBg] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  const showBgImage = Boolean(backgroundImage && failedBg !== backgroundImage);

  useGSAP(
    () => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      const targets = mainRef.current?.querySelectorAll('.gw-reveal');
      if (!targets || targets.length === 0) return;

      gsap.fromTo(
        targets,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    },
    { scope: mainRef, dependencies: [pathname] }
  );

  const isRouteActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) {
      return true;
    }
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <div className="gw-root min-h-screen relative flex flex-col overflow-x-clip">
      {/* Ambient Background Image (graceful fallback on error or empty) */}
      {showBgImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          onError={() => setFailedBg(backgroundImage)}
          className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        />
      )}

      {/* Dynamic Floating Ambient Color Orbs (reactive to --gw-tint-rgb & theme) */}
      <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="gw-orb gw-orb-1 -top-24 -left-24 w-[420px] h-[420px] sm:w-[560px] sm:h-[560px]"
          style={{
            background: `radial-gradient(circle, rgba(var(--gw-tint-rgb), ${
              theme === 'dark' ? '0.42' : '0.36'
            }) 0%, transparent 70%)`,
          }}
        />
        <div
          className="gw-orb gw-orb-2 top-1/4 -right-24 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px]"
          style={{
            background: `radial-gradient(circle, ${
              theme === 'dark' ? 'rgba(45, 212, 191, 0.28)' : 'rgba(20, 184, 166, 0.28)'
            } 0%, transparent 70%)`,
          }}
        />
        <div
          className="gw-orb gw-orb-3 -bottom-28 left-1/3 w-[400px] h-[400px] sm:w-[540px] sm:h-[540px]"
          style={{
            background: `radial-gradient(circle, ${
              theme === 'dark' ? 'rgba(99, 102, 241, 0.26)' : 'rgba(245, 158, 11, 0.24)'
            } 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Room Shade Overlay */}
      <div
        aria-hidden="true"
        className={`gw-room-shade fixed inset-0 pointer-events-none z-0 transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-black/45 via-black/25 to-emerald-950/35'
            : 'bg-gradient-to-br from-white/25 via-transparent to-emerald-50/25'
        }`}
      />

      {/* Centered Workspace Container */}
      <div
        className={`relative w-full mx-auto flex-1 flex flex-col gap-4 ${
          noPadding
            ? 'max-w-none px-2 sm:px-4 py-2 sm:py-3'
            : 'max-w-[1320px] px-3 sm:px-5 lg:px-6 pt-3 sm:pt-5 pb-20 lg:pb-8'
        }`}
      >
        {/* Topbar */}
        <Topbar
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
          onOpenHelp={() => setHelpOpen(true)}
        />

        {/* Stage: Sidebar Rail + Main Glass Canvas */}
        <div className="gw-stage flex-1 flex flex-col lg:flex-row gap-4 lg:gap-5 min-h-0">
          <Sidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            onOpenHelp={() => setHelpOpen(true)}
          />

          <main
            ref={mainRef}
            className={`gw-main gw-glass flex-1 min-w-0 rounded-3xl ${
              noPadding
                ? 'p-0 overflow-hidden flex flex-col min-h-[calc(100dvh-84px)]'
                : 'p-4 sm:p-6 lg:p-7'
            }`}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Fixed Bottom Tab Bar (5 primary workspace items, 44px+ touch targets) */}
      {!noPadding && (
        <nav
          aria-label="Mobile navigation"
          className="gw-dock gw-glass lg:hidden fixed bottom-2 inset-x-3 z-20 grid grid-cols-5 gap-1 p-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] rounded-2xl"
        >
          {WORKSPACE_NAV_ITEMS.slice(0, 5).map((item) => {
            const active = isRouteActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded-xl text-[10px] font-medium transition-all cursor-pointer ${
                  active
                    ? 'gw-segment-active text-white'
                    : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-full">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
