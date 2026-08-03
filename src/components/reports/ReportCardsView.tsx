import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, Tag, ChevronRight, UserCheck, AlertCircle } from 'lucide-react';
import { Report, ReportStatusEnum, RiskLevelEnum, PriorityLevelEnum } from '../../types';
import { StatusBadge, ReportStatus } from '../data-display/StatusBadge';
import { RiskBadge, RiskLevel } from '../data-display/RiskBadge';
import { PriorityBadge, PriorityLevel } from '../data-display/PriorityBadge';
import { formatDate } from '../../lib/dateUtils';
import { Badge } from '../data-display/Badge';

interface ReportCardsViewProps {
  reports: Report[];
  onSelectReport?: (id: string) => void;
}

export function ReportCardsView({ reports, onSelectReport }: ReportCardsViewProps) {
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    if (onSelectReport) {
      onSelectReport(id);
    } else {
      navigate(`/admin/manifestacoes/${id}`);
    }
  };

  const mapStatusToLabel = (status: ReportStatusEnum): ReportStatus => {
    switch (status) {
      case ReportStatusEnum.RECEIVED: return 'Recebida';
      case ReportStatusEnum.TRIAGE: return 'Em triagem';
      case ReportStatusEnum.PENDING_INFO: return 'Informações pendentes';
      case ReportStatusEnum.ANALYSIS: return 'Em análise';
      case ReportStatusEnum.INVESTIGATION: return 'Em investigação';
      case ReportStatusEnum.FORWARDED: return 'Encaminhada';
      case ReportStatusEnum.ACTION_PLAN: return 'Plano de ação';
      case ReportStatusEnum.RESOLVED: return 'Concluída';
      case ReportStatusEnum.COMPLETED: return 'Concluída';
      case ReportStatusEnum.ARCHIVED: return 'Arquivada';
      case ReportStatusEnum.REOPENED: return 'Reaberta';
      default: return 'Em triagem';
    }
  };

  const mapRiskToLabel = (risk: RiskLevelEnum): RiskLevel => {
    switch (risk) {
      case RiskLevelEnum.LOW: return 'baixo';
      case RiskLevelEnum.MEDIUM: return 'médio';
      case RiskLevelEnum.HIGH: return 'alto';
      case RiskLevelEnum.CRITICAL: return 'crítico';
      default: return 'médio';
    }
  };

  const mapPriorityToLabel = (priority: PriorityLevelEnum): PriorityLevel => {
    switch (priority) {
      case PriorityLevelEnum.LOW: return 'baixa';
      case PriorityLevelEnum.NORMAL: return 'normal';
      case PriorityLevelEnum.HIGH: return 'alta';
      case PriorityLevelEnum.URGENT: return 'urgente';
      default: return 'normal';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#E5E5E5] rounded-xl bg-[#FAFAFA]">
        <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#A3A3A3] mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-[#171717]">Nenhuma manifestação encontrada</p>
        <p className="text-xs text-[#737373] mt-1 max-w-sm">
          Tente ajustar os filtros ou a busca para localizar os registros desejados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((report) => {
        const assignedName = report.assignments && report.assignments.length > 0
          ? report.assignments[0].assigneeName
          : null;

        return (
          <div
            key={report.id}
            onClick={() => handleCardClick(report.id)}
            className="group bg-white rounded-xl border border-[#E5E5E5] hover:border-[#FDC503] p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            {/* Faixa superior de destaque para risco alto/crítico */}
            {(report.riskLevel === RiskLevelEnum.CRITICAL || report.riskLevel === RiskLevelEnum.HIGH) && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]" />
            )}

            <div>
              {/* Header do Card */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F5F5F5]">
                <span className="font-mono text-xs font-bold text-[#171717] bg-[#F5F5F5] px-2 py-1 rounded">
                  {report.protocol}
                </span>
                <StatusBadge status={mapStatusToLabel(report.status)} size="sm" />
              </div>

              {/* Título e Descrição */}
              <div className="mt-3">
                <h3 className="font-heading font-bold text-sm text-[#0A0A0A] group-hover:text-[#806300] transition-colors line-clamp-2 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs text-[#737373] mt-1.5 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Badges de Risco e Prioridade */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <RiskBadge level={mapRiskToLabel(report.riskLevel)} size="sm" />
                <PriorityBadge level={mapPriorityToLabel(report.priorityLevel)} size="sm" />
              </div>

              {/* Metadados: Categoria, Unidade e Responsável */}
              <div className="mt-4 pt-3 border-t border-[#F5F5F5] space-y-1.5 text-xs text-[#737373]">
                {report.categoryName && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Tag className="w-3.5 h-3.5 shrink-0 text-[#A3A3A3]" />
                    <span className="truncate">{report.categoryName}</span>
                  </div>
                )}
                {report.unitName && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-[#A3A3A3]" />
                    <span className="truncate">{report.unitName}</span>
                  </div>
                )}
                {assignedName && (
                  <div className="flex items-center gap-1.5 truncate text-[#404040]">
                    <UserCheck className="w-3.5 h-3.5 shrink-0 text-[#806300]" />
                    <span className="font-medium truncate">{assignedName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer do Card */}
            <div className="mt-4 pt-3 border-t border-[#F5F5F5] flex items-center justify-between text-[11px] text-[#A3A3A3]">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
              <span className="text-[#806300] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Ver detalhes
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
