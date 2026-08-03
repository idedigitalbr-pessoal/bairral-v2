import React from 'react';
import { Badge } from './Badge';

export type ReportStatus =
  | 'Recebida'
  | 'Em triagem'
  | 'Aguardando informações'
  | 'Em análise'
  | 'Em investigação'
  | 'Encaminhada'
  | 'Plano de ação'
  | 'Resolvida'
  | 'Concluída'
  | 'Arquivada'
  | 'Reaberta'
  | 'RECEIVED'
  | 'TRIAGE'
  | 'PENDING_INFO'
  | 'ANALYSIS'
  | 'INVESTIGATION'
  | 'FORWARDED'
  | 'ACTION_PLAN'
  | 'RESOLVED'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'REOPENED'
  | string;

export interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const statusConfig: Record<
    string,
    { label: string; variant: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'yellow' }
  > = {
    Recebida: { label: 'Recebida', variant: 'info' },
    RECEIVED: { label: 'Recebido', variant: 'info' },
    'Em triagem': { label: 'Em triagem', variant: 'yellow' },
    TRIAGE: { label: 'Em triagem', variant: 'yellow' },
    'Aguardando informações': { label: 'Aguardando inf.', variant: 'warning' },
    PENDING_INFO: { label: 'Aguardando inf.', variant: 'warning' },
    'Em análise': { label: 'Em análise', variant: 'yellow' },
    ANALYSIS: { label: 'Em análise', variant: 'yellow' },
    'Em investigação': { label: 'Em investigação', variant: 'warning' },
    INVESTIGATION: { label: 'Em investigação', variant: 'warning' },
    Encaminhada: { label: 'Encaminhada', variant: 'info' },
    FORWARDED: { label: 'Encaminhada', variant: 'info' },
    'Plano de ação': { label: 'Plano de ação', variant: 'warning' },
    ACTION_PLAN: { label: 'Plano de ação', variant: 'warning' },
    Resolvida: { label: 'Resolvida', variant: 'success' },
    RESOLVED: { label: 'Resolvido', variant: 'success' },
    Concluída: { label: 'Concluída', variant: 'success' },
    COMPLETED: { label: 'Concluído', variant: 'success' },
    Arquivada: { label: 'Arquivada', variant: 'default' },
    ARCHIVED: { label: 'Arquivado', variant: 'default' },
    Reaberta: { label: 'Reaberta', variant: 'danger' },
    REOPENED: { label: 'Reaberto', variant: 'danger' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' as const };

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
