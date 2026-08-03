import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Filter,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { MetricCard } from '../components/data-display/MetricCard';
import { Grid } from '../components/ui/Grid';
import { ExportButton } from '../components/ui/ExportButton';
import { ExecutiveAIInsightsWidget } from '../components/data-display/ExecutiveAIInsightsWidget';
import { Badge } from '../components/data-display/Badge';

// Dados para Gráficos
const monthlyTrendData = [
  { month: 'Jan', recebidas: 165, resolvidas: 158, slaMedio: 4.5 },
  { month: 'Fev', recebidas: 180, resolvidas: 172, slaMedio: 4.3 },
  { month: 'Mar', recebidas: 210, resolvidas: 205, slaMedio: 4.1 },
  { month: 'Abr', recebidas: 195, resolvidas: 190, slaMedio: 4.4 },
  { month: 'Mai', recebidas: 230, resolvidas: 224, slaMedio: 4.0 },
  { month: 'Jun', recebidas: 245, resolvidas: 240, slaMedio: 4.2 },
  { month: 'Jul', recebidas: 255, resolvidas: 251, slaMedio: 3.9 },
];

const categoryDistributionData = [
  { name: 'Relações de Trabalho & Conduta', value: 562, color: '#004B87' },
  { name: 'Segurança Operacional & EPIs', value: 370, color: '#806300' },
  { name: 'Conformidade Ambiental & Resíduos', value: 266, color: '#059669' },
  { name: 'Conflito de Interesses & Compras', value: 178, color: '#7C3AED' },
  { name: 'Outras Ocorrências', value: 104, color: '#6B7280' },
];

const riskLevelData = [
  { level: 'Baixo', quantidade: 1080, fill: '#10B981' },
  { level: 'Médio', quantidade: 320, fill: '#F59E0B' },
  { level: 'Alto', quantidade: 75, fill: '#F97316' },
  { level: 'Crítico', quantidade: 5, fill: '#EF4444' },
];

const unitPerformanceData = [
  { unit: 'Barcarena (Sede)', slaReal: 3.8, slaMeta: 7.0, resolutividade: 99.2 },
  { unit: 'Belém (Filial)', slaReal: 4.5, slaMeta: 7.0, resolutividade: 98.5 },
  { unit: 'Bairral Transp.', slaReal: 4.1, slaMeta: 7.0, resolutividade: 97.8 },
  { unit: 'Mojú', slaReal: 5.2, slaMeta: 7.0, resolutividade: 96.4 },
  { unit: 'Abaetetuba', slaReal: 4.8, slaMeta: 7.0, resolutividade: 98.0 },
];

const categoryPerformanceTable = [
  { category: 'Relações de Trabalho & Conduta', total: 562, slaMedio: '3.8 dias', resolutividade: '98.5%', riscoPredominante: 'Médio', status: 'Excelente' },
  { category: 'Segurança Operacional & EPIs', total: 370, slaMedio: '4.1 dias', resolutividade: '99.0%', riscoPredominante: 'Alto', status: 'Excelente' },
  { category: 'Conformidade Ambiental & Resíduos', total: 266, slaMedio: '4.5 dias', resolutividade: '97.2%', riscoPredominante: 'Médio', status: 'Satisfatório' },
  { category: 'Conflito de Interesses & Compras', total: 178, slaMedio: '5.0 dias', resolutividade: '96.8%', riscoPredominante: 'Alto', status: 'Atenção' },
  { category: 'Outras Ocorrências', total: 104, slaMedio: '3.2 dias', resolutividade: '99.5%', riscoPredominante: 'Baixo', status: 'Excelente' },
];

export function ReportsAnalyticsPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');

  const analyticsHeaders = ['Métrica de Governança', 'Valor / Indicador', 'Meta / SLA', 'Situação'];
  const analyticsRows = [
    ['Manifestações no Ano', '1.480 relatos', 'Meta Anual', 'Acumulado 2026'],
    ['Tempo Médio de Resolução', '4.2 dias', 'SLA Meta: 7.0 dias', 'Dentro da Meta'],
    ['Índice de Resolutividade', '98.1%', 'Meta: 95.0%', 'Excelente'],
    ['Casos Críticos Resolvidos', '92.4%', 'Meta: 90.0%', 'Satisfatório'],
    ['Planos de Ação Concluídos', '88.5%', 'Meta: 85.0%', 'Em Dia'],
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <Typography variant="h2" className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#806300]" />
            Relatórios & Estatísticas (BI)
          </Typography>
          <p className="text-xs text-[#737373]">
            Painel consolidado de inteligência de dados, análise de SLA e indicadores corporativos de integridade
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <ExportButton
            title="Relatório Consolidado de Estatísticas e Governança"
            subtitle="Indicadores de resolutividade, SLA e desempenho operacional"
            filename="relatorio_estatisticas_governanca"
            headers={analyticsHeaders}
            rows={analyticsRows}
          />
        </div>
      </div>

      {/* Barra de Filtros Executivos */}
      <Surface variant="card" className="p-3.5 flex flex-wrap items-center justify-between gap-3 bg-[#FAFAFA] border border-[#E5E5E5]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-[#171717] flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#806300]" />
            Filtros do Painel:
          </span>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#737373]">Período:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1 font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="2026">Ano Atual (2026)</option>
              <option value="12m">Últimos 12 Meses</option>
              <option value="90d">Últimos 90 Dias</option>
              <option value="2s2025">2º Semestre de 2025</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#737373]">Unidade:</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="text-xs bg-white border border-[#D4D4D4] rounded-md px-2.5 py-1 font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FDC503]"
            >
              <option value="ALL">Todas as Unidades Operacionais</option>
              <option value="barcarena">Base Operacional Barcarena (Sede)</option>
              <option value="belem">Filial Belém</option>
              <option value="transportes">Bairral Transportes & Cargas</option>
              <option value="moju">Unidade Mojú</option>
              <option value="abaetetuba">Unidade Abaetetuba</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#737373] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#806300]" />
          <span>Última atualização: Hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </Surface>

      {/* Widget do Gemini AI (Análise Preditiva) */}
      <ExecutiveAIInsightsWidget />

      {/* Cards Principais de Indicadores (KPIs) */}
      <Grid cols={4} gap="4">
        <Surface variant="card" className="p-4 space-y-2 border border-[#E5E5E5] hover:border-[#FDC503] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737373]">Manifestações no Ano</span>
            <div className="p-2 bg-[#FEF08A] text-[#806300] rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-[#0A0A0A]">1.480</span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-[#737373]">Acumulado 2026 • Meta Anual Cumprida</p>
        </Surface>

        <Surface variant="card" className="p-4 space-y-2 border border-[#E5E5E5] hover:border-[#10B981] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737373]">Tempo Médio de Resolução</span>
            <div className="p-2 bg-[#D1FAE5] text-[#047857] rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-[#0A0A0A]">4.2 dias</span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> -0.8d vs 2025
            </span>
          </div>
          <p className="text-[11px] text-[#737373]">SLA Meta: 7.0 dias (Dentro do Limite)</p>
        </Surface>

        <Surface variant="card" className="p-4 space-y-2 border border-[#E5E5E5] hover:border-[#0284C7] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737373]">Taxa de Resolutividade</span>
            <div className="p-2 bg-[#E0F2FE] text-[#0369A1] rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-[#0A0A0A]">98.1%</span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +3.1% vs Meta
            </span>
          </div>
          <p className="text-[11px] text-[#737373]">1.452 casos encerrados com parecer</p>
        </Surface>

        <Surface variant="card" className="p-4 space-y-2 border border-[#E5E5E5] hover:border-[#8B5CF6] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737373]">Planos de Ação Concluídos</span>
            <div className="p-2 bg-[#EDE9FE] text-[#6D28D9] rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-[#0A0A0A]">88.5%</span>
            <span className="text-[11px] font-bold text-[#6D28D9]">48 de 54 planos</span>
          </div>
          <p className="text-[11px] text-[#737373]">6 planos em execução preventiva</p>
        </Surface>
      </Grid>

      {/* Painel Gráfico 1: Evolução Mensal + Distribuição por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Volume x Resolvidas ao longo dos meses */}
        <Surface variant="card" className="lg:col-span-2 p-5 space-y-4 border border-[#E5E5E5]">
          <div className="flex items-center justify-between border-b border-[#F5F5F5] pb-3">
            <div>
              <h3 className="text-sm font-bold font-heading text-[#0A0A0A] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#806300]" />
                Evolução Mensal de Relatos e Resolutividade
              </h3>
              <p className="text-[11px] text-[#737373]">Volume de manifestações recebidas comparado ao volume encerrado</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#004B87] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#004B87]" /> Recebidas
              </span>
              <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" /> Resolvidas
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecebidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004B87" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#004B87" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolvidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [
                    `${value} manifestações`,
                    name === 'recebidas' ? 'Recebidas' : 'Resolvidas',
                  ]}
                />
                <Area type="monotone" dataKey="recebidas" stroke="#004B87" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecebidas)" />
                <Area type="monotone" dataKey="resolvidas" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolvidas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Gráfico 2: Distribuição por Categoria */}
        <Surface variant="card" className="p-5 space-y-4 border border-[#E5E5E5]">
          <div className="border-b border-[#F5F5F5] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-heading text-[#0A0A0A] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#806300]" />
                Categorias de Manifestações
                <span className="text-[10px] font-normal bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FCD34D]">
                  🖱️ Clicável
                </span>
              </h3>
              <p className="text-[11px] text-[#737373]">Clique na fatia ou na lista para filtrar por categoria</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(entry) => {
                    if (entry && entry.name) {
                      navigate(`/admin/manifestacoes?categoryName=${encodeURIComponent(entry.name)}`);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} casos (Clique para ver)`, 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#F5F5F5]">
            {categoryDistributionData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/admin/manifestacoes?categoryName=${encodeURIComponent(item.name)}`)}
                className="flex items-center justify-between text-[11px] cursor-pointer hover:bg-[#F5F5F5] p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2 truncate max-w-[200px]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#262626] font-medium truncate">{item.name}</span>
                </div>
                <span className="font-bold text-[#0A0A0A] shrink-0">{item.value} ({Math.round((item.value / 1474) * 100)}%)</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      {/* Painel Gráfico 2: Matriz de Risco + SLA por Unidade Operacional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 3: Matriz de Nível de Risco */}
        <Surface variant="card" className="p-5 space-y-4 border border-[#E5E5E5]">
          <div className="border-b border-[#F5F5F5] pb-3">
            <h3 className="text-sm font-bold font-heading text-[#0A0A0A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              Classificação por Nível de Risco
              <span className="text-[10px] font-normal bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded-full border border-[#FCA5A5]">
                🖱️ Clicável
              </span>
            </h3>
            <p className="text-[11px] text-[#737373]">Clique no risco para filtrar os relatos correspondentes</p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskLevelData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(state: any) => {
                  if (state?.activePayload?.[0]?.payload) {
                    const item = state.activePayload[0].payload;
                    if (item?.level) {
                      const levelMap: Record<string, string> = { Baixo: 'LOW', Médio: 'MEDIUM', Alto: 'HIGH', Crítico: 'CRITICAL' };
                      navigate(`/admin/manifestacoes?riskLevel=${levelMap[item.level] || item.level}`);
                    }
                  }
                }}
                className="cursor-pointer"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="level" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} relatos (Clique para filtrar)`, 'Quantidade']}
                />
                <Bar dataKey="quantidade" radius={[6, 6, 0, 0]} className="cursor-pointer hover:opacity-80 transition-opacity">
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`risk-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Gráfico 4: SLA Médio por Unidade */}
        <Surface variant="card" className="p-5 space-y-4 border border-[#E5E5E5]">
          <div className="border-b border-[#F5F5F5] pb-3">
            <h3 className="text-sm font-bold font-heading text-[#0A0A0A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#004B87]" />
              Desempenho de SLA por Unidade Operacional
              <span className="text-[10px] font-normal bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                🖱️ Clicável
              </span>
            </h3>
            <p className="text-[11px] text-[#737373]">Clique na unidade para ver todas as manifestações associadas</p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={unitPerformanceData}
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
                onClick={(state: any) => {
                  if (state?.activePayload?.[0]?.payload) {
                    const item = state.activePayload[0].payload;
                    if (item?.unit) {
                      navigate(`/admin/manifestacoes?unidade=${encodeURIComponent(item.unit)}`);
                    }
                  }
                }}
                className="cursor-pointer"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#737373' }} domain={[0, 8]} />
                <YAxis dataKey="unit" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#171717' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} dias (Clique para filtrar)`, 'SLA Média']}
                />
                <Bar dataKey="slaReal" fill="#806300" radius={[0, 4, 4, 0]} name="SLA Real" className="cursor-pointer hover:opacity-80 transition-opacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* Tabela de Governança Detalhada */}
      <Surface variant="card" className="p-0 overflow-hidden border border-[#E5E5E5]">
        <div className="p-4 bg-[#FAFAFA] border-b border-[#E5E5E5] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-heading text-[#0A0A0A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#806300]" />
              Detalhamento de Indicadores por Categoria
              <span className="text-[10px] font-normal bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FCD34D]">
                🖱️ Linhas clicáveis
              </span>
            </h3>
            <p className="text-[11px] text-[#737373]">Clique em qualquer linha da tabela para visualizar o acervo correspondente</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#737373] font-semibold">
                <th className="py-3 px-4">Categoria do Relato</th>
                <th className="py-3 px-4">Total de Casos</th>
                <th className="py-3 px-4">SLA Médio</th>
                <th className="py-3 px-4">Resolutividade</th>
                <th className="py-3 px-4">Risco Predominante</th>
                <th className="py-3 px-4 text-right">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {categoryPerformanceTable.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => navigate(`/admin/manifestacoes?categoryName=${encodeURIComponent(item.category)}`)}
                  className="hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-semibold text-[#0A0A0A]">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#171717]">
                    {item.total}
                  </td>
                  <td className="py-3 px-4 text-[#525252]">
                    {item.slaMedio}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#059669]">
                    {item.resolutividade}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.riscoPredominante === 'Alto'
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : item.riscoPredominante === 'Médio'
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#D1FAE5] text-[#065F46]'
                      }`}
                    >
                      {item.riscoPredominante}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={item.status === 'Excelente' ? 'success' : item.status === 'Satisfatório' ? 'info' : 'warning'} size="sm">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}

