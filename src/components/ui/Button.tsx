import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark-outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        'bg-[#FDC503] text-[#0A0A0A] hover:bg-[#DDAE00] active:bg-[#B68C00] font-semibold border border-transparent shadow-xs focus-visible:ring-2 focus-visible:ring-[#FDC503] focus-visible:ring-offset-2',
      secondary:
        'bg-[#171717] text-white hover:bg-[#262626] active:bg-[#0A0A0A] font-medium border border-transparent shadow-xs focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2',
      outline:
        'bg-white text-[#171717] hover:bg-[#F5F5F5] active:bg-[#E5E5E5] border border-[#D4D4D4] font-medium focus-visible:ring-2 focus-visible:ring-[#737373] focus-visible:ring-offset-2',
      'dark-outline':
        'bg-transparent text-white hover:bg-[#262626] active:bg-[#333333] border border-[#404040] hover:border-[#525252] font-medium focus-visible:ring-2 focus-visible:ring-[#FDC503] focus-visible:ring-offset-2',
      ghost:
        'bg-transparent text-[#262626] hover:bg-[#F5F5F5] active:bg-[#E5E5E5] border border-transparent font-medium focus-visible:ring-2 focus-visible:ring-[#A3A3A3]',
      danger:
        'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] font-medium border border-transparent shadow-xs focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2',
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-sm',
      md: 'h-10 px-4 text-sm gap-2 rounded-md',
      lg: 'h-12 px-6 text-base gap-2.5 rounded-md',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-sans tracking-tight transition-colors duration-150 cursor-pointer select-none outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0 flex items-center justify-center">{leftIcon}</span>
        )}
        <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0 flex items-center justify-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
