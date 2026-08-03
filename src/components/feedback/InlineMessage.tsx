import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface InlineMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export function InlineMessage({ variant = 'info', className, children, ...props }: InlineMessageProps) {
  const variantStyles = {
    info: { text: 'text-[#2563EB]', icon: Info },
    success: { text: 'text-[#16A34A]', icon: CheckCircle2 },
    warning: { text: 'text-[#D97706]', icon: AlertTriangle },
    danger: { text: 'text-[#DC2626]', icon: AlertCircle },
  };

  const current = variantStyles[variant];
  const IconComp = current.icon;

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs font-medium', current.text, className)} {...props}>
      <IconComp className="w-3.5 h-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
