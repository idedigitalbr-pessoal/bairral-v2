import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface LinkButtonProps extends LinkProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  const variantClasses = {
    primary: 'bg-[#FDC503] text-[#0A0A0A] hover:bg-[#DDAE00] font-semibold border border-transparent shadow-xs',
    secondary: 'bg-[#171717] text-white hover:bg-[#262626] font-medium border border-transparent shadow-xs',
    outline: 'bg-white text-[#171717] hover:bg-[#F5F5F5] border border-[#D4D4D4] font-medium',
    ghost: 'bg-transparent text-[#262626] hover:bg-[#F5F5F5] font-medium border border-transparent',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] font-medium border border-transparent shadow-xs',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-sm',
    md: 'h-10 px-4 text-sm gap-2 rounded-md',
    lg: 'h-12 px-6 text-base gap-2.5 rounded-md',
  };

  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center font-sans tracking-tight transition-colors duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Link>
  );
}
