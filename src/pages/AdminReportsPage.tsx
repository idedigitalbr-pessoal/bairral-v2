import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, UserCheck, AlertTriangle, Clock, Filter, FileText, LayoutList, LayoutGrid, Columns3, Calendar, X } from 'lucide-react';
import { DataTable, DataTableRow } from '../components/data-display/DataTable';
import { ReportCardsView } from '../components/reports/ReportCardsView';
import { ReportKanbanView } from '../components/reports/ReportKanbanView';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { SearchInput } from '../components/forms/SearchInput';
import { Select } from '../components/forms/Select';
import { Pagination } from '../components/navigation/Pagination';
import { Spinner } from '../components/feedback/Spinner';
import { useReports } from '../hooks/useReports';
import { ReportStatusEnum, RiskLevelEnum, PriorityLevelEnum, Report } from '../types';
import { ReportStatus } from '../components/data-display/StatusBadge';
import { RiskLevel } from '../components/data-display/RiskBadge';
import { PriorityLevel } from '../components/data-display/PriorityBadge';
import { formatDate } from '../lib/dateUtils';

import { ExportButton } from '../components/ui/ExportButton';

export function AdminReportsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filtro = searchParams.get('filtro') || 'todos';

  const [viewMode, setViewMode] = useState<'lista' | 'cards' | 'kanban'>('lista');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  // Filtros por data
  const [periodPreset, setPeriodPreset] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);

  const handlePeriodChange = (preset: string) => {
    setPeriodPreset(preset);
    setCurrentPage(1);

    const today = new Date();
    const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

    if (preset === '7d') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setDateFrom(formatDateStr(past));
      setDateTo(formatDateStr(today));
    } else if (preset === '30d') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setDateFrom(formatDateStr(past));
      setDateTo(formatDateStr(today));
    } else if (preset === '90d') {
      const past = new Date();
      past.setDate(today.getDate() - 90);
      setDateFrom(formatDateStr(past));
      setDateTo(formatDateStr(today));
    } else if (preset === 'all') {
      setDateFrom('');
      setDateTo('');
    }
  };

  const clearDateFilter = () => {
    setPeriodPreset('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  // Configuração visual e de filtros conforme a aba selecionada na Sidebar
  let pageTitle = 'Manifestações & Chamados';
  let pageSubtitle = 'Gerenciamento completo do acervo de relatos recebidos';
  let headerBadge: { label: string; variant: 'yellow' | 'danger' | 'warning' | 'info' } | null = null;

  const queryFilters: any = {
    search: search || undefined,
  };

  if (filtro === 'minhas') {
    pageTitle = 'Minhas Atribuições';
    pageSubtitle = 'Manifestações sob sua responsabilidade e acompanhamento direto';
    headerBadge = { label: 'Atribuídos a você', variant: 'info' };
    queryFilters.assignedToMe = true;
  } else if (filtro === 'criticos') {
    pageTitle = 'Casos Críticos';
    pageSubtitle = 'Manifestações com nível de risco Alto ou Crítico que requerem ação urgente';
    headerBadge = { label: 'Prioridade Alta / Crítica', variant: 'danger' };
    queryFilters.criticalOnly = true;
  } else if (filtro === 'atraso') {
    pageTitle = 'Casos em Atraso';
    pageSubtitle = 'Manifestações com estouro de SLA ou prazo de resposta estipulado vencido';
    headerBadge = { label: 'Fora do SLA', variant: 'warning' };
    queryFilters.delayedOnly = true;
  } else if (filtro === 'abertos') {
    pageTitle = 'Casos em Aberto';
    pageSubtitle = 'Manifestações ativas em fluxo de apuração, triagem ou análise';
    headerBadge = { label: 'Em Aberto', variant: 'info' };
    queryFilters.openOnly = true;
  } else if (filtro === 'recentes') {
    pageTitle = 'Novas Manifestações (Recentes)';
    pageSubtitle = 'Manifestações recebidas recentemente e pendentes de triagem';
    headerBadge = { label: 'Recentes', variant: 'info' };
    queryFilters.recentOnly = true;
  } else if (filtro === 'concluidos') {
    pageTitle = 'Casos Concluídos';
    pageSubtitle = 'Manifestações finalizadas e resolvidas com desfecho registrado';
    headerBadge = { label: 'Concluídas', variant: 'yellow' };
    queryFilters.completedOnly = true;
  }

  // Filtros vindos dos gráficos e parâmetros de URL
  const categoryIdParam = searchParams.get('categoryId') || searchParams.get('categoria');
  const categoryNameParam = searchParams.get('categoryName');
  const unitIdParam = searchParams.get('unitId') || searchParams.get('unidade');
  const statusParam = searchParams.get('status');
  const riskParam = searchParams.get('riskLevel') || searchParams.get('risco');
  const regTypeParam = searchParams.get('registrationType') || searchParams.get('tipo');

  if (categoryNameParam) {
    pageTitle = `Categoria: ${categoryNameParam}`;
    pageSubtitle = `Manifestações filtradas pela categoria ${categoryNameParam}`;
    headerBadge = { label: `Categoria: ${categoryNameParam}`, variant: 'yellow' };
    queryFilters.search = categoryNameParam;
  } else if (categoryIdParam) {
    pageTitle = 'Filtro por Categoria';
    pageSubtitle = 'Manifestações filtradas pela categoria selecionada no gráfico';
    headerBadge = { label: `Categoria selecionada`, variant: 'yellow' };
    queryFilters.categoryId = categoryIdParam;
  }

  if (unitIdParam) {
    pageTitle = pageTitle === 'Manifestações & Chamados' ? 'Filtro por Unidade Operacional' : pageTitle;
    pageSubtitle = 'Manifestações filtradas por unidade de atendimento';
    headerBadge = headerBadge || { label: 'Unidade selecionada', variant: 'info' };
    queryFilters.unitId = unitIdParam;
  }

  if (statusParam) {
    pageTitle = pageTitle === 'Manifestações & Chamados' ? `Filtro por Status (${statusParam})` : pageTitle;
    headerBadge = headerBadge || { label: `Status: ${statusParam}`, variant: 'info' };
    queryFilters.status = [statusParam];
  }

  if (riskParam) {
    pageTitle = pageTitle === 'Manifestações & Chamados' ? `Filtro por Nível de Risco (${riskParam})` : pageTitle;
    headerBadge = headerBadge || { label: `Risco: ${riskParam}`, variant: riskParam === 'CRITICAL' || riskParam === 'HIGH' ? 'danger' : 'yellow' };
    queryFilters.riskLevel = [riskParam];
  }

  if (regTypeParam) {
    const isAnon = regTypeParam === 'ANONYMOUS' || regTypeParam === 'Anônimas';
    headerBadge = headerBadge || { label: isAnon ? 'Apenas Anônimas' : 'Apenas Identificadas', variant: 'info' };
    queryFilters.registrationType = isAnon ? 'ANONYMOUS' : 'IDENTIFIED';
  }

  if (selectedRisk !== 'all') {
    queryFilters.riskLevel = [selectedRisk];
  }

  if (dateFrom) {
    queryFilters.dateFrom = dateFrom;
  }

  if (dateTo) {
    queryFilters.dateTo = dateTo;
  }

  // Ajusta o limite por página com base no modo de visualização
  const limit = viewMode === 'kanban' ? 100 : viewMode === 'cards' ? 12 : 10;

  const { data: paginatedData, isLoading } = useReports(queryFilters, { page: currentPage, limit });

  const reportsList = paginatedData?.data || [];
  const totalPages = paginatedData?.meta?.totalPages || 1;

  // Mapeamento de enums para os rótulos visuais da tabela
  const mapStatusToLabel = (status: ReportStatusEnum): ReportStatus => {
    switch (status) {
      case ReportStatusEnum.RECEIVED: return 'Recebida';
      case ReportStatusEnum.TRIAGE: return 'Em triagem';
      case ReportStatusEnum.PENDING_INFO: return 'Informações pendentes';
      case ReportStatusEnum.ANALYSIS: return 'Em análise';
      case ReportStatusEnum.INVESTIGATION: return 'Em investigação';
      case ReportStatusEnum.FORWARDED: return 'Encaminhada';
      case ReportStatusEnum.ACTION_PLAN: return 'Plano de ação';
      case ReportStatusEnum.RESOLVED: return 'Concluída';
      case ReportStatusEnum.COMPLETED: return 'Concluída';
      case ReportStatusEnum.ARCHIVED: return 'Arquivada';
      case ReportStatusEnum.REOPENED: return 'Reaberta';
      default: return 'Em triagem';
    }
  };

  const mapRiskToLabel = (risk: RiskLevelEnum): RiskLevel => {
    switch (risk) {
      case RiskLevelEnum.LOW: return 'baixo';
      case RiskLevelEnum.MEDIUM: return 'médio';
      case RiskLevelEnum.HIGH: return 'alto';
      case RiskLevelEnum.CRITICAL: return 'crítico';
      default: return 'médio';
    }
  };

  const mapPriorityToLabel = (priority: PriorityLevelEnum): PriorityLevel => {
    switch (priority) {
      case PriorityLevelEnum.LOW: return 'baixa';
      case PriorityLevelEnum.NORMAL: return 'normal';
      case PriorityLevelEnum.HIGH: return 'alta';
      case PriorityLevelEnum.URGENT: return 'urgente';
      default: return 'normal';
    }
  };

  const tableData: DataTableRow[] = reportsList.map((rep) => ({
    id: rep.id,
    protocol: rep.protocol,
    title: rep.title,
    status: mapStatusToLabel(rep.status),
    risk: mapRiskToLabel(rep.riskLevel),
    priority: mapPriorityToLabel(rep.priorityLevel),
    createdAt: formatDate(rep.createdAt),
  }));

  const exportHeaders = ['Protocolo', 'Título / Resumo', 'Status', 'Nível de Risco', 'Prioridade', 'Data de Criação'];
  const exportRows = reportsList.map((r) => [
    r.protocol,
    r.title,
    mapStatusToLabel(r.status),
    mapRiskToLabel(r.riskLevel).toUpperCase(),
    mapPriorityToLabel(r.priorityLevel).toUpperCase(),
    formatDate(r.createdAt),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h2">{pageTitle}</Typography>
            {headerBadge && (
              <Badge variant={headerBadge.variant} size="sm">
                {headerBadge.label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#737373] mt-1">{pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            title={pageTitle}
            subtitle={pageSubtitle}
            filename={`manifestacoes_${filtro}`}
            headers={exportHeaders}
            rows={exportRows}
          />
        </div>
      </div>

      <Surface variant="card" className="space-y-4">
        {/* Barra de Filtros + Seletor de Modo de Exibição */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Buscar por protocolo, título..."
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { label: 'Todos os Status', value: 'all' },
                { label: 'Em triagem', value: ReportStatusEnum.TRIAGE },
                { label: 'Em análise', value: ReportStatusEnum.ANALYSIS },
                { label: 'Em investigação', value: ReportStatusEnum.INVESTIGATION },
                { label: 'Plano de ação', value: ReportStatusEnum.ACTION_PLAN },
                { label: 'Concluídas', value: ReportStatusEnum.COMPLETED },
              ]}
            />
            <Select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              options={[
                { label: 'Todos os Riscos', value: 'all' },
                { label: 'Crítico', value: RiskLevelEnum.CRITICAL },
                { label: 'Alto', value: RiskLevelEnum.HIGH },
                { label: 'Médio', value: RiskLevelEnum.MEDIUM },
                { label: 'Baixo', value: RiskLevelEnum.LOW },
              ]}
            />
            <Select
              value={periodPreset}
              onChange={(e) => handlePeriodChange(e.target.value)}
              options={[
                { label: 'Qualquer Período', value: 'all' },
                { label: 'Últimos 7 dias', value: '7d' },
                { label: 'Últimos 30 dias', value: '30d' },
                { label: 'Últimos 90 dias', value: '90d' },
                { label: 'Período personalizado', value: 'custom' },
              ]}
            />
          </div>

          {/* Botões do Modo de Visualização (Lista | Card | Kanban) */}
          <div className="flex items-center bg-[#F5F5F5] p-1 rounded-lg border border-[#E5E5E5] self-start xl:self-auto shrink-0">
            <button
              onClick={() => { setViewMode('lista'); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'lista'
                  ? 'bg-white text-[#171717] shadow-sm'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
              title="Exibição em Tabela / Lista"
            >
              <LayoutList className="w-4 h-4" />
              <span>Lista</span>
            </button>

            <button
              onClick={() => { setViewMode('cards'); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-[#171717] shadow-sm'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
              title="Exibição em Cards"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => { setViewMode('kanban'); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#171717] shadow-sm'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
              title="Exibição em Pipeline Kanban"
            >
              <Columns3 className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>
        </div>

        {/* Campos de Data Customizada e Feedback de Filtro Ativo */}
        {(periodPreset === 'custom' || dateFrom || dateTo) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5] text-xs">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <span className="font-semibold text-[#171717] flex items-center gap-1.5 shrink-0">
                <Calendar className="w-4 h-4 text-[#806300]" />
                Filtrar por Intervalo:
              </span>
              <div className="flex items-center gap-2">
                <label className="text-[#737373]">De:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    if (periodPreset !== 'custom') setPeriodPreset('custom');
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 bg-white border border-[#D4D4D4] rounded-md text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[#737373]">Até:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    if (periodPreset !== 'custom') setPeriodPreset('custom');
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 bg-white border border-[#D4D4D4] rounded-md text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
                />
              </div>
            </div>

            <button
              onClick={clearDateFilter}
              className="flex items-center gap-1 text-[#DC2626] hover:text-[#991B1B] font-medium transition-colors self-end sm:self-auto shrink-0"
              title="Remover filtro de data"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar período</span>
            </button>
          </div>
        )}

        {/* Conteúdo Conforme o Modo Selecionado */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" label="Carregando manifestações..." />
          </div>
        ) : (
          <>
            {viewMode === 'lista' && (
              <>
                <DataTable
                  data={tableData}
                  onRowClick={(id) => navigate(`/admin/manifestacoes/${id}`)}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}

            {viewMode === 'cards' && (
              <>
                <ReportCardsView reports={reportsList} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}

            {viewMode === 'kanban' && (
              <ReportKanbanView reports={reportsList} />
            )}
          </>
        )}
      </Surface>
    </div>
  );
}
