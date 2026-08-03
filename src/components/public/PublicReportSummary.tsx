import React from 'react';
import {
  FileText,
  Calendar,
  Clock,
  Building,
  Tag,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Typography } from '../ui/Typography';
import { StatusBadge, ReportStatus } from '../data-display/StatusBadge';
import { Button } from '../ui/Button';
import { TrackPublicReportResponse } from '../../services/publicService';

interface PublicReportSummaryProps {
  report: TrackPublicReportResponse;
  onLogout: () => void;
}

export function PublicReportSummary({ report, onLogout }: PublicReportSummaryProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const mapStatusToBadge = (statusStr: string): ReportStatus => {
    const s = statusStr.toUpperCase();
    if (s === 'RECEIVED' || s === 'RECEBIDA') return 'Recebida';
    if (s === 'UNDER_REVIEW' || s === 'EM TRIAGEM') return 'Em triagem';
    if (s === 'WAITING_INFO' || s === 'AGUARDANDO INFORMAÇÕES') return 'Aguardando informações';
    if (s === 'IN_PROGRESS' || s === 'EM ANÁLISE') return 'Em análise';
    if (s === 'INVESTIGATION' || s === 'EM INVESTIGAÇÃO') return 'Em investigação';
    if (s === 'ACTION_PLAN' || s === 'PLANO DE AÇÃO') return 'Plano de ação';
    if (s === 'RESOLVED' || s === 'RESOLVIDA') return 'Resolvida';
    if (s === 'COMPLETED' || s === 'CONCLUÍDA') return 'Concluída';
    if (s === 'ARCHIVED' || s === 'REJECTED' || s === 'ARQUIVADA') return 'Arquivada';
    return 'Recebida';
  };

  const getTypeLabel = (type: string) => {
    const t = type.toUpperCase();
    if (t === 'DENUNCIA' || t === 'DENÚNCIA') return 'Denúncia';
    if (t === 'RECLAMACAO' || t === 'RECLAMAÇÃO') return 'Reclamação';
    if (t === 'ELOGIO') return 'Elogio';
    if (t === 'SUGESTAO' || t === 'SUGESTÃO') return 'Sugestão';
    return type;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Surface variant="card" className="space-y-6 border border-[#E5E5E5]">
      {/* Cabeçalho com Protocolo e Ações da Sessão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">Protocolo de Acompanhamento</span>
            <ShieldCheck className="w-4 h-4 text-[#0A0A0A]" />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#0A0A0A] tracking-tight">{report.protocol}</h1>
            <StatusBadge status={mapStatusToBadge(report.status)} size="md" />
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-[#525252]" />}
            className="text-xs"
          >
            Imprimir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            leftIcon={<LogOut className="w-4 h-4 text-[#737373]" />}
            className="text-xs font-medium border-[#D4D4D4] text-[#171717] hover:bg-[#F5F5F5]"
          >
            Sair do Acompanhamento
          </Button>
        </div>
      </div>

      {/* Banner de Status / Encerramento */}
      {report.isClosed ? (
        <div className="flex items-start gap-3 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-[#065F46] text-xs leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-sm text-[#064E3B]">Caso Encerrado e Concluído</strong>
            <p>
              Esta manifestação foi devidamente apurada e finalizada pela Ouvidoria / Comitê de Ética do Grupo Bairral. O envio de novas respostas e anexos para este protocolo foi desativado.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-3.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg text-[#0369A1] text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
          <div>
            <strong>Em Acompanhamento Ativo:</strong> Caso a comissão solicite informações adicionais, você poderá enviar esclarecimentos e novos documentos diretamente pelo formulário abaixo nesta página.
          </div>
        </div>
      )}

      {/* Título Resumido da Manifestação */}
      {report.title && (
        <div className="p-3.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md">
          <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wide block mb-1">Título da Manifestação</span>
          <p className="text-sm font-semibold text-[#171717]">{report.title}</p>
        </div>
      )}

      {/* Grade de Metadados Públicos Protegidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <Tag className="w-3.5 h-3.5 text-[#525252]" />
            <span>Tipo</span>
          </div>
          <p className="text-xs font-semibold text-[#171717]">{getTypeLabel(report.type)}</p>
        </div>

        <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <FileText className="w-3.5 h-3.5 text-[#525252]" />
            <span>Categoria</span>
          </div>
          <p className="text-xs font-semibold text-[#171717] truncate">{report.categoryName || 'Geral'}</p>
        </div>

        <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <Building className="w-3.5 h-3.5 text-[#525252]" />
            <span>Unidade</span>
          </div>
          <p className="text-xs font-semibold text-[#171717] truncate">{report.unitName || 'Grupo Bairral'}</p>
        </div>

        <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <Calendar className="w-3.5 h-3.5 text-[#525252]" />
            <span>Data de Registro</span>
          </div>
          <p className="text-xs font-semibold text-[#171717]">{formatDate(report.createdAt)}</p>
        </div>
      </div>

      {/* Datas complementares */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#737373] pt-2 border-t border-[#F5F5F5] gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#525252]" />
          <span>Última atualização: <strong>{formatDate(report.updatedAt)}</strong></span>
        </div>
        {report.slaDueDate && (
          <div>
            Prazo estimado de resposta: <strong className="text-[#171717]">{formatDate(report.slaDueDate)}</strong>
          </div>
        )}
      </div>
    </Surface>
  );
}
