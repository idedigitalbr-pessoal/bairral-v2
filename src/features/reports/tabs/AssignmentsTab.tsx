import React from 'react';
import { UserCheck, UserPlus, Calendar, FileText, Clock } from 'lucide-react';
import { Report, Assignment } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { formatDateTime } from '../../../lib/dateUtils';
import { ActionType } from '../ReportHeader';

interface AssignmentsTabProps {
  report: Report;
  onOpenAction: (action: ActionType) => void;
}

export function AssignmentsTab({ report, onOpenAction }: AssignmentsTabProps) {
  const assignmentsList: Assignment[] = report.assignments || [];
  const activeAssignment = assignmentsList.length > 0 ? assignmentsList[assignmentsList.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Active Assignment Highlight */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md text-[#2563EB]">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-wider block">
              Responsável Atual pela Apuração
            </span>
            <h3 className="font-bold text-sm text-[#0A0A0A] mt-0.5">
              {activeAssignment ? activeAssignment.assigneeName : 'Nenhum analista atribuído no momento'}
            </h3>
            {activeAssignment && (
              <p className="text-xs text-[#525252] mt-1">
                Atribuído em {formatDateTime(activeAssignment.assignedAt)} por {activeAssignment.assignedByName}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onOpenAction('atribuir')}
          className="text-xs gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {activeAssignment ? 'Reatribuir Responsável' : 'Atribuir Responsável'}
        </Button>
      </div>

      {/* Assignment History Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
          <Clock className="w-4 h-4 text-[#171717]" />
          Histórico das Designações de Responsáveis
        </h3>

        {assignmentsList.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#737373]">
            Nenhuma atribuição registrada para este protocolo.
          </div>
        ) : (
          <div className="space-y-3">
            {assignmentsList.slice().reverse().map((asg, index) => {
              const isCurrent = index === 0;
              return (
                <div
                  key={asg.id}
                  className={`p-4 rounded-lg border text-xs space-y-2 ${
                    isCurrent
                      ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                      : 'bg-[#FAFAFA] border-[#E5E5E5]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A0A0A] text-xs">
                        {asg.assigneeName}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-[#166534] text-white px-2 py-0.5 rounded-full font-bold">
                          Ativo
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-[#737373]">
                      Designado em {formatDateTime(asg.assignedAt)} por {asg.assignedByName}
                    </span>
                  </div>

                  {asg.note ? (
                    <p className="text-[#525252] leading-relaxed italic bg-white p-2.5 rounded border border-black/5">
                      "{asg.note}"
                    </p>
                  ) : (
                    <p className="text-[#737373] italic">Sem notas de instrução enviadas.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
