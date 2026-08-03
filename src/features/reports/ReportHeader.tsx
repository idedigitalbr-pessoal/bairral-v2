import React from 'react';
import {
  Shield,
  ShieldAlert,
  Clock,
  UserCheck,
  Calendar,
  AlertTriangle,
  MoreVertical,
  Lock,
  CheckCircle2,
  FolderSync,
  UserPlus,
  MessageSquare,
  Send,
  FilePlus2,
  Archive,
  RotateCcw,
  AlertOctagon,
  ArrowRightLeft,
  Tag,
  ShieldOff,
  FileText,
} from 'lucide-react';
import { Report } from '../../types';
import { AdminPermissionEnum } from '../../types/auth';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { RiskBadge } from '../../components/data-display/RiskBadge';
import { PriorityBadge } from '../../components/data-display/PriorityBadge';
import { Badge } from '../../components/data-display/Badge';
import { Button } from '../../components/ui/Button';
import { DropdownMenu } from '../../components/ui/DropdownMenu';
import { PermissionGate } from '../../components/auth/PermissionGate';
import { formatDateTime, calculateOpenTime, calculateSlaStatus } from '../../lib/dateUtils';

export type ActionType =
  | 'classificar'
  | 'atribuir'
  | 'transferir'
  | 'mudar_status'
  | 'mudar_risco'
  | 'mudar_prioridade'
  | 'solicitar_informacao'
  | 'iniciar_investigacao'
  | 'adicionar_comentario'
  | 'enviar_mensagem'
  | 'criar_plano_acao'
  | 'concluir'
  | 'arquivar'
  | 'reabrir'
  | 'restringir_acesso'
  | 'declarar_conflito';

interface ReportHeaderProps {
  report: Report;
  onOpenAction: (action: ActionType) => void;
}

export function ReportHeader({ report, onOpenAction }: ReportHeaderProps) {
  const isClosed = report.status === 'RESOLVED' || report.status === 'COMPLETED' || report.status === 'ARCHIVED';
  const slaInfo = calculateSlaStatus(report.slaDueDate, isClosed);
  const openTime = calculateOpenTime(report.createdAt, report.resolvedAt);

  const activeAssignment = report.assignments && report.assignments.length > 0
    ? report.assignments[report.assignments.length - 1]
    : null;
  const responsibleName = activeAssignment ? activeAssignment.assigneeName : 'Não atribuído';

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
      {/* Top Protocol Bar & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F5] pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center flex-wrap gap-2.5">
            <span className="font-heading text-xl font-bold text-[#0A0A0A] tracking-tight">
              {report.protocol}
            </span>

            {report.isRestricted && (
              <Badge variant="danger" className="flex items-center gap-1 text-[11px] font-semibold">
                <Lock className="w-3 h-3" />
                Acesso Restrito
              </Badge>
            )}

            {report.conflictDeclared && (
              <Badge variant="warning" className="flex items-center gap-1 text-[11px] font-semibold">
                <AlertOctagon className="w-3 h-3 text-[#B45309]" />
                Conflito de Interesse Sinalizado
              </Badge>
            )}

            <StatusBadge status={report.status} />
            <RiskBadge level={report.riskLevel} />
            <PriorityBadge level={report.priorityLevel} />
          </div>

          <h1 className="text-sm font-semibold text-[#171717] line-clamp-1">
            {report.title}
          </h1>
        </div>

        {/* Quick Main Action Group */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <PermissionGate permission={AdminPermissionEnum.ASSIGN_CASES}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenAction('atribuir')}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Atribuir
            </Button>
          </PermissionGate>

          <PermissionGate permission={AdminPermissionEnum.CHANGE_STATUS}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenAction('mudar_status')}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <FolderSync className="w-3.5 h-3.5" />
              Status
            </Button>
          </PermissionGate>

          <PermissionGate permission={AdminPermissionEnum.CONCLUDE_CASE}>
            {!isClosed && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAction('concluir')}
                className="text-xs gap-1.5 cursor-pointer bg-[#166534] hover:bg-[#14532D] text-white border-none"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Concluir
              </Button>
            )}
          </PermissionGate>

          {/* Complete 16 Actions Menu */}
          <DropdownMenu
            align="right"
            trigger={
              <Button variant="ghost" size="sm" className="px-2 cursor-pointer" aria-label="Menu de Ações">
                <MoreVertical className="w-4 h-4 text-[#525252]" />
              </Button>
            }
            items={[
              {
                label: 'Classificar Categoria/Tipo',
                icon: <Tag className="w-3.5 h-3.5 text-[#2563EB]" />,
                onClick: () => onOpenAction('classificar'),
              },
              {
                label: 'Atribuir Responsável',
                icon: <UserPlus className="w-3.5 h-3.5 text-[#2563EB]" />,
                onClick: () => onOpenAction('atribuir'),
              },
              {
                label: 'Transferir Unidade/Setor',
                icon: <ArrowRightLeft className="w-3.5 h-3.5 text-[#2563EB]" />,
                onClick: () => onOpenAction('transferir'),
              },
              {
                label: 'Alterar Status',
                icon: <FolderSync className="w-3.5 h-3.5 text-[#D97706]" />,
                onClick: () => onOpenAction('mudar_status'),
              },
              {
                label: 'Alterar Nível de Risco',
                icon: <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />,
                onClick: () => onOpenAction('mudar_risco'),
              },
              {
                label: 'Alterar Prioridade',
                icon: <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />,
                onClick: () => onOpenAction('mudar_prioridade'),
              },
              {
                label: 'Solicitar Informação',
                icon: <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />,
                onClick: () => onOpenAction('solicitar_informacao'),
              },
              {
                label: 'Iniciar Investigação',
                icon: <Shield className="w-3.5 h-3.5 text-[#7C3AED]" />,
                onClick: () => onOpenAction('iniciar_investigacao'),
              },
              {
                label: 'Adicionar Comentário Interno',
                icon: <FileText className="w-3.5 h-3.5 text-[#525252]" />,
                onClick: () => onOpenAction('adicionar_comentario'),
              },
              {
                label: 'Enviar Mensagem Pública',
                icon: <Send className="w-3.5 h-3.5 text-[#2563EB]" />,
                onClick: () => onOpenAction('enviar_mensagem'),
              },
              {
                label: 'Criar Plano de Ação',
                icon: <FilePlus2 className="w-3.5 h-3.5 text-[#166534]" />,
                onClick: () => onOpenAction('criar_plano_acao'),
              },
              {
                label: 'Concluir Manifestação',
                icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />,
                onClick: () => onOpenAction('concluir'),
              },
              {
                label: 'Arquivar Caso',
                icon: <Archive className="w-3.5 h-3.5 text-[#525252]" />,
                onClick: () => onOpenAction('arquivar'),
                isDanger: true,
              },
              {
                label: 'Reabrir Manifestação',
                icon: <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />,
                onClick: () => onOpenAction('reabrir'),
              },
              {
                label: report.isRestricted ? 'Remover Restrição de Acesso' : 'Restringir Acesso ao Caso',
                icon: <Lock className="w-3.5 h-3.5 text-[#DC2626]" />,
                onClick: () => onOpenAction('restringir_acesso'),
                isDanger: !report.isRestricted,
              },
              {
                label: 'Declarar Conflito de Interesse',
                icon: <ShieldOff className="w-3.5 h-3.5 text-[#DC2626]" />,
                onClick: () => onOpenAction('declarar_conflito'),
                isDanger: true,
              },
            ]}
          />
        </div>
      </div>

      {/* SLA & Attributes Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-2.5 rounded-md flex flex-col justify-between">
          <span className="text-[11px] text-[#737373] flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#525252]" /> SLA Previsto
          </span>
          <span
            className={`font-semibold mt-1 ${
              slaInfo.isOverdue ? 'text-[#DC2626]' : 'text-[#0A0A0A]'
            }`}
          >
            {slaInfo.text}
          </span>
        </div>

        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-2.5 rounded-md flex flex-col justify-between">
          <span className="text-[11px] text-[#737373] flex items-center gap-1 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-[#525252]" /> Responsável
          </span>
          <span className="font-semibold text-[#0A0A0A] mt-1 truncate">
            {responsibleName}
          </span>
        </div>

        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-2.5 rounded-md flex flex-col justify-between">
          <span className="text-[11px] text-[#737373] flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#525252]" /> Data de Entrada
          </span>
          <span className="font-semibold text-[#0A0A0A] mt-1">
            {formatDateTime(report.createdAt)}
          </span>
        </div>

        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-2.5 rounded-md flex flex-col justify-between">
          <span className="text-[11px] text-[#737373] flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#525252]" /> Tempo Decorrido
          </span>
          <span className="font-semibold text-[#0A0A0A] mt-1">
            {openTime}
          </span>
        </div>

        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-2.5 rounded-md flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] text-[#737373] flex items-center gap-1 font-medium">
            <Tag className="w-3.5 h-3.5 text-[#525252]" /> Categoria / Unidade
          </span>
          <span className="font-semibold text-[#0A0A0A] mt-1 truncate" title={`${report.categoryName} (${report.unitName})`}>
            {report.categoryName}
          </span>
        </div>
      </div>
    </div>
  );
}
