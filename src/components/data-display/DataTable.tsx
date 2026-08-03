import React from 'react';
import { cn } from '../../lib/utils';
import { StatusBadge, ReportStatus } from '../data-display/StatusBadge';
import { RiskBadge, RiskLevel } from '../data-display/RiskBadge';
import { PriorityBadge, PriorityLevel } from '../data-display/PriorityBadge';
import { IconButton } from '../ui/IconButton';
import { MoreVertical, Eye } from 'lucide-react';

export interface DataTableRow {
  id: string;
  protocol: string;
  title: string;
  status: ReportStatus;
  risk: RiskLevel;
  priority: PriorityLevel;
  createdAt: string;
}

export interface DataTableProps {
  data: DataTableRow[];
  className?: string;
  onRowClick?: (id: string) => void;
}

export function DataTable({ data, className, onRowClick }: DataTableProps) {
  return (
    <div className={cn('w-full border border-[#E5E5E5] rounded-md overflow-hidden bg-white shadow-xs', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-[#737373] font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Protocolo</th>
              <th className="py-3 px-4">Título / Assunto</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Risco</th>
              <th className="py-3 px-4">Prioridade</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F5]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#737373] text-xs">
                  Nenhuma manifestação encontrada para este filtro.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.id)}
                  className={cn(
                    'hover:bg-[#FAFAFA] transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  <td className="py-3 px-4 font-mono font-semibold text-[#0A0A0A]">{row.protocol}</td>
                  <td className="py-3 px-4 font-medium text-[#171717] max-w-xs truncate">{row.title}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={row.risk} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge level={row.priority} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[#737373] font-tabular">{row.createdAt}</td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      icon={Eye}
                      ariaLabel="Visualizar"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRowClick?.(row.id)}
                    />
                    <IconButton icon={MoreVertical} ariaLabel="Mais opções" variant="ghost" size="sm" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
