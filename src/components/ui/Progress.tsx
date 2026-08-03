import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'yellow' | 'neutral' | 'success' | 'danger';
}

export function Progress({
  value,
  showValue = false,
  size = 'md',
  variant = 'yellow',
  className,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    yellow: 'bg-[#FDC503]',
    neutral: 'bg-[#171717]',
    success: 'bg-[#16A34A]',
    danger: 'bg-[#DC2626]',
  };

  return (
    <div className={cn('w-full flex items-center gap-3', className)} {...props}>
      <div className={cn('flex-1 bg-[#E5E5E5] rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full transition-all duration-300 rounded-full', variantClasses[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-[#171717] font-tabular w-8 text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
