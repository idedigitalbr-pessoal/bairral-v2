import React, { useState } from 'react';
import { Menu, X, Home, FileText, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { BrandLogo } from '../ui/BrandLogo';
import { IconButton } from '../ui/IconButton';

export interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: MobileNavItem[] = [
    { label: 'Início / Visão Geral', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Relatórios & Chamados', href: '/reports', icon: <FileText className="w-4 h-4" /> },
    { label: 'Design System', href: '/design-system', icon: <Layers className="w-4 h-4" /> },
    { label: 'Segurança & Compliance', href: '/compliance', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Ajuda & Suporte', href: '/help', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="md:hidden w-full bg-[#171717] text-white border-b border-[#262626]">
      <div className="flex items-center justify-between p-4">
        <BrandLogo size="sm" theme="dark" />
        <IconButton
          icon={isOpen ? X : Menu}
          ariaLabel="Alternar menu móvel"
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <nav className="p-4 pt-0 space-y-1 border-t border-[#262626] animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded hover:bg-[#262626] transition-colors"
            >
              <span className="text-[#FDC503]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
