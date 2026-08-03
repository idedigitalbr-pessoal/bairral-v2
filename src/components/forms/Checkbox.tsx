import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, disabled, checked, onChange, ...props }, ref) => {
    return (
      <label className={cn('inline-flex items-center gap-2 select-none cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 bg-white border border-[#D4D4D4] rounded-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#171717] peer-checked:bg-[#0A0A0A] peer-checked:border-[#0A0A0A]',
              error && 'border-[#DC2626]'
            )}
          />
          <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3px] pointer-events-none" />
        </div>
        {label && <span className="text-xs font-medium text-[#171717]">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
