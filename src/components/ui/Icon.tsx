import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Icon({ icon: LucideIconComponent, size = 'md', className, ...props }: IconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',   // 16px
    md: 'w-5 h-5',   // 20px
    lg: 'w-6 h-6',   // 24px
    xl: 'w-8 h-8',   // 32px
  };

  return (
    <LucideIconComponent
      className={cn('shrink-0 stroke-[2px]', sizeClasses[size], className)}
      {...props}
    />
  );
}
