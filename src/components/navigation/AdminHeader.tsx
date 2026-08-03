import { Link, useLocation } from 'react-router-dom';
import { Menu, ExternalLink } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { NotificationsButton } from './NotificationsButton';
import { UserMenu } from './UserMenu';
import { IconButton } from '../ui/IconButton';
import { BrandLogo } from '../ui/BrandLogo';

export interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({ onOpenMobileSidebar }: AdminHeaderProps) {
  const location = useLocation();

  // Mapeamento dinâmico de rótulos de breadcrumb baseados na URL
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const search = location.search;

    const items: BreadcrumbItem[] = [{ label: 'Administração', href: '/admin' }];

    if (path === '/admin') {
      items.push({ label: 'Visão Geral' });
    } else if (path.startsWith('/admin/manifestacoes')) {
      if (search.includes('filtro=minhas')) {
        items.push({ label: 'Minhas Atribuições' });
      } else if (search.includes('filtro=criticos')) {
        items.push({ label: 'Casos Críticos' });
      } else if (search.includes('filtro=atraso')) {
        items.push({ label: 'Casos em Atraso' });
      } else if (path.split('/').length > 3) {
        items.push({ label: 'Manifestações', href: '/admin/manifestacoes' });
        items.push({ label: `Detalhes (${path.split('/')[3]})` });
      } else {
        items.push({ label: 'Manifestações' });
      }
    } else if (path === '/admin/planos-de-acao') {
      items.push({ label: 'Planos de Ação' });
    } else if (path === '/admin/relatorios') {
      items.push({ label: 'Relatórios & Estatísticas' });
    } else if (path === '/admin/usuarios') {
      items.push({ label: 'Gestão de Usuários' });
    } else if (path === '/admin/perfis') {
      items.push({ label: 'Perfis & Permissões' });
    } else if (path === '/admin/categorias') {
      items.push({ label: 'Categorias de Manifestação' });
    } else if (path === '/admin/unidades') {
      items.push({ label: 'Unidades do Grupo Bairral' });
    } else if (path === '/admin/auditoria') {
      items.push({ label: 'Trilha de Auditoria' });
    } else if (path === '/admin/configuracoes') {
      items.push({ label: 'Configurações do Sistema' });
    } else {
      items.push({ label: 'Painel' });
    }

    return items;
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E5E5] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      {/* Left Area: Mobile hamburger, logo & Breadcrumb */}
      <div className="flex items-center gap-3">
        <IconButton
          icon={Menu}
          ariaLabel="Abrir menu de navegação"
          variant="ghost"
          size="sm"
          className="md:hidden text-[#171717]"
          onClick={onOpenMobileSidebar}
        />

        <Link to="/admin" className="md:hidden flex items-center">
          <BrandLogo size="sm" variant="symbol" />
        </Link>

        <div className="hidden sm:block">
          <Breadcrumb items={getBreadcrumbs()} />
        </div>
      </div>

      {/* Right Area: Shortcuts, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Link para o portal público */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#525252] hover:text-[#0A0A0A] bg-[#F5F5F5] hover:bg-[#E5E5E5] rounded transition-colors"
          title="Ver Portal Público em nova aba"
        >
          <span>Portal Público</span>
          <ExternalLink className="w-3 h-3 text-[#737373]" />
        </Link>

        {/* Central de Notificações */}
        <NotificationsButton />

        <div className="h-5 w-[1px] bg-[#E5E5E5] hidden sm:block" />

        {/* Menu do Usuário */}
        <UserMenu />
      </div>
    </header>
  );
}
