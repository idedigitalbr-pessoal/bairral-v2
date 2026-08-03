import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from '../ui/IconButton';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn('flex items-center justify-between gap-4 text-xs', className)}>
      <span className="text-[#737373] font-medium">
        Página <strong className="text-[#0A0A0A]">{currentPage}</strong> de{' '}
        <strong className="text-[#0A0A0A]">{totalPages}</strong>
      </span>

      <div className="flex items-center gap-1">
        <IconButton
          icon={ChevronLeft}
          ariaLabel="Página anterior"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 rounded-sm font-semibold text-xs transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#171717]',
                isActive
                  ? 'bg-[#FDC503] text-[#0A0A0A]'
                  : 'bg-white text-[#525252] hover:bg-[#F5F5F5] border border-[#D4D4D4]'
              )}
            >
              {p}
            </button>
          );
        })}

        <IconButton
          icon={ChevronRight}
          ariaLabel="Próxima página"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
}
