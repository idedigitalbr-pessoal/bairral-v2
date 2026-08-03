import React from 'react';
import { cn } from '../../lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function Divider({
  orientation = 'horizontal',
  spacing = 'md',
  className,
  ...props
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  const spacingClasses = {
    none: '',
    sm: isHorizontal ? 'my-2' : 'mx-2',
    md: isHorizontal ? 'my-4' : 'mx-4',
    lg: isHorizontal ? 'my-6' : 'mx-6',
  };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-[#E5E5E5] shrink-0',
        isHorizontal ? 'h-[1px] w-full' : 'w-[1px] h-full self-stretch',
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  );
}
