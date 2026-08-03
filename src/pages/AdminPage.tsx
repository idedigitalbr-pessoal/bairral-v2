import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  X,
  Activity,
  AlertOctagon,
  Calendar,
  Layers,
  Building2,
  Tag,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { categoriesService } from '../services/categoriesService';
import { unitsService } from '../services/unitsService';
import {
  DashboardFilters,
  ReportTypeEnum,
  ReportStatusEnum,
  RiskLevelEnum,
} from '../types';
import { MetricCard } from '../components/data-display/MetricCard';
import { RiskBadge } from '../components/data-display/RiskBadge';
import { StatusBadge } from '../components/data-display/StatusBadge';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { Skeleton } from '../components/feedback/Skeleton';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';

// Mapeamento de Rótulos em Português
const statusLabels: Record<string, string> = {
  [ReportStatusEnum.RECEIVED]: 'Recebido',
  [ReportStatusEnum.TRIAGE]: 'Em Triagem',
  [ReportStatusEnum.PENDING_INFO]: 'Aguardando Inf.',
  [ReportStatusEnum.ANALYSIS]: 'Em Análise',
  [ReportStatusEnum.INVESTIGATION]: 'Investigação',
  [ReportStatusEnum.FORWARDED]: 'Encaminhado',
  [ReportStatusEnum.ACTION_PLAN]: 'Plano de Ação',
  [ReportStatusEnum.RESOLVED]: 'Resolvido',
  [ReportStatusEnum.COMPLETED]: 'Concluído',
  [ReportStatusEnum.ARCHIVED]: 'Arquivado',
  [ReportStatusEnum.REOPENED]: 'Reaberto',
};

const typeLabels: Record<string, string> = {
  [ReportTypeEnum.DENUNCIA]: 'Denúncia',
  [ReportTypeEnum.ELOGIO]: 'Elogio',
  [ReportTypeEnum.SUGESTAO]: 'Sugestão',
  [ReportTypeEnum.RECLAMACAO]: 'Reclamação',
  [ReportTypeEnum.DUVIDA]: 'Dúvida',
};

const riskLabels: Record<string, string> = {
  [RiskLevelEnum.LOW]: 'Baixo',
  [RiskLevelEnum.MEDIUM]: 'Médio',
  [RiskLevelEnum.HIGH]: 'Alto',
  [RiskLevelEnum.CRITICAL]: 'Crítico',
};

const riskColors: Record<string, string> = {
  [RiskLevelEnum.LOW]: '#16A34A',
  [RiskLevelEnum.MEDIUM]: '#0284C7',
  [RiskLevelEnum.HIGH]: '#EA580C',
  [RiskLevelEnum.CRITICAL]: '#DC2626',
};

// Formato de percentual
function formatPercent(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return '0,0%';
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

// Formato de dias
function formatDays(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return '0 dias';
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} dias`;
}

// Formato de data legível
function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function AdminPage() {
  const navigate = useNavigate();

  // Estado dos filtros
  const [filters, setFilters] = useState<DashboardFilters>({
    period: '30d',
    unitId: undefined,
    categoryId: undefined,
    type: undefined,
    status: undefined,
    riskLevel: undefined,
  });

  // Query para métricas do Dashboard
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError: isErrorMetrics,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ['dashboard-metrics', filters],
    queryFn: () => dashboardService.getMetrics(filters),
  });

  // Query para Categorias (dropdown de filtro)
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  });

  // Query para Unidades (dropdown de filtro)
  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: unitsService.getUnits,
  });

  // Handlers de alteração de filtro
  const handleFilterChange = (key: keyof DashboardFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' || value === 'ALL' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      period: '30d',
      unitId: undefined,
      categoryId: undefined,
      type: undefined,
      status: undefined,
      riskLevel: undefined,
    });
  };

  const hasActiveFilters =
    Boolean(filters.unitId) ||
    Boolean(filters.categoryId) ||
    Boolean(filters.type) ||
    Boolean(filters.status) ||
    Boolean(filters.riskLevel) ||
    filters.period !== '30d';

  // Preparação de dados para Gráficos
  const statusChartData = metrics
    ? Object.entries(metrics.reportsByStatus || {}).map(([statusKey, count]) => ({
        statusKey,
        status: statusLabels[statusKey] || statusKey,
        count,
      }))
    : [];

  const riskChartData = metrics
    ? Object.entries(metrics.reportsByRisk || {}).map(([riskKey, count]) => ({
        riskKey,
        risk: riskLabels[riskKey] || riskKey,
        count,
        color: riskColors[riskKey] || '#6B7280',
      }))
    : [];

  const registrationTypeData = metrics
    ? [
        { name: 'Anônimas', value: metrics.registrationTypeDistribution?.anonymous || 0, color: '#F59E0B' },
        { name: 'Identificadas', value: metrics.registrationTypeDistribution?.identified || 0, color: '#0284C7' },
      ]
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header do Painel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h2">Dashboard Administrativo</Typography>
            <Badge variant="yellow" size="sm">
              Grupo Bairral
            </Badge>
          </div>
          <p className="text-xs text-[#737373] mt-0.5">
            Monitoramento em tempo real de métricas operacionais, conformidade, SLA e governança ética.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchMetrics()}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Atualizar Dados
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS APLICÁVEIS AO DASHBOARD */}
      <Surface variant="card" className="p-4 space-y-3 bg-[#FAFAFA] border border-[#E5E5E5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0A0A0A] font-semibold text-sm">
            <Filter className="w-4 h-4 text-[#D97706]" />
            <span>Filtros do Painel</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#D97706] hover:underline font-medium flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Filtro Período */}
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#525252]" /> Período
            </label>
            <select
              value={filters.period || '30d'}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              className="w-full text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="12m">Últimos 12 meses</option>
              <option value="all">Todo o histórico</option>
            </select>
          </div>

          {/* Filtro Unidade */}
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#525252]" /> Unidade
            </label>
            <select
              value={filters.unitId || ''}
              onChange={(e) => handleFilterChange('unitId', e.target.value)}
              className="w-full text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="">Todas as Unidades</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Categoria */}
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#525252]" /> Categoria
            </label>
            <select
              value={filters.categoryId || ''}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="w-full text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Tipo */}
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#525252]" /> Tipo
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="">Todos os Tipos</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Status */}
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#525252]" /> Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="">Todos os Status</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Risco */}
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1 flex items-center gap-1">
              <AlertOctagon className="w-3 h-3 text-[#525252]" /> Nível de Risco
            </label>
            <select
              value={filters.riskLevel || ''}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              className="w-full text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="">Todos os Riscos</option>
              {Object.entries(riskLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Surface>

      {/* TRATAMENTO DE ERRO GLOBAL */}
      {isErrorMetrics && (
        <ErrorState
          title="Erro ao carregar os dados do Dashboard"
          message={metricsError instanceof Error ? metricsError.message : 'Não foi possível conectar ao servidor MSW.'}
          onRetry={() => refetchMetrics()}
        />
      )}

      {/* CARREGAMENTO SKELETON */}
      {isLoadingMetrics && !isErrorMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-72 rounded-md" />
            <Skeleton className="h-72 rounded-md" />
          </div>
        </div>
      )}

      {/* SEÇÃO PRINCIPAL DE MÉTRICAS E GRÁFICOS */}
      {!isLoadingMetrics && !isErrorMetrics && metrics && (
        <>
          {/* 1. GRID DE 10 MÉTRICAS OPERACIONAIS E GOVERNANÇA */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Typography variant="h3" className="text-sm font-bold uppercase tracking-wide text-[#525252]">
                Indicadores-Chave de Desempenho (KPIs)
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Linha 1 */}
              <MetricCard
                title="Total Manifestações"
                value={metrics.totalReports}
                icon={FileText}
                highlightColor="yellow"
                subtitle="acumulado no filtro"
                onClick={() => navigate('/admin/manifestacoes')}
              />
              <MetricCard
                title="Casos Abertos"
                value={metrics.openReports}
                icon={Activity}
                highlightColor="neutral"
                subtitle="em fluxo de apuração"
                onClick={() => navigate('/admin/manifestacoes?filtro=abertos')}
              />
              <MetricCard
                title="Casos Críticos"
                value={metrics.criticalReports}
                icon={AlertTriangle}
                highlightColor="danger"
                subtitle="prioridade máxima"
                onClick={() => navigate('/admin/manifestacoes?filtro=criticos')}
              />
              <MetricCard
                title="Recentes (Novas)"
                value={metrics.newInPeriod}
                icon={Clock}
                highlightColor="info"
                subtitle="registradas recentemente"
                onClick={() => navigate('/admin/manifestacoes?filtro=recentes')}
              />
              <MetricCard
                title="Casos Concluídos"
                value={metrics.completedReports}
                icon={CheckCircle2}
                highlightColor="success"
                subtitle="finalizados com desfecho"
                onClick={() => navigate('/admin/manifestacoes?filtro=concluidos')}
              />

              {/* Linha 2 */}
              <MetricCard
                title="Conformidade SLA"
                value={formatPercent(metrics.slaAdherencePercentage)}
                icon={TrendingUp}
                highlightColor="yellow"
                trend={{ value: `${metrics.slaAdherencePercentage >= 90 ? 'Excelente' : 'Atencioso'}`, isPositive: metrics.slaAdherencePercentage >= 90 }}
                subtitle="casos dentro do prazo"
                onClick={() => navigate('/admin/relatorios')}
              />
              <MetricCard
                title="Casos Atrasados"
                value={metrics.delayedReports}
                icon={Clock}
                highlightColor="danger"
                subtitle="fora do prazo de SLA"
                onClick={() => navigate('/admin/manifestacoes?filtro=atraso')}
              />
              <MetricCard
                title="Média Conclusão"
                value={formatDays(metrics.avgResolutionDays)}
                icon={Clock}
                highlightColor="neutral"
                subtitle="tempo total apuração"
                onClick={() => navigate('/admin/relatorios')}
              />
              <MetricCard
                title="Resolutividade"
                value={formatPercent(metrics.resolutionRate)}
                icon={CheckCircle2}
                highlightColor="success"
                subtitle="taxa de resoluções"
                onClick={() => navigate('/admin/relatorios')}
              />
              <MetricCard
                title="Média Triagem"
                value={formatDays(metrics.avgTriageDays)}
                icon={Clock}
                highlightColor="neutral"
                subtitle="tempo até 1ª análise"
                onClick={() => navigate('/admin/relatorios')}
              />
            </div>
          </div>

          {/* 2. SEÇÃO DE GRÁFICOS RECHARTS (8 GRÁFICOS) */}
          <div className="space-y-6">
            <Typography variant="h3" className="text-sm font-bold uppercase tracking-wide text-[#525252]">
              Análise Gráfica & Tendências
            </Typography>

            {/* LINHA 1 DE GRÁFICOS: VOLUME POR PERÍODO & CASOS POR CATEGORIA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 1: Volume por Período */}
              <Surface variant="card" className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      Volume de Manifestações por Período
                      <span className="text-[10px] font-normal bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FCD34D]">
                        🖱️ Clicável
                      </span>
                    </Typography>
                    <p className="text-xs text-[#737373]">Evolução diária em aberto, recentes e concluídas</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => navigate('/admin/manifestacoes?filtro=abertos')}
                      className="text-[11px] px-2 py-1 rounded bg-[#E0F2FE] text-[#0369A1] hover:bg-[#BAE6FD] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Filtrar Em Aberto"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Aberto
                    </button>
                    <button
                      onClick={() => navigate('/admin/manifestacoes?filtro=recentes')}
                      className="text-[11px] px-2 py-1 rounded bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Filtrar Recentes"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Recentes
                    </button>
                    <button
                      onClick={() => navigate('/admin/manifestacoes?filtro=concluidos')}
                      className="text-[11px] px-2 py-1 rounded bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Filtrar Concluídas"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Concluídas
                    </button>
                  </div>
                </div>
                {metrics.periodVolume && metrics.periodVolume.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={metrics.periodVolume}
                        onClick={(state: any) => {
                          if (state?.activePayload?.[0]) {
                            navigate('/admin/manifestacoes?filtro=abertos');
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis dataKey="label" stroke="#737373" fontSize={11} />
                        <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any, name: any) => [`${value} manifestações (Clique para filtrar)`, name]}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '12px', paddingTop: '8px', cursor: 'pointer' }}
                          onClick={(e: any) => {
                            if (e && e.dataKey === 'abertos') navigate('/admin/manifestacoes?filtro=abertos');
                            if (e && e.dataKey === 'recentes') navigate('/admin/manifestacoes?filtro=recentes');
                            if (e && e.dataKey === 'concluidas') navigate('/admin/manifestacoes?filtro=concluidos');
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="abertos"
                          name="Em Aberto"
                          stroke="#0284C7"
                          fill="#E0F2FE"
                          strokeWidth={2.5}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <Area
                          type="monotone"
                          dataKey="recentes"
                          name="Recentes"
                          stroke="#D97706"
                          fill="#FEF3C7"
                          strokeWidth={2.5}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <Area
                          type="monotone"
                          dataKey="concluidas"
                          name="Concluídas"
                          stroke="#16A34A"
                          fill="#DCFCE7"
                          strokeWidth={2.5}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem dados de volume" description="Nenhuma manifestação registrada no período selecionado." />
                )}
              </Surface>

              {/* Gráfico 2: Casos por Categoria */}
              <Surface variant="card" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      Distribuição por Categoria
                      <span className="text-[10px] font-normal bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FCD34D]">
                        🖱️ Clique na barra
                      </span>
                    </Typography>
                    <p className="text-xs text-[#737373]">Clique em qualquer categoria para listar os chamados</p>
                  </div>
                  <PieChartIcon className="w-5 h-5 text-[#D97706]" />
                </div>
                {metrics.reportsByCategory && metrics.reportsByCategory.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={metrics.reportsByCategory}
                        onClick={(state: any) => {
                          if (state?.activePayload?.[0]?.payload) {
                            const item = state.activePayload[0].payload;
                            if (item?.categoryId) {
                              navigate(`/admin/manifestacoes?categoryId=${item.categoryId}`);
                            } else if (item?.categoryName) {
                              navigate(`/admin/manifestacoes?categoryName=${encodeURIComponent(item.categoryName)}`);
                            }
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis type="number" stroke="#737373" fontSize={11} allowDecimals={false} />
                        <YAxis dataKey="categoryName" type="category" stroke="#737373" fontSize={10} width={130} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value} casos (Clique para filtrar)`, 'Quantidade']}
                        />
                        <Bar
                          dataKey="count"
                          name="Quantidade"
                          fill="#D97706"
                          radius={[0, 4, 4, 0]}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem categorias" description="Nenhum dado de categoria disponível." />
                )}
              </Surface>
            </div>

            {/* LINHA 2 DE GRÁFICOS: CASOS POR STATUS & CASOS POR RISCO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 3: Casos por Status */}
              <Surface variant="card" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      Manifestações por Status no Fluxo
                      <span className="text-[10px] font-normal bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                        🖱️ Clicável
                      </span>
                    </Typography>
                    <p className="text-xs text-[#737373]">Clique na etapa para abrir a lista filtrada correspondente</p>
                  </div>
                </div>
                {statusChartData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statusChartData}
                        onClick={(state: any) => {
                          if (state?.activePayload?.[0]?.payload) {
                            const item = state.activePayload[0].payload;
                            if (item?.statusKey) {
                              navigate(`/admin/manifestacoes?status=${item.statusKey}`);
                            }
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis dataKey="status" stroke="#737373" fontSize={10} angle={-25} textAnchor="end" height={50} />
                        <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value} manifestações (Clique para ver)`, 'Quantidade']}
                        />
                        <Bar dataKey="count" name="Manifestações" fill="#0284C7" radius={[4, 4, 0, 0]} className="cursor-pointer hover:opacity-80 transition-opacity" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem status disponíveis" />
                )}
              </Surface>

              {/* Gráfico 4: Casos por Nível de Risco */}
              <Surface variant="card" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      Classificação por Nível de Risco
                      <span className="text-[10px] font-normal bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded-full border border-[#FCA5A5]">
                        🖱️ Clicável
                      </span>
                    </Typography>
                    <p className="text-xs text-[#737373]">Clique na barra de risco para abrir os casos daquele nível</p>
                  </div>
                </div>
                {riskChartData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={riskChartData}
                        onClick={(state: any) => {
                          if (state?.activePayload?.[0]?.payload) {
                            const item = state.activePayload[0].payload;
                            if (item?.riskKey) {
                              navigate(`/admin/manifestacoes?riskLevel=${item.riskKey}`);
                            }
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis dataKey="risk" stroke="#737373" fontSize={11} />
                        <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value} casos (Clique para filtrar)`, 'Quantidade']}
                        />
                        <Bar dataKey="count" name="Quantidade" className="cursor-pointer hover:opacity-80 transition-opacity">
                          {riskChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem dados de risco" />
                )}
              </Surface>
            </div>

            {/* LINHA 3 DE GRÁFICOS: CASOS POR UNIDADE & ANÔNIMAS VS IDENTIFICADAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 5: Casos por Unidade do Grupo Bairral */}
              <Surface variant="card" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      Manifestações por Unidade Operacional
                      <span className="text-[10px] font-normal bg-[#EDE9FE] text-[#6D28D9] px-2 py-0.5 rounded-full border border-[#DDD6FE]">
                        🖱️ Clicável
                      </span>
                    </Typography>
                    <p className="text-xs text-[#737373]">Clique na unidade para filtrar os relatos daquela localidade</p>
                  </div>
                </div>
                {metrics.reportsByUnit && metrics.reportsByUnit.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={metrics.reportsByUnit}
                        onClick={(state: any) => {
                          if (state?.activePayload?.[0]?.payload) {
                            const item = state.activePayload[0].payload;
                            if (item?.unitId) {
                              navigate(`/admin/manifestacoes?unitId=${item.unitId}`);
                            }
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis dataKey="unitName" stroke="#737373" fontSize={10} interval={0} />
                        <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value} manifestações (Clique para filtrar)`, 'Quantidade']}
                        />
                        <Bar dataKey="count" name="Manifestações" fill="#7C3AED" radius={[4, 4, 0, 0]} className="cursor-pointer hover:opacity-80 transition-opacity" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem dados por unidade" />
                )}
              </Surface>

              {/* Gráfico 6: Anônimas vs Identificadas */}
              <Surface variant="card" className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      Anônimas vs Identificadas
                      <span className="text-[10px] font-normal bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FCD34D]">
                        🖱️ Clicável
                      </span>
                    </Typography>
                  </div>
                  <p className="text-xs text-[#737373] mb-4">Clique na fatia desejada para abrir a lista filtrada</p>
                </div>
                {registrationTypeData.length > 0 ? (
                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={registrationTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          onClick={(entry) => {
                            if (entry && entry.name) {
                              const isAnon = entry.name === 'Anônimas';
                              navigate(`/admin/manifestacoes?registrationType=${isAnon ? 'ANONYMOUS' : 'IDENTIFIED'}`);
                            }
                          }}
                          className="cursor-pointer"
                        >
                          {registrationTypeData.map((entry, index) => (
                            <Cell key={`cell-pie-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value} registros (Clique para filtrar)`, 'Total']}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '12px', cursor: 'pointer' }}
                          onClick={(e: any) => {
                            if (e && e.value) {
                              const isAnon = e.value === 'Anônimas';
                              navigate(`/admin/manifestacoes?registrationType=${isAnon ? 'ANONYMOUS' : 'IDENTIFIED'}`);
                            }
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem dados de identificação" />
                )}
              </Surface>
            </div>

            {/* LINHA 4 DE GRÁFICOS: EVOLUÇÃO SLA & EVOLUÇÃO DA RESOLUTIVIDADE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 7: Percentual Dentro do SLA */}
              <Surface variant="card" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A]">
                      Evolução do Cumprimento do SLA (%)
                    </Typography>
                    <p className="text-xs text-[#737373]">Histórico mensal da taxa de atendimento dentro do prazo estipulado</p>
                  </div>
                </div>
                {metrics.slaTrend && metrics.slaTrend.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.slaTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis dataKey="month" stroke="#737373" fontSize={11} />
                        <YAxis stroke="#737373" fontSize={11} domain={[0, 100]} unit="%" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value}%`, 'Conformidade SLA']}
                        />
                        <Line type="monotone" dataKey="slaPercentage" name="Conformidade SLA (%)" stroke="#D97706" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem histórico SLA" />
                )}
              </Surface>

              {/* Gráfico 8: Evolução da Resolutividade */}
              <Surface variant="card" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="h3" className="text-base font-bold text-[#0A0A0A]">
                      Evolução da Taxa de Resolutividade (%)
                    </Typography>
                    <p className="text-xs text-[#737373]">Porcentagem de demandas totalmente solucionadas pelo comitê</p>
                  </div>
                </div>
                {metrics.resolutivityTrend && metrics.resolutivityTrend.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics.resolutivityTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                        <XAxis dataKey="month" stroke="#737373" fontSize={11} />
                        <YAxis stroke="#737373" fontSize={11} domain={[0, 100]} unit="%" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#171717', borderRadius: '6px', color: '#FFF', fontSize: '12px' }}
                          formatter={(value: any) => [`${value}%`, 'Resolutividade']}
                        />
                        <Area type="monotone" dataKey="rate" name="Resolutividade (%)" stroke="#16A34A" fill="#DCFCE7" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="Sem histórico de resolutividade" />
                )}
              </Surface>
            </div>
          </div>

          {/* 3. LISTAS RESUMIDAS (4 LISTAS SOLICITADAS NA FASE 11) */}
          <div className="space-y-4 pt-4">
            <Typography variant="h3" className="text-sm font-bold uppercase tracking-wide text-[#525252]">
              Painéis de Monitoramento e Ação Imediata
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LISTA 1: CASOS CRÍTICOS RECENTES */}
              <Surface variant="card" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#FEE2E2] text-[#DC2626] rounded-md">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <Typography variant="h3" className="text-sm font-bold text-[#0A0A0A]">
                      Casos Críticos Recentes
                    </Typography>
                  </div>
                  <Badge variant="danger" size="sm">
                    {metrics.recentCriticalReports?.length || 0} pendentes
                  </Badge>
                </div>

                {metrics.recentCriticalReports && metrics.recentCriticalReports.length > 0 ? (
                  <div className="divide-y divide-[#F5F5F5]">
                    {metrics.recentCriticalReports.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0A0A0A]">{item.protocol}</span>
                            <span className="text-[11px] text-[#737373]">{item.unitName}</span>
                          </div>
                          <p className="text-xs font-medium text-[#262626] line-clamp-1">{item.title}</p>
                          <span className="text-[10px] text-[#A3A3A3]">{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <RiskBadge level={item.riskLevel} size="sm" />
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Nenhum caso crítico" description="Não há manifestações críticas registradas no momento." />
                )}
              </Surface>

              {/* LISTA 2: CASOS PRÓXIMOS DO PRAZO */}
              <Surface variant="card" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#FEF3C7] text-[#D97706] rounded-md">
                      <Clock className="w-4 h-4" />
                    </div>
                    <Typography variant="h3" className="text-sm font-bold text-[#0A0A0A]">
                      Casos Próximos do Prazo (SLA)
                    </Typography>
                  </div>
                  <Badge variant="yellow" size="sm">
                    Atenção SLA
                  </Badge>
                </div>

                {metrics.nearDeadlineReports && metrics.nearDeadlineReports.length > 0 ? (
                  <div className="divide-y divide-[#F5F5F5]">
                    {metrics.nearDeadlineReports.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0A0A0A]">{item.protocol}</span>
                            <span className="text-[11px] text-[#737373]">{item.categoryName}</span>
                          </div>
                          <p className="text-xs font-medium text-[#262626] line-clamp-1">{item.title}</p>
                          <span className="text-[10px] text-[#737373]">
                            Vence em: <strong className="text-[#0A0A0A]">{formatDate(item.slaDueDate)}</strong>
                          </span>
                        </div>
                        <div className="shrink-0 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.daysRemaining <= 1
                                ? 'bg-red-100 text-red-700'
                                : item.daysRemaining <= 3
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {item.daysRemaining <= 0
                              ? 'Vencendo hoje!'
                              : `${item.daysRemaining} dia(s) restante(s)`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Tudo em dia!" description="Não há casos próximos do limite de vencimento." />
                )}
              </Surface>

              {/* LISTA 3: ÚLTIMAS ATIVIDADES */}
              <Surface variant="card" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#E0F2FE] text-[#0284C7] rounded-md">
                      <Activity className="w-4 h-4" />
                    </div>
                    <Typography variant="h3" className="text-sm font-bold text-[#0A0A0A]">
                      Últimas Atividades no Sistema
                    </Typography>
                  </div>
                </div>

                {metrics.recentActivities && metrics.recentActivities.length > 0 ? (
                  <div className="divide-y divide-[#F5F5F5]">
                    {metrics.recentActivities.map((log) => (
                      <div key={log.id} className="py-2.5 flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0A0A0A]">{log.userName}</span>
                            <span className="text-[10px] text-[#737373]">({log.userRole})</span>
                          </div>
                          <p className="text-xs text-[#525252]">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-[#A3A3A3] shrink-0">{formatDate(log.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Sem registro de atividades" />
                )}
              </Surface>

              {/* LISTA 4: PLANOS DE AÇÃO ATRASADOS */}
              <Surface variant="card" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#FEE2E2] text-[#B91C1C] rounded-md">
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <Typography variant="h3" className="text-sm font-bold text-[#0A0A0A]">
                      Planos de Ação Atrasados
                    </Typography>
                  </div>
                  <Badge variant="danger" size="sm">
                    Pendências de Gestão
                  </Badge>
                </div>

                {metrics.delayedActionPlans && metrics.delayedActionPlans.length > 0 ? (
                  <div className="divide-y divide-[#F5F5F5]">
                    {metrics.delayedActionPlans.map((plan) => (
                      <div key={plan.id} className="py-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#0A0A0A]">
                            {plan.reportProtocol}
                          </span>
                          <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                            {plan.daysOverdue} dia(s) em atraso
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#262626]">{plan.title}</p>
                        <div className="flex items-center justify-between text-[11px] text-[#737373]">
                          <span>Responsável: <strong className="text-[#0A0A0A]">{plan.responsibleName}</strong></span>
                          <span>Progresso: <strong>{plan.progressPercentage}%</strong></span>
                        </div>
                        <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#D97706] h-full rounded-full transition-all"
                            style={{ width: `${plan.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Nenhum plano atrasado" description="Todos os planos de ação estão sendo executados dentro do prazo!" />
                )}
              </Surface>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
