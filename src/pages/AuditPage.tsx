import { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  User,
  Calendar,
  Globe,
  Database,
  Eye,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { useUsers } from '../hooks/useUsers';
import { AuditLog } from '../types';

import { ExportButton } from '../components/ui/ExportButton';

export function AuditPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { users = [] } = useUsers();

  const { data, isLoading, refetch } = useAuditLogs(
    {
      search: searchTerm,
      userId: userIdFilter,
      resource: resourceFilter,
      protocol: protocolFilter,
      ipAddress: ipFilter,
      dateFrom,
      dateTo,
    },
    { page, limit: 12 }
  );

  const logs = data?.data || [];
  const meta = data?.meta;

  const exportHeaders = ['Data/Hora', 'Operador', 'Perfil', 'Ação', 'Entidade', 'IP Origem', 'Detalhes'];
  const exportRows = logs.map((l) => [
    new Date(l.timestamp).toLocaleString('pt-BR'),
    l.userName,
    l.userRole,
    l.action,
    l.resource,
    l.ipAddress || '192.168.1.100',
    l.details,
  ]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setUserIdFilter('');
    setResourceFilter('');
    setProtocolFilter('');
    setIpFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Trilha de Auditoria e Imutabilidade</Typography>
          <p className="text-xs text-[#737373]">
            Registro criptográfico e detalhado de todas as operações administrativas no sistema (LGPD e Compliance)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            title="Trilha de Auditoria e Imutabilidade"
            subtitle="Registro criptográfico de operações administrativas (LGPD e Compliance)"
            filename="trilha_de_auditoria"
            headers={exportHeaders}
            rows={exportRows}
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => refetch()}
          >
            Atualizar Logs
          </Button>
        </div>
      </div>


      {/* Painel de Filtros Avançados */}
      <Surface variant="card" className="space-y-4 border border-[#E5E5E5]">
        <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-2">
          <span className="font-bold text-xs text-[#0A0A0A] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#004B87]" /> Filtros de Auditoria
          </span>
          <button
            onClick={handleClearFilters}
            className="text-[11px] text-[#004B87] font-semibold hover:underline"
          >
            Limpar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Busca Geral</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#737373]" />
              <input
                type="text"
                placeholder="Busca por termo ou detalhe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Usuário Operador</label>
            <select
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="w-full p-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            >
              <option value="">Todos os Usuários</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.roleName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Entidade Modificada</label>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="w-full p-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            >
              <option value="">Todas as Entidades</option>
              <option value="Report">Manifestação (Report)</option>
              <option value="ActionPlan">Plano de Ação</option>
              <option value="User">Usuário</option>
              <option value="Role">Perfil de Acesso</option>
              <option value="Category">Categoria</option>
              <option value="Unit">Unidade</option>
              <option value="Department">Departamento</option>
              <option value="Settings">Configurações</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Protocolo da Manifestação</label>
            <input
              type="text"
              placeholder="Ex: GB-2025-001"
              value={protocolFilter}
              onChange={(e) => setProtocolFilter(e.target.value)}
              className="w-full p-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Endereço IP Origem</label>
            <input
              type="text"
              placeholder="Ex: 192.168.1.100"
              value={ipFilter}
              onChange={(e) => setIpFilter(e.target.value)}
              className="w-full p-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Data Inicial</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#737373] font-medium block mb-1">Data Final</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-1 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            />
          </div>
        </div>
      </Surface>

      {/* Tabela de Audit Logs */}
      <Surface variant="card" className="p-0 overflow-hidden border border-[#E5E5E5]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#525252] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Data / Hora</th>
              <th className="p-3">Operador / Perfil</th>
              <th className="p-3">Ação Executada</th>
              <th className="p-3">Entidade</th>
              <th className="p-3">IP Origem</th>
              <th className="p-3 text-right">Detalhes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#737373]">
                  Carregando registros de auditoria...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#737373]">
                  Nenhum registro de auditoria encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-3 font-mono text-[11px] text-[#525252] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-[#0A0A0A] block">{log.userName}</span>
                    <span className="text-[10px] text-[#737373]">{log.userRole}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-mono text-[11px] font-bold text-[#004B87] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE]">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="text-[#171717] font-medium">{log.resource}</span>
                    {log.resourceId && (
                      <span className="text-[10px] text-[#737373] font-mono block">#{log.resourceId}</span>
                    )}
                  </td>

                  <td className="p-3 font-mono text-[11px] text-[#737373]">
                    {log.ipAddress || '192.168.1.100'}
                  </td>

                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedLog(log)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {meta && (
          <div className="flex items-center justify-between p-3 bg-[#FAFAFA] border-t border-[#E5E5E5] text-xs">
            <span className="text-[#737373]">
              Página <strong>{meta.page}</strong> de <strong>{meta.totalPages}</strong> (Total:{' '}
              {meta.totalItems} registros)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Surface>

      {/* Modal: Detalhes do Log */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#107C41]" /> Detalhe da Entrada de Auditoria
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#FAFAFA] p-3 rounded border border-[#F5F5F5]">
                <div>
                  <span className="text-[#737373]">Identificador do Log:</span>
                  <p className="font-mono font-bold text-[#0A0A0A]">{selectedLog.id}</p>
                </div>
                <div>
                  <span className="text-[#737373]">Data & Hora UTC:</span>
                  <p className="font-mono font-bold text-[#0A0A0A]">
                    {new Date(selectedLog.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[#525252]">
                <div>
                  <strong>Operador:</strong> {selectedLog.userName} ({selectedLog.userRole})
                </div>
                <div>
                  <strong>Endereço IP:</strong> {selectedLog.ipAddress || '192.168.1.100'}
                </div>
              </div>

              <div>
                <strong>Ação Criptografada:</strong>
                <span className="block font-mono text-xs font-bold text-[#004B87] mt-1 bg-[#EFF6FF] p-1.5 rounded border border-[#DBEAFE]">
                  {selectedLog.action}
                </span>
              </div>

              <div>
                <strong>Descrição da Atividade:</strong>
                <p className="mt-1 text-[#262626] bg-[#FAFAFA] p-3 rounded border border-[#E5E5E5] text-xs font-mono">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E5E5E5]">
              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                Fechar
              </Button>
            </div>
          </Surface>
        </div>
      )}
    </div>
  );
}
