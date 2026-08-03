import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-md shadow-xs [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:first-child)]:-ml-[1px]',
        className
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}
