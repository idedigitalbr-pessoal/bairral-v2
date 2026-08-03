import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SkipLink } from './SkipLink';
import { Sidebar } from '../navigation/Sidebar';
import { AdminHeader } from '../navigation/AdminHeader';
import { cn } from '../../lib/utils';

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] font-sans antialiased flex flex-col">
      <SkipLink targetId="main-content" />

      {/* Sidebar de Navegação */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Conteúdo Principal Ajustável ao Tamanho da Sidebar */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-[margin-left] duration-300 ease-in-out will-change-[margin-left]',
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        )}
      >
        {/* Cabeçalho do Painel Admin */}
        <AdminHeader onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Área Central de Conteúdo */}
        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto focus:outline-none"
          tabIndex={-1}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
