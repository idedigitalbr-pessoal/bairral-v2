import React from 'react';
import { cn } from '../../lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  author?: string;
  badge?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative space-y-6 pl-4 border-l-2 border-[#E5E5E5]', className)}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {/* Dot */}
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0A0A0A] group-hover:bg-[#FDC503] transition-colors" />

          {/* Content */}
          <div className="bg-white border border-[#E5E5E5] rounded-md p-3.5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-heading text-xs font-bold text-[#0A0A0A]">{item.title}</h4>
              <span className="text-[10px] font-medium text-[#737373] font-tabular">{item.date}</span>
            </div>
            {item.description && (
              <p className="text-xs text-[#525252] leading-relaxed mb-2">{item.description}</p>
            )}
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#737373]">
              {item.author && <span>Por: <strong className="text-[#262626]">{item.author}</strong></span>}
              {item.badge && <div>{item.badge}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
