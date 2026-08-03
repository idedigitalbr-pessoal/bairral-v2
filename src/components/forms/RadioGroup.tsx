import React from 'react';
import { cn } from '../../lib/utils';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  direction?: 'row' | 'col';
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  direction = 'col',
  className,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col gap-2.5' : 'flex-row gap-4 flex-wrap',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              'inline-flex items-start gap-2.5 select-none cursor-pointer',
              option.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={option.disabled}
                onChange={() => onChange?.(option.value)}
                className="peer sr-only"
              />
              <div className="w-4 h-4 bg-white border border-[#D4D4D4] rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#171717] peer-checked:border-[#0A0A0A]" />
              <div className="w-2 h-2 bg-[#0A0A0A] rounded-full absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#171717]">{option.label}</span>
              {option.description && (
                <span className="text-[11px] text-[#737373]">{option.description}</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
