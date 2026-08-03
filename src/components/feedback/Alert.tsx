import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

export function Alert({
  variant = 'info',
  title,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const variantClasses = {
    info: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]',
    success: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]',
    warning: 'bg-[#FFFBEB] border-[#FEF08A] text-[#854D0E]',
    danger: 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />,
    danger: <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        'p-4 border rounded-md flex items-start gap-3 transition-all',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1 text-xs leading-relaxed">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded transition-colors text-current shrink-0 cursor-pointer"
          aria-label="Fechar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
