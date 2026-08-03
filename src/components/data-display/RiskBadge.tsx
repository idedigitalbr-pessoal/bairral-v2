import React from 'react';
import { Badge } from './Badge';

export type RiskLevel = 'baixo' | 'médio' | 'alto' | 'crítico' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;

export interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export function RiskBadge({ level, size = 'md', className }: RiskBadgeProps) {
  const normalized = level.toLowerCase();

  const levelConfig: Record<
    string,
    { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }
  > = {
    baixo: { label: 'Risco Baixo', variant: 'success' },
    low: { label: 'Risco Baixo', variant: 'success' },
    médio: { label: 'Risco Médio', variant: 'warning' },
    medium: { label: 'Risco Médio', variant: 'warning' },
    alto: { label: 'Risco Alto', variant: 'danger' },
    high: { label: 'Risco Alto', variant: 'danger' },
    crítico: { label: 'Risco Crítico', variant: 'danger' },
    critical: { label: 'Risco Crítico', variant: 'danger' },
  };

  const config = levelConfig[normalized] || { label: level, variant: 'default' as const };

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
