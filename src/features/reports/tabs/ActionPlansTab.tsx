import React from 'react';
import { FilePlus2, CheckCircle2, Clock, AlertTriangle, User, Calendar } from 'lucide-react';
import { Report, ActionPlan } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/data-display/Badge';
import { formatDate } from '../../../lib/dateUtils';
import { ActionType } from '../ReportHeader';

interface ActionPlansTabProps {
  report: Report;
  onOpenAction: (action: ActionType) => void;
}

export function ActionPlansTab({ report, onOpenAction }: ActionPlansTabProps) {
  const plansList: ActionPlan[] = report.actionPlans || [];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'COMPLETED':
        return <Badge variant="success">Concluído</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">Em Andamento</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="warning">Não Iniciado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
            <FilePlus2 className="w-4 h-4 text-[#171717]" />
            Planos de Ação Corretivos e Mitigatórios
          </h3>
          <p className="text-xs text-[#737373] mt-0.5">
            Ações estruturadas com prazos e gestores responsáveis vinculadas a esta manifestação.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onOpenAction('criar_plano_acao')}
          className="text-xs gap-1.5 cursor-pointer shrink-0"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          Criar Plano de Ação
        </Button>
      </div>

      {/* Action Plans Cards */}
      {plansList.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-8 text-center text-xs text-[#737373] shadow-xs">
          Nenhum plano de ação cadastrado para este protocolo até o momento.
        </div>
      ) : (
        <div className="space-y-4">
          {plansList.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-3 hover:border-[#D4D4D4] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F5] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <h4 className="font-bold text-xs text-[#0A0A0A]">
                    {plan.title}
                  </h4>
                  {getStatusBadge(plan.status)}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#737373]">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#525252]" /> {plan.responsibleName}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#0A0A0A]">
                    <Calendar className="w-3.5 h-3.5 text-[#525252]" /> Prazo: {formatDate(plan.dueDate)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#525252] leading-relaxed">
                {plan.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#737373]">
                  <span>Progresso de Execução</span>
                  <span className="text-[#0A0A0A]">{plan.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden border border-black/5">
                  <div
                    className="h-full bg-[#166534] transition-all duration-300"
                    style={{ width: `${plan.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
