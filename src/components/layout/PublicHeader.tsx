import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FilePlus, Search, HelpCircle, Shield, FileText, Lock, Palette } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { cn } from '../../lib/utils';

export function PublicHeader() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Início', href: '/', icon: <FileText className="w-4 h-4" /> },
    { label: 'FAQ / Ajuda', href: '/perguntas-frequentes', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Garantia de Anonimato', href: '/anonimato', icon: <Shield className="w-4 h-4" /> },
    { label: 'Privacidade', href: '/privacidade', icon: <Lock className="w-4 h-4" /> },
    { label: 'Design System', href: '/design-system', icon: <Palette className="w-4 h-4 text-[#FDC503]" /> },
  ];

  return (
    <header className="bg-[#171717] border-b border-[#262626] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-[#FDC503] rounded">
            <BrandLogo size="md" theme="dark" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-[#262626] text-[#FDC503]'
                      : 'text-[#D4D4D4] hover:text-white hover:bg-[#262626]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/acompanhar">
            <Button
              variant="dark-outline"
              size="sm"
              leftIcon={<Search className="w-3.5 h-3.5 text-[#FDC503]" />}
            >
              Acompanhar Manifestação
            </Button>
          </Link>

          <Link to="/registrar">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FilePlus className="w-3.5 h-3.5" />}
              className="font-bold shadow-sm"
            >
              Registrar Manifestação
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/registrar">
            <Button variant="primary" size="sm" className="text-xs px-2.5 py-1">
              Registrar
            </Button>
          </Link>
          <IconButton
            icon={isMobileOpen ? X : Menu}
            ariaLabel="Alternar menu de navegação"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#262626]"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          />
        </div>
      </div>

      {/* Mobile Drawer/Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#171717] border-t border-[#262626] p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded transition-colors',
                    isActive ? 'bg-[#262626] text-[#FDC503]' : 'text-[#D4D4D4] hover:bg-[#262626]'
                  )}
                >
                  <span className="text-[#FDC503]">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[#262626] flex flex-col gap-2">
            <Link to="/acompanhar" onClick={() => setIsMobileOpen(false)} className="w-full">
              <Button
                variant="dark-outline"
                size="sm"
                leftIcon={<Search className="w-3.5 h-3.5 text-[#FDC503]" />}
                className="w-full justify-center"
              >
                Acompanhar Manifestação
              </Button>
            </Link>

            <Link to="/registrar" onClick={() => setIsMobileOpen(false)} className="w-full">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FilePlus className="w-3.5 h-3.5" />}
                className="w-full justify-center font-bold"
              >
                Registrar Nova Manifestação
              </Button>
            </Link>

            <Link to="/admin/login" onClick={() => setIsMobileOpen(false)} className="w-full text-center pt-1">
              <span className="text-[11px] text-[#A3A3A3] hover:text-white underline">
                Acesso Restrito / Área Administrativa
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
