import React from 'react';
import {
  Clock,
  FolderSync,
  UserPlus,
  MessageSquare,
  FileText,
  FilePlus2,
  AlertOctagon,
  CheckCircle2,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { Report } from '../../../types';
import { formatDateTime } from '../../../lib/dateUtils';

interface TimelineTabProps {
  report: Report;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'CREATED' | 'STATUS_CHANGE' | 'ASSIGNMENT' | 'PUBLIC_MSG' | 'INTERNAL_COMMENT' | 'ACTION_PLAN' | 'CONFLICT';
  title: string;
  actor: string;
  description?: string;
  badgeText?: string;
}

export function TimelineTab({ report }: TimelineTabProps) {
  const events: TimelineEvent[] = [];

  // 1. Creation event
  events.push({
    id: `ev-created-${report.id}`,
    timestamp: report.createdAt,
    type: 'CREATED',
    title: `Abertura do Protocolo ${report.protocol}`,
    actor: report.reporter?.name || 'Manifestante (Canal Público)',
    description: `Manifestação registrada na categoria "${report.categoryName}" para a unidade "${report.unitName}".`,
  });

  // 2. Status History
  (report.statusHistory || []).forEach((sh) => {
    events.push({
      id: `ev-sh-${sh.id}`,
      timestamp: sh.changedAt,
      type: 'STATUS_CHANGE',
      title: `Alteração de Status para ${sh.newStatus}`,
      actor: sh.changedByName || 'Membro do Comitê',
      description: sh.reason ? `Justificativa: ${sh.reason}` : undefined,
      badgeText: sh.newStatus,
    });
  });

  // 3. Assignments
  (report.assignments || []).forEach((asg) => {
    events.push({
      id: `ev-asg-${asg.id}`,
      timestamp: asg.assignedAt,
      type: 'ASSIGNMENT',
      title: `Atribuição de Caso para ${asg.assigneeName}`,
      actor: asg.assignedByName,
      description: asg.note ? `Nota: ${asg.note}` : undefined,
    });
  });

  // 4. Public Messages
  (report.publicMessages || []).forEach((pm) => {
    events.push({
      id: `ev-pm-${pm.id}`,
      timestamp: pm.createdAt,
      type: 'PUBLIC_MSG',
      title: `Mensagem Pública (${pm.senderName})`,
      actor: pm.senderName,
      description: pm.content,
    });
  });

  // 5. Internal Comments
  (report.internalComments || []).forEach((ic) => {
    events.push({
      id: `ev-ic-${ic.id}`,
      timestamp: ic.createdAt,
      type: 'INTERNAL_COMMENT',
      title: `Nota Interna Sigilosa`,
      actor: `${ic.authorName} (${ic.authorRole})`,
      description: ic.content,
    });
  });

  // 6. Action Plans
  (report.actionPlans || []).forEach((ap) => {
    events.push({
      id: `ev-ap-${ap.id}`,
      timestamp: ap.createdAt,
      type: 'ACTION_PLAN',
      title: `Plano de Ação Criado: ${ap.title}`,
      actor: ap.responsibleName,
      description: ap.description,
    });
  });

  // 7. Conflict
  if (report.conflictDeclared && report.conflictNote) {
    events.push({
      id: `ev-conflict-${report.id}`,
      timestamp: report.updatedAt,
      type: 'CONFLICT',
      title: 'Declaração de Conflito de Interesse / Suspeição',
      actor: 'Analista de Compliance',
      description: report.conflictNote,
    });
  }

  // Sort chronological descending (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'CREATED':
        return <FileCheck2 className="w-4 h-4 text-[#2563EB]" />;
      case 'STATUS_CHANGE':
        return <FolderSync className="w-4 h-4 text-[#D97706]" />;
      case 'ASSIGNMENT':
        return <UserPlus className="w-4 h-4 text-[#2563EB]" />;
      case 'PUBLIC_MSG':
        return <MessageSquare className="w-4 h-4 text-[#2563EB]" />;
      case 'INTERNAL_COMMENT':
        return <FileText className="w-4 h-4 text-[#525252]" />;
      case 'ACTION_PLAN':
        return <FilePlus2 className="w-4 h-4 text-[#166534]" />;
      case 'CONFLICT':
        return <AlertOctagon className="w-4 h-4 text-[#DC2626]" />;
      default:
        return <Clock className="w-4 h-4 text-[#525252]" />;
    }
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-6">
      <div>
        <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#171717]" />
          Linha do Tempo Cronológica Unificada da Tramitação
        </h3>
        <p className="text-xs text-[#737373] mt-0.5">
          Histórico visual completo combinando registros de sistema, oitivas, mensagens e análises.
        </p>
      </div>

      <div className="relative border-l-2 border-[#E5E5E5] ml-3 pl-6 space-y-6">
        {events.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#E5E5E5] flex items-center justify-center shadow-xs">
              {getEventIcon(ev.type)}
            </div>

            <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-3.5 rounded-md text-xs space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/5 pb-1.5">
                <span className="font-bold text-[#0A0A0A]">{ev.title}</span>
                <span className="text-[10px] text-[#737373]">
                  {formatDateTime(ev.timestamp)}
                </span>
              </div>

              <div className="text-[11px] text-[#525252]">
                Por: <span className="font-semibold text-[#0A0A0A]">{ev.actor}</span>
              </div>

              {ev.description && (
                <p className="text-[#262626] leading-relaxed pt-1 whitespace-pre-wrap">
                  {ev.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
