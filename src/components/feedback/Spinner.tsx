import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Spinner({ size = 'md', label, className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('inline-flex items-center gap-2 text-[#171717]', className)} {...props}>
      <Loader2 className={cn('animate-spin shrink-0', sizeClasses[size])} />
      {label && <span className="text-xs text-[#525252] font-medium">{label}</span>}
    </div>
  );
}
