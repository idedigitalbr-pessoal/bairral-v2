import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  variant = 'info',
  title,
  message,
  onClose,
  className,
}: ToastProps) {
  const variantStyles = {
    info: { border: 'border-[#BFDBFE]', bg: 'bg-[#EFF6FF]', text: 'text-[#1E40AF]', icon: Info },
    success: { border: 'border-[#BBF7D0]', bg: 'bg-[#F0FDF4]', text: 'text-[#166534]', icon: CheckCircle2 },
    warning: { border: 'border-[#FEF08A]', bg: 'bg-[#FFFBEB]', text: 'text-[#854D0E]', icon: AlertTriangle },
    danger: { border: 'border-[#FECACA]', bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', icon: AlertCircle },
  };

  const current = variantStyles[variant];
  const IconComp = current.icon;

  return (
    <div
      role="status"
      className={cn(
        'w-full max-w-sm border rounded-md p-3.5 shadow-lg flex items-start gap-3 transition-all animate-in slide-in-from-top-2 duration-200',
        current.bg,
        current.border,
        className
      )}
    >
      <IconComp className={cn('w-5 h-5 shrink-0 mt-0.5', current.text)} />
      <div className="flex-1 text-xs">
        <h4 className={cn('font-bold leading-tight', current.text)}>{title}</h4>
        {message && <p className="text-[11px] text-[#525252] mt-0.5 leading-snug">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded text-current shrink-0 cursor-pointer"
          aria-label="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
