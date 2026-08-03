import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'yellow';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', size = 'md', className, children, ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-[#F5F5F5] text-[#171717] border-[#D4D4D4]',
    neutral: 'bg-[#262626] text-white border-transparent',
    secondary: 'bg-[#F5F5F5] text-[#525252] border-[#E5E5E5]',
    success: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]',
    warning: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]',
    info: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#93C5FD]',
    yellow: 'bg-[#FFF4C2] text-[#806300] border-[#FFE87A]',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded-xs font-semibold',
    md: 'text-xs px-2.5 py-0.5 rounded-xs font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border font-sans tracking-tight select-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
