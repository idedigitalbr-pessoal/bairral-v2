import { useState } from 'react';
import { Bell, Check, AlertCircle, Clock, FileText } from 'lucide-react';
import { Popover } from '../ui/Popover';
import { Badge } from '../data-display/Badge';
import { IconButton } from '../ui/IconButton';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'critical' | 'info' | 'warning';
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Caso Crítico Registrado',
      description: 'Nova manifestação REL-2026-089 classificada com Risco Crítico.',
      time: 'Há 10 min',
      read: false,
      type: 'critical',
    },
    {
      id: '2',
      title: 'Prazo de Resposta Próximo',
      description: 'Protocolo REL-2026-042 atinge o prazo em 24h.',
      time: 'Há 1 hora',
      read: false,
      type: 'warning',
    },
    {
      id: '3',
      title: 'Plano de Ação Atualizado',
      description: 'Atribuição concluída pelo setor de Infraestrutura.',
      time: 'Há 3 horas',
      read: true,
      type: 'info',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover
      align="right"
      trigger={
        <div className="relative inline-block">
          <IconButton
            icon={Bell}
            ariaLabel="Notificações"
            variant="ghost"
            size="sm"
            className="text-[#525252] hover:text-[#0A0A0A] hover:bg-[#F5F5F5]"
          />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </div>
      }
    >
      <div className="w-80 max-w-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-xs text-[#0A0A0A]">Central de Notificações</h4>
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">
                {unreadCount} novas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-[#737373] hover:text-[#0A0A0A] flex items-center gap-1 font-medium cursor-pointer"
            >
              <Check className="w-3 h-3 text-[#16A34A]" /> Marcar lidas
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-md border transition-colors ${
                item.read
                  ? 'bg-white border-[#E5E5E5] opacity-75'
                  : 'bg-[#FFFBEB] border-[#FEF08A]'
              }`}
            >
              <div className="flex items-start gap-2">
                {item.type === 'critical' && <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />}
                {item.type === 'warning' && <Clock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />}
                {item.type === 'info' && <FileText className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />}

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-[#0A0A0A] leading-tight">{item.title}</h5>
                    <span className="text-[10px] text-[#737373] font-tabular">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-[#525252] leading-snug">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Popover>
  );
}
