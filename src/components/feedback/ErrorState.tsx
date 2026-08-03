import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Falha no carregamento',
  message = 'Ocorreu um erro ao carregar as informações. Por favor, tente novamente.',
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'p-6 border border-[#FECACA] rounded-md bg-[#FEF2F2] text-center flex flex-col items-center justify-center',
        className
      )}
      {...props}
    >
      <div className="w-10 h-10 bg-[#FEE2E2] text-[#DC2626] rounded-full flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="font-heading text-sm font-bold text-[#991B1B]">{title}</h3>
      <p className="text-xs text-[#7F1D1D] max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
