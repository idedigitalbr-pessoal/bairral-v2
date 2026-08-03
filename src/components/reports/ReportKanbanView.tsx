import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, User, Calendar, Building2, Check } from 'lucide-react';
import { Report, ReportStatusEnum, RiskLevelEnum, PriorityLevelEnum } from '../../types';
import { StatusBadge, ReportStatus } from '../data-display/StatusBadge';
import { RiskBadge, RiskLevel } from '../data-display/RiskBadge';
import { PriorityBadge, PriorityLevel } from '../data-display/PriorityBadge';
import { formatDate } from '../../lib/dateUtils';
import { useUpdateReport } from '../../hooks/useReports';

interface ReportKanbanViewProps {
  reports: Report[];
  onSelectReport?: (id: string) => void;
}

interface PipelineColumn {
  id: string;
  title: string;
  subtitle: string;
  targetStatus: ReportStatusEnum;
  statuses: ReportStatusEnum[];
  headerBg: string;
  headerBorder: string;
  badgeBg: string;
  badgeText: string;
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    id: 'triagem',
    title: '1. Triagem & Recebimento',
    subtitle: 'Manifestações pendentes de análise inicial',
    targetStatus: ReportStatusEnum.TRIAGE,
    statuses: [ReportStatusEnum.RECEIVED, ReportStatusEnum.TRIAGE],
    headerBg: 'bg-[#FFFBEB]',
    headerBorder: 'border-[#FCD34D]',
    badgeBg: 'bg-[#FDE68A]',
    badgeText: 'text-[#92400E]',
  },
  {
    id: 'analise',
    title: '2. Análise & Investigação',
    subtitle: 'Em apuração técnica pelo comitê',
    targetStatus: ReportStatusEnum.ANALYSIS,
    statuses: [ReportStatusEnum.ANALYSIS, ReportStatusEnum.INVESTIGATION, ReportStatusEnum.PENDING_INFO],
    headerBg: 'bg-[#EFF6FF]',
    headerBorder: 'border-[#93C5FD]',
    badgeBg: 'bg-[#BFDBFE]',
    badgeText: 'text-[#1E40AF]',
  },
  {
    id: 'acao',
    title: '3. Encaminhamento & Plano',
    subtitle: 'Planos de ação em execução',
    targetStatus: ReportStatusEnum.ACTION_PLAN,
    statuses: [ReportStatusEnum.FORWARDED, ReportStatusEnum.ACTION_PLAN, ReportStatusEnum.REOPENED],
    headerBg: 'bg-[#FAF5FF]',
    headerBorder: 'border-[#E9D5FF]',
    badgeBg: 'bg-[#DDD6FE]',
    badgeText: 'text-[#6B21A8]',
  },
  {
    id: 'concluidas',
    title: '4. Concluídas & Finalizadas',
    subtitle: 'Manifestações encerradas com parecer',
    targetStatus: ReportStatusEnum.COMPLETED,
    statuses: [ReportStatusEnum.RESOLVED, ReportStatusEnum.COMPLETED, ReportStatusEnum.ARCHIVED],
    headerBg: 'bg-[#F0FDF4]',
    headerBorder: 'border-[#86EFAC]',
    badgeBg: 'bg-[#BBF7D0]',
    badgeText: 'text-[#166534]',
  },
];

export function ReportKanbanView({ reports, onSelectReport }: ReportKanbanViewProps) {
  const navigate = useNavigate();
  const updateReport = useUpdateReport();

  // Estado local para otimização instantânea do Drag & Drop (UI Optimistic)
  const [localReports, setLocalReports] = useState<Report[]>(reports);
  const [draggedReportId, setDraggedReportId] = useState<string | null>(null);
  const [activeOverColumnId, setActiveOverColumnId] = useState<string | null>(null);

  // Alvo de inserção (em cima ou em baixo de um card específico)
  const [dropTarget, setDropTarget] = useState<{
    reportId: string;
    position: 'above' | 'below';
  } | null>(null);

  // Notificação de Sucesso do Drag & Drop
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalReports(reports);
  }, [reports]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCardClick = (id: string) => {
    if (onSelectReport) {
      onSelectReport(id);
    } else {
      navigate(`/admin/manifestacoes/${id}`);
    }
  };

  const handleDragStart = (e: React.DragEvent, reportId: string) => {
    e.dataTransfer.setData('text/plain', reportId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedReportId(reportId);
  };

  const handleDragEnd = () => {
    setDraggedReportId(null);
    setActiveOverColumnId(null);
    setDropTarget(null);
  };

  // Auxiliar de Auto-Scroll suave da coluna e da página durante o Drag & Drop
  const autoScrollOnDragOver = (e: React.DragEvent, targetCardElement?: HTMLElement | null) => {
    let container: HTMLElement | null = null;

    if (targetCardElement) {
      container = targetCardElement.closest('.overflow-y-auto') as HTMLElement;
    } else {
      const el = e.currentTarget as HTMLElement;
      container = (el.querySelector('.overflow-y-auto') as HTMLElement) || (el.closest('.overflow-y-auto') as HTMLElement) || el;
    }

    if (container) {
      const rect = container.getBoundingClientRect();
      const threshold = 90; // zona de sensibilidade em pixels
      const maxSpeed = 20;

      const distTop = e.clientY - rect.top;
      const distBottom = rect.bottom - e.clientY;

      if (distTop < threshold && distTop > -20) {
        const intensity = Math.min(1, Math.max(0.2, (threshold - distTop) / threshold));
        container.scrollTop -= Math.max(6, maxSpeed * intensity);
      } else if (distBottom < threshold && distBottom > -20) {
        const intensity = Math.min(1, Math.max(0.2, (threshold - distBottom) / threshold));
        container.scrollTop += Math.max(6, maxSpeed * intensity);
      }
    }

    // Auto-scroll da viewport principal da página
    const windowThreshold = 80;
    const windowMaxSpeed = 18;
    const distWindowTop = e.clientY;
    const distWindowBottom = window.innerHeight - e.clientY;

    if (distWindowTop < windowThreshold) {
      const intensity = Math.min(1, Math.max(0.2, (windowThreshold - distWindowTop) / windowThreshold));
      window.scrollBy(0, -Math.max(6, windowMaxSpeed * intensity));
    } else if (distWindowBottom < windowThreshold) {
      const intensity = Math.min(1, Math.max(0.2, (windowThreshold - distWindowBottom) / windowThreshold));
      window.scrollBy(0, Math.max(6, windowMaxSpeed * intensity));
    }
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeOverColumnId !== columnId) {
      setActiveOverColumnId(columnId);
    }

    autoScrollOnDragOver(e);
  };

  const handleColumnDragLeave = (e: React.DragEvent, columnId: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (activeOverColumnId === columnId) {
        setActiveOverColumnId(null);
      }
    }
  };

  // Handler para hover diretamente em cima de um Card
  const handleCardDragOver = (e: React.DragEvent, reportId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Evita conflito com o container da coluna
    e.dataTransfer.dropEffect = 'move';

    autoScrollOnDragOver(e, e.currentTarget as HTMLElement);

    if (draggedReportId === reportId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position: 'above' | 'below' = e.clientY < midY ? 'above' : 'below';

    if (!dropTarget || dropTarget.reportId !== reportId || dropTarget.position !== position) {
      setDropTarget({ reportId, position });
    }
  };

  const handleCardDragLeave = (e: React.DragEvent, reportId: string) => {
    e.stopPropagation();
    if (dropTarget?.reportId === reportId) {
      setDropTarget(null);
    }
  };

  // Soltar diretamente em cima ou em baixo de outro card
  const handleCardDrop = async (e: React.DragEvent, targetReportId: string, column: PipelineColumn) => {
    e.preventDefault();
    e.stopPropagation(); // Previne execução do evento de soltar da coluna

    const reportId = e.dataTransfer.getData('text/plain') || draggedReportId;
    const position = dropTarget?.position || 'above';

    setDropTarget(null);
    setActiveOverColumnId(null);
    setDraggedReportId(null);

    if (!reportId || reportId === targetReportId) return;

    const draggedReport = localReports.find((r) => r.id === reportId);
    const targetReport = localReports.find((r) => r.id === targetReportId);

    if (!draggedReport || !targetReport) return;

    const previousStatus = draggedReport.status;
    const needStatusUpdate = !column.statuses.includes(draggedReport.status);
    const newStatus = needStatusUpdate ? column.targetStatus : draggedReport.status;

    // Reordenar no estado local
    setLocalReports((prev) => {
      const listWithoutDragged = prev.filter((r) => r.id !== reportId);
      const updatedDragged = { ...draggedReport, status: newStatus };

      const targetIdx = listWithoutDragged.findIndex((r) => r.id === targetReportId);
      if (targetIdx === -1) return prev;

      const insertIdx = position === 'above' ? targetIdx : targetIdx + 1;
      listWithoutDragged.splice(insertIdx, 0, updatedDragged);
      return listWithoutDragged;
    });

    if (needStatusUpdate) {
      showToast(`✓ Manifestação ${draggedReport.protocol} movida para "${column.title}"`);
      try {
        await updateReport.mutateAsync({
          id: reportId,
          updates: { status: newStatus },
        });
      } catch (err) {
        console.error('Erro ao atualizar status:', err);
        setLocalReports(reports);
        showToast(`❌ Falha ao atualizar chamado. Mudança revertida.`);
      }
    } else {
      showToast(`✓ Manifestação ${draggedReport.protocol} reordenada na coluna`);
    }
  };

  // Soltar no fundo/espaço livre da coluna
  const handleColumnDrop = async (e: React.DragEvent, column: PipelineColumn) => {
    e.preventDefault();
    const reportId = e.dataTransfer.getData('text/plain') || draggedReportId;

    setDropTarget(null);
    setActiveOverColumnId(null);
    setDraggedReportId(null);

    if (!reportId) return;

    const draggedReport = localReports.find((r) => r.id === reportId);
    if (!draggedReport) return;

    const previousStatus = draggedReport.status;
    const needStatusUpdate = !column.statuses.includes(draggedReport.status);
    const newStatus = needStatusUpdate ? column.targetStatus : draggedReport.status;

    setLocalReports((prev) => {
      const listWithoutDragged = prev.filter((r) => r.id !== reportId);
      const updatedDragged = { ...draggedReport, status: newStatus };
      return [...listWithoutDragged, updatedDragged];
    });

    if (needStatusUpdate) {
      showToast(`✓ Manifestação ${draggedReport.protocol} movida para "${column.title}"`);
      try {
        await updateReport.mutateAsync({
          id: reportId,
          updates: { status: newStatus },
        });
      } catch (err) {
        console.error('Erro ao mover chamado na pipeline:', err);
        setLocalReports(reports);
        showToast(`❌ Falha ao mover ${draggedReport.protocol}. Mudança revertida.`);
      }
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

  const draggedReport = draggedReportId ? localReports.find((r) => r.id === draggedReportId) : null;

  return (
    <div className="space-y-3">
      {/* Grid de Colunas do Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start overflow-x-auto pb-4 custom-scrollbar-light select-none">
        {PIPELINE_COLUMNS.map((column) => {
          const columnReports = localReports.filter((r) => column.statuses.includes(r.status));
          const isColumnHovered = activeOverColumnId === column.id;
          const isSourceColumn = draggedReport && column.statuses.includes(draggedReport.status);

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleColumnDragOver(e, column.id)}
              onDragLeave={(e) => handleColumnDragLeave(e, column.id)}
              onDrop={(e) => handleColumnDrop(e, column)}
              className={`flex flex-col rounded-xl border transition-all duration-200 min-w-[280px] max-w-full overflow-hidden shadow-sm ${
                isColumnHovered && !isSourceColumn
                  ? 'bg-[#FFFBEB] border-2 border-dashed border-[#FDC503] ring-4 ring-[#FDC503]/20 shadow-lg scale-[1.01]'
                  : isColumnHovered && isSourceColumn
                  ? 'bg-[#F5F5F5] border-2 border-dashed border-[#A3A3A3]'
                  : 'bg-[#FAFAFA] border-[#E5E5E5]'
              }`}
            >
              {/* Header da Coluna */}
              <div className={`p-3.5 border-b ${column.headerBorder} ${column.headerBg}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading font-bold text-sm text-[#0A0A0A] tracking-tight flex items-center gap-1.5">
                    {column.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${column.badgeBg} ${column.badgeText}`}>
                    {columnReports.length}
                  </span>
                </div>
                <p className="text-[11px] text-[#737373] mt-0.5">{column.subtitle}</p>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="p-3 space-y-3 max-h-[750px] overflow-y-auto custom-scrollbar-light min-h-[200px] relative">
                {/* Zona de Soltura Visual quando Arrastando para Coluna Vazia ou Fundo */}
                {isColumnHovered && !isSourceColumn && columnReports.length === 0 && (
                  <div className="p-3 border-2 border-dashed border-[#FDC503] bg-white/90 rounded-lg text-center text-xs font-bold text-[#806300] flex items-center justify-center gap-2 shadow-sm animate-pulse">
                    <ArrowRight className="w-4 h-4 text-[#806300]" />
                    <span>Soltar chamado aqui para avançar para {column.title}</span>
                  </div>
                )}

                {columnReports.length === 0 && !isColumnHovered ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-[#A3A3A3] border border-dashed border-[#E5E5E5] rounded-lg bg-white/50">
                    <span className="text-xs font-medium">Nenhum chamado nesta etapa</span>
                  </div>
                ) : (
                  columnReports.map((report) => {
                    const isBeingDragged = draggedReportId === report.id;
                    const isDropAbove = dropTarget?.reportId === report.id && dropTarget.position === 'above';
                    const isDropBelow = dropTarget?.reportId === report.id && dropTarget.position === 'below';

                    return (
                      <React.Fragment key={report.id}>
                        {/* Linha Indicadora Visual de Inserção ACIMA */}
                        {isDropAbove && (
                          <div className="h-1.5 bg-[#FDC503] rounded-full shadow-sm ring-2 ring-[#FDC503]/40 my-1 animate-pulse" />
                        )}

                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, report.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleCardDragOver(e, report.id)}
                          onDragLeave={(e) => handleCardDragLeave(e, report.id)}
                          onDrop={(e) => handleCardDrop(e, report.id, column)}
                          onClick={() => handleCardClick(report.id)}
                          className={`group bg-white rounded-lg border p-3.5 shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing space-y-2.5 relative ${
                            isBeingDragged
                              ? 'opacity-30 border-2 border-dashed border-[#FDC503] bg-[#FFFDEB] shadow-none scale-[0.98]'
                              : 'border-[#E5E5E5] hover:border-[#FDC503]'
                          }`}
                        >
                          {/* Alerta de Risco Alto ou Crítico */}
                          {(report.riskLevel === RiskLevelEnum.CRITICAL || report.riskLevel === RiskLevelEnum.HIGH) && (
                            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-[#EF4444]" />
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="font-mono text-[11px] font-bold text-[#171717] bg-[#F5F5F5] px-1.5 py-0.5 rounded">
                              {report.protocol}
                            </span>
                            <StatusBadge status={mapStatusToLabel(report.status)} size="sm" />
                          </div>

                          <div>
                            <h4 className="font-heading font-semibold text-xs text-[#0A0A0A] group-hover:text-[#806300] transition-colors line-clamp-2 leading-snug">
                              {report.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RiskBadge level={mapRiskToLabel(report.riskLevel)} size="sm" />
                            <PriorityBadge level={mapPriorityToLabel(report.priorityLevel)} size="sm" />
                          </div>

                          <div className="pt-2 border-t border-[#F5F5F5] flex items-center justify-between text-[10px] text-[#737373]">
                            <div className="flex items-center gap-1 truncate max-w-[150px]">
                              <Building2 className="w-3 h-3 shrink-0 text-[#A3A3A3]" />
                              <span className="truncate">{report.unitName || 'Sem unidade'}</span>
                            </div>
                            <span className="text-[#A3A3A3] shrink-0">{formatDate(report.createdAt)}</span>
                          </div>
                        </div>

                        {/* Linha Indicadora Visual de Inserção ABAIXO */}
                        {isDropBelow && (
                          <div className="h-1.5 bg-[#FDC503] rounded-full shadow-sm ring-2 ring-[#FDC503]/40 my-1 animate-pulse" />
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Toast Notification ao arrastar chamados */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#171717] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-[#404040] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#FDC503] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
