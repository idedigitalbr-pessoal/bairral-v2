import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
  children: React.ReactNode;
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-[#E5E5E5] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
    flat: 'bg-[#FAFAFA] border border-[#E5E5E5]',
    interactive:
      'bg-white border border-[#E5E5E5] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:border-[#A3A3A3] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-all cursor-pointer',
  };

  return (
    <div className={cn('rounded-md p-5', variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#F5F5F5]', className)} {...props}>
      <div>
        <h3 className="font-heading text-base font-bold text-[#0A0A0A]">{title}</h3>
        {subtitle && <p className="text-xs text-[#737373] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-xs text-[#262626]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 pt-3 border-t border-[#F5F5F5] flex items-center justify-between text-xs text-[#737373]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
