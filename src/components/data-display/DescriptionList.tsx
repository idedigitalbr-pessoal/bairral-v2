import React from 'react';
import { cn } from '../../lib/utils';

export interface DescriptionItem {
  label: string;
  value: React.ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionItem[];
  cols?: 1 | 2 | 3;
  className?: string;
}

export function DescriptionList({ items, cols = 2, className }: DescriptionListProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
  };

  return (
    <dl className={cn('grid gap-4 p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md text-xs', gridClasses[cols], className)}>
      {items.map((item, idx) => (
        <div key={idx} className="space-y-0.5">
          <dt className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
            {item.label}
          </dt>
          <dd className="font-medium text-[#0A0A0A] leading-normal">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
