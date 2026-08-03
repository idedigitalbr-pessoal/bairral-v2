import React from 'react';
import { cn } from '../../lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'metric';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  as?: React.ElementType;
  tabular?: boolean;
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  weight,
  as,
  tabular = false,
  className,
  children,
  ...props
}: TypographyProps) {
  const variantMap: Record<string, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    'body-sm': 'p',
    caption: 'span',
    metric: 'div',
  };

  const Component = as || variantMap[variant] || 'p';

  const variantClasses = {
    h1: 'font-heading text-3xl font-extrabold text-[#0A0A0A] tracking-tight',
    h2: 'font-heading text-2xl font-bold text-[#0A0A0A] tracking-tight',
    h3: 'font-heading text-xl font-bold text-[#171717]',
    h4: 'font-heading text-lg font-semibold text-[#171717]',
    body: 'text-sm text-[#262626] leading-relaxed',
    'body-sm': 'text-xs text-[#525252] leading-normal',
    caption: 'text-[11px] text-[#737373]',
    metric: 'font-heading text-2xl font-bold text-[#0A0A0A]',
  };

  const weightClasses = weight
    ? {
        light: 'font-light',
        regular: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      }[weight]
    : '';

  return (
    <Component
      className={cn(
        variantClasses[variant],
        weightClasses,
        tabular && 'font-tabular',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
