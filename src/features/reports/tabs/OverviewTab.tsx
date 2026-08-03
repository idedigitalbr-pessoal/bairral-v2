import React from 'react';
import {
  Clock,
  UserCheck,
  Building,
  Tag,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserPlus,
  FolderSync,
  MessageSquare,
  FilePlus2,
  Calendar,
} from 'lucide-react';
import { Report } from '../../../types';
import { StatusBadge } from '../../../components/data-display/StatusBadge';
import { RiskBadge } from '../../../components/data-display/RiskBadge';
import { PriorityBadge } from '../../../components/data-display/PriorityBadge';
import { Button } from '../../../components/ui/Button';
import { formatDateTime, calculateOpenTime, calculateSlaStatus } from '../../../lib/dateUtils';
import { ActionType } from '../ReportHeader';
import { AIReportAnalysisCard } from '../AIReportAnalysisCard';

interface OverviewTabProps {
  report: Report;
  onOpenAction: (action: ActionType) => void;
}

export function OverviewTab({ report, onOpenAction }: OverviewTabProps) {
  const isClosed = report.status === 'RESOLVED' || report.status === 'COMPLETED' || report.status === 'ARCHIVED';
  const slaInfo = calculateSlaStatus(report.slaDueDate, isClosed);
  const openTime = calculateOpenTime(report.createdAt, report.resolvedAt);

  const activeAssignment = report.assignments?.[report.assignments.length - 1];

  return (
    <div className="space-y-6">
      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E5E5] p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737373]">Status da Demanda</span>
            <FolderSync className="w-4 h-4 text-[#525252]" />
          </div>
          <div className="mt-2.5">
            <StatusBadge status={report.status} />
          </div>
          <p className="text-[11px] text-[#737373] mt-2">
            Última atualização em {formatDateTime(report.updatedAt)}
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737373]">Cumprimento de SLA</span>
            <Clock className="w-4 h-4 text-[#525252]" />
          </div>
          <div className="mt-2">
            <span className={`text-sm font-bold ${slaInfo.isOverdue ? 'text-[#DC2626]' : 'text-[#0A0A0A]'}`}>
              {slaInfo.text}
            </span>
          </div>
          <p className="text-[11px] text-[#737373] mt-2">
            Prazo limite: {formatDateTime(report.slaDueDate)}
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737373]">Responsável Ativo</span>
            <UserCheck className="w-4 h-4 text-[#525252]" />
          </div>
          <div className="mt-2 font-bold text-sm text-[#0A0A0A] truncate">
            {activeAssignment ? activeAssignment.assigneeName : 'Não atribuído'}
          </div>
          <p className="text-[11px] text-[#737373] mt-2 truncate">
            {activeAssignment ? `Atribuído por ${activeAssignment.assignedByName}` : 'Aguardando distribuição'}
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737373]">Grau de Risco & Prioridade</span>
            <Shield className="w-4 h-4 text-[#525252]" />
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <RiskBadge level={report.riskLevel} />
            <PriorityBadge level={report.priorityLevel} />
          </div>
          <p className="text-[11px] text-[#737373] mt-2">
            Tempo em aberto: {openTime}
          </p>
        </div>
      </div>

      {/* AI Assistant Card */}
      <AIReportAnalysisCard report={report} />

      {/* Main Grid: Details + Quick Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Report Overview Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
              <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#171717]" />
                Resumo da Demanda
              </h3>
              <span className="text-xs text-[#737373]">
                Protocolo {report.protocol}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#737373] block text-[11px]">Tipo de Registro</span>
                <span className="font-semibold text-[#0A0A0A]">{report.registrationType}</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[11px]">Tipo de Manifestação</span>
                <span className="font-semibold text-[#0A0A0A]">{report.type}</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[11px]">Categoria</span>
                <span className="font-semibold text-[#0A0A0A]">{report.categoryName}</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[11px]">Unidade Operacional</span>
                <span className="font-semibold text-[#0A0A0A]">{report.unitName}</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[11px]">Departamento</span>
                <span className="font-semibold text-[#0A0A0A]">{report.departmentName || 'Geral'}</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[11px]">Chave de Acesso Pública</span>
                <span className="font-mono text-[11px] font-semibold text-[#0A0A0A]">{report.accessKey}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F5F5F5]">
              <span className="text-xs font-semibold text-[#171717] block mb-1">Síntese do Conteúdo</span>
              <p className="text-xs text-[#525252] leading-relaxed line-clamp-3 bg-[#FAFAFA] p-3 rounded-md border border-[#F5F5F5]">
                {report.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recommended Next Steps */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
              <CheckCircle2 className="w-4 h-4 text-[#166534]" />
              Ações Recomendadas
            </h3>

            <div className="space-y-2.5">
              {!activeAssignment && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenAction('atribuir')}
                  className="w-full justify-start text-xs gap-2 py-2"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#2563EB]" />
                  Designar Responsável de Compliance
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAction('mudar_status')}
                className="w-full justify-start text-xs gap-2 py-2"
              >
                <FolderSync className="w-3.5 h-3.5 text-[#D97706]" />
                Avançar Fase de Tramitação
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAction('solicitar_informacao')}
                className="w-full justify-start text-xs gap-2 py-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                Solicitar Detalhes ao Manifestante
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAction('criar_plano_acao')}
                className="w-full justify-start text-xs gap-2 py-2"
              >
                <FilePlus2 className="w-3.5 h-3.5 text-[#166534]" />
                Criar Novo Plano de Ação
              </Button>

              {!isClosed && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenAction('concluir')}
                  className="w-full justify-start text-xs gap-2 py-2 bg-[#166534] hover:bg-[#14532D]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Concluir e Finalizar Processo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
