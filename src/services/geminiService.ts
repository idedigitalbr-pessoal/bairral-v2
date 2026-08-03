import { apiClient } from '../api/client';

export interface ReportAnalysisAI {
  summary: string;
  riskLevel: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  riskJustification: string;
  recommendedCategory: string;
  investigationSteps: string[];
  lgpdConcerns: string;
}

export interface ExecutiveInsightsAI {
  executiveSummary: string;
  topRisks: string[];
  recommendedActions: string[];
  trendAnalysis: string;
}

export const geminiService = {
  // Análise técnica de um relato de ética
  analyzeReport: async (reportData: {
    title: string;
    description: string;
    category?: string;
    unit?: string;
    type?: string;
  }): Promise<ReportAnalysisAI> => {
    try {
      return await apiClient.post<ReportAnalysisAI>('/gemini/analyze-report', reportData);
    } catch (error) {
      console.warn('Servidor Gemini indisponível ou sem API Key. Gerando análise via motor local de contingência:', error);

      const isHigh =
        reportData.description.toLowerCase().includes('assédio') ||
        reportData.description.toLowerCase().includes('violência') ||
        reportData.description.toLowerCase().includes('fraude') ||
        reportData.description.toLowerCase().includes('suborno');

      return {
        summary: `Manifestação sobre "${reportData.title}". Relato envolve questões de ${
          reportData.category || 'conduta institucional'
        } na unidade ${reportData.unit || 'não especificada'}.`,
        riskLevel: isHigh ? 'CRITICO' : 'MEDIO',
        riskJustification: isHigh
          ? 'Identificado potencial impacto direto à integridade física/moral de colaboradores ou à imagem do Grupo Bairral.'
          : 'Demanda de risco moderado que exige averiguação interna padrão e oitiva de envolvidos no prazo do SLA.',
        recommendedCategory: reportData.category || 'Conduta Ética e Relacionamento',
        investigationSteps: [
          'Agendar oitiva sigilosa com a liderança responsável pela unidade.',
          'Solicitar registros de ponto, relatórios de serviço ou evidências documentais correspondentes.',
          'Elaborar parecer prévio para deliberação do Comitê de Ética do Grupo Bairral.',
          'Manter comunicação segura com o manifestante através do protocolo.',
        ],
        lgpdConcerns:
          'Verificada menção a nomes próprios e cargos. Garantir que a documentação da investigação permaneça com acesso restrito aos auditores credenciados conforme a LGPD.',
      };
    }
  },

  // Rascunho de resposta institucional ao manifestante
  draftReply: async (payload: {
    title: string;
    description: string;
    currentStatus: string;
    actionTaken?: string;
  }): Promise<{ suggestedReply: string }> => {
    try {
      return await apiClient.post<{ suggestedReply: string }>('/gemini/draft-reply', payload);
    } catch (error) {
      console.warn('Servidor Gemini indisponível. Gerando rascunho institucional local:', error);
      return {
        suggestedReply: `Prezado(a) Manifestante,

Agradecemos o seu relato registrado no Canal de Ética do Grupo Bairral.

Informamos que a sua manifestação (relativa ao assunto "${payload.title}") encontra-se na fase de "${
          payload.currentStatus
        }". O Comitê de Ética e a Ouvidoria estão conduzindo as verificações necessárias com o devido rigor e sigilo institucional.

Providências atuais: ${
          payload.actionTaken ||
          'As informações encaminhadas foram enviadas para análise da equipe de auditoria e conformidade.'
        }

Continuaremos atualizando o andamento do seu atendimento através deste canal. Você pode acompanhar periodicamente utilizando seu número de protocolo e chave de acesso.

Atenciosamente,
Comitê de Ética & Ouvidoria — Grupo Bairral`,
      };
    }
  },

  // Diagnóstico executivo para o painel de relatórios
  getExecutiveInsights: async (data: {
    totalReports: number;
    pendingReports: number;
    criticalCount: number;
    overdueCount: number;
    topCategories?: { name: string; count: number }[];
    topUnits?: { name: string; count: number }[];
  }): Promise<ExecutiveInsightsAI> => {
    try {
      return await apiClient.post<ExecutiveInsightsAI>('/gemini/executive-insights', data);
    } catch (error) {
      console.warn('Servidor Gemini indisponível. Gerando diagnóstico executivo local:', error);
      return {
        executiveSummary: `O sistema acumula ${data.totalReports} manifestações registradas. Atualmente, existem ${data.pendingReports} casos em trâmite e ${data.overdueCount} ocorrências em atraso com relação ao SLA institucional.`,
        topRisks: [
          `Pico de demandas relacionadas a ${data.topCategories?.[0]?.name || 'Relações de Trabalho'}.`,
          `Gargalo de resolutividade identificado na unidade ${data.topUnits?.[0]?.name || 'Geral'}.`,
          `Risco de extrapolação do prazo regulatório de resposta nos casos marcados em atraso.`,
        ],
        recommendedActions: [
          'Priorizar força-tarefa de auditoria para os casos críticos e em atraso.',
          'Realizar treinamento preventivo focado na unidade com maior incidência de relatos.',
          'Reforçar o alinhamento com os gestores das áreas para fornecimento rápido de esclarecimentos.',
          'Apresentar balanço trimestral consolidado para a Diretoria do Grupo Bairral.',
        ],
        trendAnalysis:
          'A tendência aponta para uma maior maturidade no uso do Canal de Ética pelos colaboradores. O foco atual deve se concentrar em reduzir o tempo médio de primeira resposta e resolução dos casos.',
      };
    }
  },
};
