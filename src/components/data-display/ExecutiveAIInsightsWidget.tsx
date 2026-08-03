import React, { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { geminiService, ExecutiveInsightsAI } from '../../services/geminiService';
import { Button } from '../ui/Button';

export function ExecutiveAIInsightsWidget() {
  const [insights, setInsights] = useState<ExecutiveInsightsAI | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await geminiService.getExecutiveInsights({
        totalReports: 1480,
        pendingReports: 42,
        criticalCount: 5,
        overdueCount: 3,
        topCategories: [
          { name: 'Relações de Trabalho & Segurança Operacional', count: 48 },
          { name: 'Conformidade Ambiental & Gestão de Resíduos', count: 32 },
          { name: 'Conflito de Interesses & Suprimentos', count: 18 },
        ],
        topUnits: [
          { name: 'Base Operacional Barcarena (Sede)', count: 34 },
          { name: 'Divisão Bairral Transportes & Cargas', count: 22 },
        ],
      });
      setInsights(res);
    } catch (err) {
      setError('Não foi possível carregar o diagnóstico de governança no momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#171717] via-[#262626] to-[#0A0A0A] text-white rounded-lg p-6 shadow-md border border-[#404040] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#404040] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FACC15] text-[#0A0A0A] rounded-lg shadow-sm">
            <Sparkles className="w-6 h-6 text-[#0A0A0A]" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              Diagnóstico Estratégico de Governança (Gemini IA)
            </h3>
            <p className="text-xs text-[#A3A3A3]">
              Análise preditiva de tendências, detecção de gargalos de SLA e plano preventivo institucional
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateInsights}
          disabled={loading}
          className="bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold border-none gap-2 text-xs cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0A0A0A]" />
              Sintetizando Dados...
            </>
          ) : insights ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Atualizar Diagnóstico
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
              Gerar Diagnóstico com IA
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-[#450A0A] border border-[#7F1D1D] text-[#FECACA] text-xs rounded-md">
          {error}
        </div>
      )}

      {!insights && !loading && (
        <div className="text-center py-8 px-4 space-y-3 bg-[#171717]/80 rounded-md border border-[#404040]">
          <TrendingUp className="w-10 h-10 text-[#FACC15] mx-auto opacity-80" />
          <h4 className="text-sm font-bold text-white">
            Inteligência de Dados e Governança do Grupo Bairral
          </h4>
          <p className="text-xs text-[#D4D4D4] max-w-lg mx-auto leading-relaxed">
            Clique no botão acima para acionar a análise por IA do Gemini. A IA cruzará as estatísticas acumuladas, o índice de resolutividade, prazos de SLA e as categorias mais críticas para apresentar recomendações executivas à Diretoria.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-10 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#FACC15] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#E5E5E5]">
            Cruzando dados de 1.480 manifestações, SLAs de unidades e categorias críticas...
          </p>
        </div>
      )}

      {insights && !loading && (
        <div className="space-y-5 text-xs">
          {/* Executive Summary */}
          <div className="bg-[#262626] p-4 rounded-md border border-[#404040] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FACC15] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Visão Geral de Conformidade
            </span>
            <p className="text-xs text-[#E5E5E5] leading-relaxed">
              {insights.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Risks */}
            <div className="bg-[#262626] p-4 rounded-md border border-[#404040] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F87171] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Principais Pontos de Atenção
              </span>
              <ul className="space-y-2 pt-1 text-[#E5E5E5]">
                {insights.topRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#F87171]">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Actions */}
            <div className="bg-[#262626] p-4 rounded-md border border-[#404040] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Recomendações Estratégicas
              </span>
              <ul className="space-y-2 pt-1 text-[#E5E5E5]">
                {insights.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#4ADE80]">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-[#262626] p-4 rounded-md border border-[#404040] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Análise de Tendência e Evolução
            </span>
            <p className="text-xs text-[#E5E5E5] leading-relaxed">
              {insights.trendAnalysis}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
