import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ variant = 'rectangular', className, ...props }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded-xs',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn('bg-[#E5E5E5] animate-pulse shrink-0', variantClasses[variant], className)}
      {...props}
    />
  );
}
