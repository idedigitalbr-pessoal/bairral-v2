import React from 'react';
import { Calendar } from 'lucide-react';
import { Input, InputProps } from './Input';

export const DatePicker = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder = 'DD/MM/AAAA', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        placeholder={placeholder}
        rightIcon={<Calendar className="w-4 h-4 text-[#737373] pointer-events-none" />}
        {...props}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';
