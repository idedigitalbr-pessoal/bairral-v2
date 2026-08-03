import React from 'react';
import { cn } from '../../lib/utils';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormField({ className, children, ...props }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
      {children}
    </div>
  );
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

export function FormLabel({ required, error, className, children, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        'text-xs font-semibold text-[#171717] flex items-center gap-1 select-none',
        error && 'text-[#DC2626]',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[#DC2626] font-bold">*</span>}
    </label>
  );
}

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function FormDescription({ className, children, ...props }: FormDescriptionProps) {
  return (
    <p className={cn('text-[11px] text-[#737373] leading-tight', className)} {...props}>
      {children}
    </p>
  );
}

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;
}

export function FormMessage({ error, className, ...props }: FormMessageProps) {
  if (!error) return null;

  return (
    <p className={cn('text-[11px] font-medium text-[#DC2626] mt-0.5', className)} {...props}>
      {error}
    </p>
  );
}
