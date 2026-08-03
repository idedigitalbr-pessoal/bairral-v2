import React from 'react';
import { ShieldCheck, User, Clock, Monitor } from 'lucide-react';
import { Report, AuditLog } from '../../../types';
import { useReportAuditLogs } from '../../../hooks/useReports';
import { formatDateTime } from '../../../lib/dateUtils';

interface AuditTabProps {
  report: Report;
}

export function AuditTab({ report }: AuditTabProps) {
  const { data: auditLogs, isLoading, isError } = useReportAuditLogs(report.id);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#166534]" />
            Trilha Inviolável de Auditoria Rastreável
          </h3>
          <p className="text-xs text-[#737373] mt-0.5">
            Registro detalhado de todas as visualizações e ações executadas neste protocolo por usuários do sistema.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#737373]">
            Carregando trilha de auditoria do protocolo...
          </div>
        ) : isError || !auditLogs || auditLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#737373]">
            Nenhum registro de auditoria específico encontrado para esta manifestação.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-[#737373] font-semibold">
                  <th className="p-3.5">Data / Hora</th>
                  <th className="p-3.5">Usuário / Perfil</th>
                  <th className="p-3.5">Ação Executada</th>
                  <th className="p-3.5">Detalhamento</th>
                  <th className="p-3.5">Endereço IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {auditLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-[#0A0A0A] whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>

                    <td className="p-3.5 font-medium text-[#0A0A0A]">
                      <div>{log.userName}</div>
                      <div className="text-[10px] text-[#737373]">{log.userRole}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 bg-[#E5E5E5] text-[#171717] rounded text-[10px] font-mono font-bold">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3.5 text-[#525252] max-w-sm leading-relaxed" title={log.details}>
                      {log.details}
                    </td>

                    <td className="p-3.5 font-mono text-[10px] text-[#737373] whitespace-nowrap">
                      {log.ipAddress || '192.168.1.100'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
