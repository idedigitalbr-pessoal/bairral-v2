import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Shield, Key } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '../ui/DropdownMenu';
import { useAuth } from '../../context/AuthContext';

export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const name = user?.name || 'Gestor do Bairral';
  const role = user?.roleName || 'Gestor de Ética';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Alterar Senha',
      icon: <Key className="w-4 h-4 text-[#737373]" />,
      onClick: () => navigate('/alterar-senha'),
    },
    {
      label: 'Configurações do Sistema',
      icon: <Settings className="w-4 h-4 text-[#737373]" />,
      onClick: () => navigate('/admin/configuracoes'),
    },
    {
      label: 'Meu Perfil & Permissões',
      icon: <Shield className="w-4 h-4 text-[#737373]" />,
      onClick: () => navigate('/admin/perfis'),
    },
    {
      label: 'Sair da Conta',
      icon: <LogOut className="w-4 h-4 text-[#DC2626]" />,
      isDanger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          type="button"
          className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-[#F5F5F5] transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[#171717]"
        >
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[#FDC503] font-heading font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0A0A0A] leading-tight">{name}</span>
            <span className="text-[10px] text-[#737373] leading-tight">{role}</span>
          </div>
        </button>
      }
      items={menuItems}
    />
  );
}
