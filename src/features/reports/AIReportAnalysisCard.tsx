import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShieldAlert, CheckCircle2, Lock, Lightbulb, FileSearch } from 'lucide-react';
import { Report } from '../../types';
import { geminiService, ReportAnalysisAI } from '../../services/geminiService';
import { RiskBadge } from '../../components/data-display/RiskBadge';
import { Button } from '../../components/ui/Button';

interface AIReportAnalysisCardProps {
  report: Report;
}

export function AIReportAnalysisCard({ report }: AIReportAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<ReportAnalysisAI | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await geminiService.analyzeReport({
        title: report.title,
        description: report.description,
        category: report.categoryName,
        unit: report.unitName,
        type: report.type,
      });
      setAnalysis(res);
    } catch (err: any) {
      setError('Não foi possível gerar a análise por IA neste momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFDF0] via-white to-[#FAF5FF] border border-[#FDE047] rounded-lg p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FEF08A] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FACC15] text-[#0A0A0A] rounded-lg shadow-xs">
            <Sparkles className="w-5 h-5 text-[#0A0A0A]" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
              Assistente de Governança & Triagem IA (Gemini)
            </h3>
            <p className="text-[11px] text-[#525252]">
              Análise preditiva de risco, recomendações de investigação e verificação LGPD
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateAnalysis}
          disabled={loading}
          className="bg-white hover:bg-[#FEF9C3] text-xs font-bold gap-2 border-[#FACC15] text-[#0A0A0A]"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Analisando...
            </>
          ) : analysis ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar Análise
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              Gerar Insights com IA
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-md">
          {error}
        </div>
      )}

      {!analysis && !loading && (
        <div className="text-center py-6 px-4 space-y-2 bg-white/60 rounded-md border border-[#FEF08A]/60">
          <FileSearch className="w-8 h-8 text-[#D97706] mx-auto opacity-80" />
          <p className="text-xs font-semibold text-[#171717]">
            Obtenha um parecer inicial acelerado por Inteligência Artificial
          </p>
          <p className="text-[11px] text-[#737373] max-w-md mx-auto">
            A IA do Gemini analisa a narrativa do relato, categoriza o grau de risco institucional e mapeia os passos iniciais sugeridos para a instrução do processo ético.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-8 text-center space-y-3">
          <div className="w-7 h-7 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#0A0A0A]">
            Examinando narrativa, contexto corporativo e termos de risco com Gemini...
          </p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4 text-xs">
          {/* Summary & Risk Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 bg-white p-3.5 rounded-md border border-[#E5E5E5] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                Síntese Executiva
              </span>
              <p className="text-xs text-[#171717] font-medium leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-md border border-[#E5E5E5] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
                Grau de Risco Sugerido
              </span>
              <div className="pt-1">
                <RiskBadge level={analysis.riskLevel} />
              </div>
              <p className="text-[11px] text-[#525252] pt-1">
                {analysis.riskJustification}
              </p>
            </div>
          </div>

          {/* Investigation Steps & LGPD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-md border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />
                Passos Recomendados de Investigação
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#171717]">
                {analysis.investigationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-3.5 rounded-md border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                Observações de Privacidade & LGPD
              </span>
              <p className="text-[11px] text-[#525252] leading-relaxed">
                {analysis.lgpdConcerns}
              </p>
              <div className="pt-2 border-t border-[#F5F5F5]">
                <span className="text-[10px] font-bold text-[#737373] block">Categoria Recomendada:</span>
                <span className="font-semibold text-[#0A0A0A] text-xs">{analysis.recommendedCategory}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
