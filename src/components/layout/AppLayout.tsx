'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import HelpModal from './HelpModal';

interface AppLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function AppLayout({ children, noPadding = false }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* Main Column */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[250px]'
        }`}
      >
        {/* Topbar */}
        <Topbar
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          onOpenHelp={() => setHelpOpen(true)}
        />

        {/* Content Area */}
        <main
          className={`flex-1 w-full ${
            noPadding ? 'p-0' : 'p-4 sm:p-6 lg:p-7'
          } max-w-[1600px] mx-auto w-full`}
        >
          {children}
        </main>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

