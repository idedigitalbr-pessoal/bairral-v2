import React from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({ checked = false, onChange, disabled = false, label, className }: SwitchProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2.5 select-none cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <div className="w-9 h-5 bg-[#D4D4D4] rounded-full transition-colors peer-checked:bg-[#0A0A0A] peer-focus-visible:ring-2 peer-focus-visible:ring-[#171717] peer-focus-visible:ring-offset-1" />
        <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 transition-transform peer-checked:translate-x-4 shadow-xs" />
      </div>
      {label && <span className="text-xs font-medium text-[#171717]">{label}</span>}
    </label>
  );
}
