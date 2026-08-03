import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full min-h-[80px] px-3 py-2 bg-white border border-[#D4D4D4] rounded-md text-sm text-[#0A0A0A] placeholder-[#A3A3A3] transition-colors outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3] disabled:cursor-not-allowed resize-y',
          error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
