import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, placeholder, className, disabled, children, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full h-10 pl-3 pr-8 py-2 bg-white border border-[#D4D4D4] rounded-md text-sm text-[#0A0A0A] appearance-none transition-colors outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3] disabled:cursor-not-allowed cursor-pointer',
            error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown className="w-4 h-4 text-[#737373] absolute right-3 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';
