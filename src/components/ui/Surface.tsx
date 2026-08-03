import React from 'react';
import { cn } from '../../lib/utils';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'card' | 'panel' | 'dark';
  elevation?: 'none' | 'subtle' | 'card' | 'dropdown';
  children: React.ReactNode;
}

export function Surface({
  variant = 'card',
  elevation = 'subtle',
  className,
  children,
  ...props
}: SurfaceProps) {
  const variantClasses = {
    flat: 'bg-[#FAFAFA] border border-[#E5E5E5]',
    card: 'bg-white border border-[#E5E5E5]',
    panel: 'bg-[#F5F5F5] border border-[#D4D4D4]',
    dark: 'bg-[#171717] border border-[#262626] text-white',
  };

  const elevationClasses = {
    none: 'shadow-none',
    subtle: 'shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
    card: 'shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]',
    dropdown: 'shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]',
  };

  return (
    <div
      className={cn('rounded-md p-4 transition-all', variantClasses[variant], elevationClasses[elevation], className)}
      {...props}
    >
      {children}
    </div>
  );
}
