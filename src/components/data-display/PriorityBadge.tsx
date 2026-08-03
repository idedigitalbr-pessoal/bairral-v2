import React from 'react';
import { Badge } from './Badge';
import { PriorityLevelEnum } from '../../types/enums';

export type PriorityLevel = 'baixa' | 'normal' | 'alta' | 'urgente' | PriorityLevelEnum | string;

export interface PriorityBadgeProps {
  level: PriorityLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export function PriorityBadge({ level, size = 'md', className }: PriorityBadgeProps) {
  const normalizedLevel = (typeof level === 'string' ? level.toLowerCase() : level) as string;

  const levelConfig: Record<
    string,
    { label: string; variant: 'default' | 'info' | 'warning' | 'danger' }
  > = {
    baixa: { label: 'Prioridade Baixa', variant: 'default' },
    low: { label: 'Prioridade Baixa', variant: 'default' },
    normal: { label: 'Prioridade Normal', variant: 'info' },
    alta: { label: 'Prioridade Alta', variant: 'warning' },
    high: { label: 'Prioridade Alta', variant: 'warning' },
    urgente: { label: 'Prioridade Urgente', variant: 'danger' },
    urgent: { label: 'Prioridade Urgente', variant: 'danger' },
  };

  const config = levelConfig[normalizedLevel] || { label: level, variant: 'default' };

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
