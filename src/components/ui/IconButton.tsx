import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: IconComponent, variant = 'outline', size = 'md', ariaLabel, className, disabled, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-[#FDC503] text-[#0A0A0A] hover:bg-[#DDAE00] active:bg-[#B68C00] border border-transparent',
      secondary: 'bg-[#171717] text-white hover:bg-[#262626] active:bg-[#0A0A0A] border border-transparent',
      outline: 'bg-white text-[#171717] hover:bg-[#F5F5F5] active:bg-[#E5E5E5] border border-[#D4D4D4]',
      ghost: 'bg-transparent text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] active:bg-[#E5E5E5] border border-transparent',
      danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] border border-transparent',
    };

    const sizeClasses = {
      sm: 'w-8 h-8 p-1.5 rounded-sm',
      md: 'w-10 h-10 p-2.5 rounded-md',
      lg: 'w-12 h-12 p-3 rounded-md',
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <IconComponent className={iconSizes[size]} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
