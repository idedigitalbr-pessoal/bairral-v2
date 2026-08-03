import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../data-display/Badge';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Selecione as opções...',
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange?.(value.filter((v) => v !== val));
    } else {
      onChange?.([...value, val]);
    }
  };

  const removeValue = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== val));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-10 px-2.5 py-1.5 bg-white border border-[#D4D4D4] rounded-md text-sm text-[#0A0A0A] flex flex-wrap items-center justify-between gap-1.5 transition-colors outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] cursor-pointer"
      >
        <div className="flex flex-wrap items-center gap-1">
          {selectedOptions.length === 0 ? (
            <span className="text-[#A3A3A3] text-xs px-1">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <Badge key={opt.value} variant="yellow" size="sm" className="flex items-center gap-1">
                <span>{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => removeValue(e, opt.value)}
                  className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronsUpDown className="w-4 h-4 text-[#737373] shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E5E5] rounded-md shadow-lg p-1 animate-in fade-in duration-100 max-h-48 overflow-y-auto space-y-0.5">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-colors text-left cursor-pointer',
                  isSelected ? 'bg-[#F5F5F5] font-semibold text-[#0A0A0A]' : 'hover:bg-[#FAFAFA] text-[#171717]'
                )}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0A0A0A] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
