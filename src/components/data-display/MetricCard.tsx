import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from './Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  highlightColor?: 'yellow' | 'neutral' | 'success' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  trend,
  highlightColor = 'yellow',
  className,
  onClick,
  clickable = true,
}: MetricCardProps) {
  const iconBgClasses = {
    yellow: 'bg-[#FFF4C2] text-[#806300] group-hover:bg-[#FDC503] group-hover:text-[#171717]',
    neutral: 'bg-[#F5F5F5] text-[#171717] group-hover:bg-[#E5E5E5]',
    success: 'bg-[#DCFCE7] text-[#15803D] group-hover:bg-[#BBF7D0]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C] group-hover:bg-[#FECACA]',
    info: 'bg-[#DBEAFE] text-[#1D4ED8] group-hover:bg-[#BFDBFE]',
  };

  const isClickable = Boolean(onClick || clickable);

  return (
    <Card
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'relative overflow-hidden group select-none',
        isClickable &&
          'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#FDC503] active:translate-y-0 active:shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider group-hover:text-[#0A0A0A] transition-colors">
            {title}
          </span>
          <span className="font-heading font-extrabold text-2xl text-[#0A0A0A] font-tabular mt-1">
            {value}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {IconComponent && (
            <div className={cn('p-2.5 rounded-md transition-colors', iconBgClasses[highlightColor])}>
              <IconComponent className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {(subtitle || trend || isClickable) && (
        <div className="mt-3 pt-2.5 border-t border-[#F5F5F5] flex items-center justify-between text-[11px]">
          {trend && (
            <span
              className={cn(
                'font-semibold font-tabular',
                trend.isPositive && 'text-[#16A34A]',
                trend.isNegative && 'text-[#DC2626]',
                !trend.isPositive && !trend.isNegative && 'text-[#525252]'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-[#737373] group-hover:text-[#404040] transition-colors">{subtitle}</span>}
          {isClickable && (
            <span className="text-[#A3A3A3] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex items-center gap-0.5 ml-auto font-medium shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
