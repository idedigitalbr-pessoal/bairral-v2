import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'p-8 border border-dashed border-[#D4D4D4] rounded-md bg-[#FAFAFA] text-center flex flex-col items-center justify-center',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 bg-[#F5F5F5] text-[#737373] rounded-full flex items-center justify-center mb-3">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="font-heading text-sm font-bold text-[#0A0A0A]">{title}</h3>
      {description && <p className="text-xs text-[#737373] max-w-sm mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
