import React from 'react';
import { Outlet } from 'react-router-dom';
import { SkipLink } from './SkipLink';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export interface PublicLayoutProps {
  children?: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-[#171717] font-sans antialiased">
      <SkipLink targetId="main-content" />
      <PublicHeader />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
}
