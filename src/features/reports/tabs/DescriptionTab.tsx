import React from 'react';
import {
  FileText,
  User,
  ShieldCheck,
  Mail,
  Phone,
  Building,
  MapPin,
  Tag,
  Lock,
} from 'lucide-react';
import { Report } from '../../../types';
import { AdminPermissionEnum } from '../../../types/auth';
import { PermissionGate } from '../../../components/auth/PermissionGate';
import { Badge } from '../../../components/data-display/Badge';
import { formatDateTime } from '../../../lib/dateUtils';

interface DescriptionTabProps {
  report: Report;
}

export function DescriptionTab({ report }: DescriptionTabProps) {
  const isAnonymous = report.registrationType === 'ANONYMOUS' || report.reporter?.type === 'ANONYMOUS';

  const relationshipLabels: Record<string, string> = {
    EMPLOYEE: 'Colaborador / Funcionário',
    CLIENT: 'Cliente / Contratante de Serviços',
    SUPPLIER: 'Fornecedor / Prestador',
    PARTNER: 'Parceiro Comercial / Concessionária',
    COMMUNITY: 'Comunidade Local',
    EX_EMPLOYEE: 'Ex-colaborador',
    PATIENT: 'Cliente / Atendido',
    FAMILY_MEMBER: 'Familiar de Colaborador',
    OTHER: 'Outro Vínculo',
  };

  const relationship = report.reporter?.relationshipToHospital
    ? relationshipLabels[report.reporter.relationshipToHospital] || report.reporter.relationshipToHospital
    : 'Não especificado';

  return (
    <div className="space-y-6">
      {/* Reporter Identity Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
          <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
            <User className="w-4 h-4 text-[#171717]" />
            Identificação do Manifestante
          </h3>

          <Badge variant={isAnonymous ? 'secondary' : 'info'} className="text-xs font-semibold">
            {isAnonymous ? 'Manifestação Anônima' : 'Manifestação Identificada'}
          </Badge>
        </div>

        {isAnonymous ? (
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-md flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="text-xs text-[#1E40AF] space-y-1">
              <h4 className="font-bold">Garantia Absoluta de Anonymato</h4>
              <p className="leading-relaxed">
                Este relato foi registrado de forma 100% anônima pelo manifestante. Nenhuma informação pessoal de rastreamento (IP, e-mail ou dados de dispositivo) é armazenada nos servidores do Grupo Bairral.
              </p>
            </div>
          </div>
        ) : (
          <PermissionGate permission={AdminPermissionEnum.VIEW_IDENTITY}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
              <div>
                <span className="text-[#737373] text-[11px] block">Nome do Relator</span>
                <span className="font-semibold text-[#0A0A0A] block mt-0.5">
                  {report.reporter?.name || 'Não informado'}
                </span>
              </div>

              <div>
                <span className="text-[#737373] text-[11px] block flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#525252]" /> E-mail de Contato
                </span>
                <span className="font-semibold text-[#0A0A0A] block mt-0.5 truncate">
                  {report.reporter?.email || '—'}
                </span>
              </div>

              <div>
                <span className="text-[#737373] text-[11px] block flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#525252]" /> Telefone
                </span>
                <span className="font-semibold text-[#0A0A0A] block mt-0.5">
                  {report.reporter?.phone || '—'}
                </span>
              </div>

              <div>
                <span className="text-[#737373] text-[11px] block">Vínculo com o Grupo Bairral</span>
                <span className="font-semibold text-[#0A0A0A] block mt-0.5">
                  {relationship}
                </span>
              </div>
            </div>
          </PermissionGate>
        )}
      </div>

      {/* Full Content Manifestation */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
          <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#171717]" />
            Descrição Detalhada do Fato Reclamado
          </h3>
          <span className="text-xs text-[#737373]">
            Registrado em {formatDateTime(report.createdAt)}
          </span>
        </div>

        <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md text-xs text-[#171717] leading-relaxed whitespace-pre-wrap font-sans">
          {report.description}
        </div>
      </div>

      {/* Location and Category Metadata */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
          <MapPin className="w-4 h-4 text-[#171717]" />
          Localização da Ocorrência e Enquadramento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-3 rounded-md">
            <span className="text-[#737373] text-[11px] block flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-[#525252]" /> Unidade Operacional
            </span>
            <span className="font-bold text-[#0A0A0A] block mt-1">
              {report.unitName}
            </span>
          </div>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-3 rounded-md">
            <span className="text-[#737373] text-[11px] block flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-[#525252]" /> Setor / Departamento
            </span>
            <span className="font-bold text-[#0A0A0A] block mt-1">
              {report.departmentName || 'Não especificado'}
            </span>
          </div>

          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-3 rounded-md">
            <span className="text-[#737373] text-[11px] block flex items-center gap-1 font-medium">
              <Tag className="w-3.5 h-3.5 text-[#525252]" /> Categoria Classificada
            </span>
            <span className="font-bold text-[#0A0A0A] block mt-1">
              {report.categoryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
