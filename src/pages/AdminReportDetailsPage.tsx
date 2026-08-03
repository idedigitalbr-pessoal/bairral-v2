import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  LayoutDashboard,
  FileText,
  Users,
  Paperclip,
  MessageSquare,
  Lock,
  UserCheck,
  FilePlus2,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useReport } from '../hooks/useReports';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { ReportHeader, ActionType } from '../features/reports/ReportHeader';
import { ReportActionModals } from '../features/reports/ReportActionModals';
import { OverviewTab } from '../features/reports/tabs/OverviewTab';
import { DescriptionTab } from '../features/reports/tabs/DescriptionTab';
import { RelatedPeopleTab } from '../features/reports/tabs/RelatedPeopleTab';
import { EvidencesTab } from '../features/reports/tabs/EvidencesTab';
import { PublicMessagesTab } from '../features/reports/tabs/PublicMessagesTab';
import { InternalCommentsTab } from '../features/reports/tabs/InternalCommentsTab';
import { AssignmentsTab } from '../features/reports/tabs/AssignmentsTab';
import { ActionPlansTab } from '../features/reports/tabs/ActionPlansTab';
import { TimelineTab } from '../features/reports/tabs/TimelineTab';
import { AuditTab } from '../features/reports/tabs/AuditTab';
import { Toast } from '../components/feedback/Toast';

export function AdminReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const reportId = id || 'rep-1';

  const { data: report, isLoading, isError } = useReport(reportId);

  // Active action modal
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{
    title: string;
    message?: string;
    variant: 'success' | 'danger' | 'info' | 'warning';
  } | null>(null);

  const showToast = (
    title: string,
    message?: string,
    variant: 'success' | 'danger' | 'info' | 'warning' = 'info'
  ) => {
    setToast({ title, message, variant });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-[#737373] space-y-3">
        <div className="w-8 h-8 border-2 border-[#171717] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-semibold">Carregando detalhes do protocolo...</p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-8 text-center space-y-4 max-w-lg mx-auto my-12 shadow-xs">
        <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto" />
        <h2 className="text-base font-bold text-[#0A0A0A]">Manifestação Não Encontrada</h2>
        <p className="text-xs text-[#525252]">
          Não foi possível carregar os detalhes do protocolo solicitado (#{reportId}).
        </p>
        <Link
          to="/admin/manifestacoes"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista de Manifestações
        </Link>
      </div>
    );
  }

  // Define 10 Tabs
  const tabs: TabItem[] = [
    {
      id: 'visao_geral',
      label: 'Visão Geral',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      content: <OverviewTab report={report} onOpenAction={setActiveAction} />,
    },
    {
      id: 'relato',
      label: 'Relato',
      icon: <FileText className="w-3.5 h-3.5" />,
      content: <DescriptionTab report={report} />,
    },
    {
      id: 'pessoas',
      label: 'Pessoas Relacionadas',
      icon: <Users className="w-3.5 h-3.5" />,
      badge: (
        <span className="text-[10px] bg-[#F5F5F5] text-[#171717] px-1.5 py-0.2 rounded-full font-bold">
          {report.relatedPeople?.length || 0}
        </span>
      ),
      content: <RelatedPeopleTab report={report} onShowToast={showToast} />,
    },
    {
      id: 'evidencias',
      label: 'Evidências',
      icon: <Paperclip className="w-3.5 h-3.5" />,
      badge: (
        <span className="text-[10px] bg-[#F5F5F5] text-[#171717] px-1.5 py-0.2 rounded-full font-bold">
          {report.attachments?.length || 0}
        </span>
      ),
      content: <EvidencesTab report={report} onShowToast={showToast} />,
    },
    {
      id: 'mensagens',
      label: 'Mensagens',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      badge: (
        <span className="text-[10px] bg-[#F5F5F5] text-[#171717] px-1.5 py-0.2 rounded-full font-bold">
          {report.publicMessages?.length || 0}
        </span>
      ),
      content: <PublicMessagesTab report={report} onShowToast={showToast} />,
    },
    {
      id: 'comentarios',
      label: 'Comentários Internos',
      icon: <Lock className="w-3.5 h-3.5" />,
      badge: (
        <span className="text-[10px] bg-[#FEF2F2] text-[#DC2626] px-1.5 py-0.2 rounded-full font-bold">
          {report.internalComments?.length || 0}
        </span>
      ),
      content: <InternalCommentsTab report={report} onShowToast={showToast} />,
    },
    {
      id: 'atribuicoes',
      label: 'Atribuições',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      badge: (
        <span className="text-[10px] bg-[#F5F5F5] text-[#171717] px-1.5 py-0.2 rounded-full font-bold">
          {report.assignments?.length || 0}
        </span>
      ),
      content: <AssignmentsTab report={report} onOpenAction={setActiveAction} />,
    },
    {
      id: 'plano_acao',
      label: 'Plano de Ação',
      icon: <FilePlus2 className="w-3.5 h-3.5" />,
      badge: (
        <span className="text-[10px] bg-[#F5F5F5] text-[#171717] px-1.5 py-0.2 rounded-full font-bold">
          {report.actionPlans?.length || 0}
        </span>
      ),
      content: <ActionPlansTab report={report} onOpenAction={setActiveAction} />,
    },
    {
      id: 'linha_tempo',
      label: 'Linha do Tempo',
      icon: <Clock className="w-3.5 h-3.5" />,
      content: <TimelineTab report={report} />,
    },
    {
      id: 'auditoria',
      label: 'Auditoria',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      content: <AuditTab report={report} />,
    },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Top Back Navigation & Title */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/manifestacoes"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#525252] hover:text-[#0A0A0A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista de Manifestações
        </Link>
      </div>

      {/* Main Header Component */}
      <ReportHeader report={report} onOpenAction={setActiveAction} />

      {/* 10 Tabs Navigation Bar */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 shadow-xs">
        <Tabs tabs={tabs} defaultTabId="visao_geral" variant="line" />
      </div>

      {/* Modal Actions Handler for all 16 Simulated Actions */}
      <ReportActionModals
        report={report}
        activeAction={activeAction}
        onClose={() => setActiveAction(null)}
        onShowToast={showToast}
      />
    </div>
  );
}
