import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper para cliente Gemini
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // 1. Endpoint: Análise inteligente de manifestação
  app.post('/api/gemini/analyze-report', async (req, res) => {
    try {
      const { title, description, category, unit, type } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY não configurada no servidor',
        });
      }

      const prompt = `Analise a seguinte manifestação recebida pelo Canal de Ética do Grupo Bairral (Hospital Psiquiátrico e Rede de Saúde Mental):
Título: ${title || 'Sem título'}
Tipo: ${type || 'Não informado'}
Categoria: ${category || 'Não informada'}
Unidade: ${unit || 'Não informada'}
Relato:
${description || 'Sem descrição'}

Forneça uma análise técnica e neutra no formato JSON contendo:
1. summary: Um resumo executivo claro de até 3 frases.
2. riskLevel: Nível de gravidade sugerido entre 'BAIXO', 'MEDIO', 'ALTO', 'CRITICO'.
3. riskJustification: Justificativa técnica do nível de risco baseado em impacto institucional, LGPD, vulnerabilidade de pacientes ou conformidade trabalhista.
4. recommendedCategory: Categoria ideal ou confirmação da categoria informada.
5. investigationSteps: Lista com 3 a 5 recomendações de passos investigativos para o Comitê de Ética.
6. lgpdConcerns: Observação sobre proteção de dados pessoais ou sensíveis citados no relato.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Você é um especialista sênior em Governança, Compliance Hospitalar e LGPD do Grupo Bairral. Analise relatos de ética de forma objetiva, profissional e sigilosa.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              riskJustification: { type: Type.STRING },
              recommendedCategory: { type: Type.STRING },
              investigationSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              lgpdConcerns: { type: Type.STRING },
            },
            required: ['summary', 'riskLevel', 'riskJustification', 'investigationSteps'],
          },
        },
      });

      const jsonText = response.text || '{}';
      const result = JSON.parse(jsonText);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro na API Gemini (analyze-report):', error);
      return res.status(500).json({ error: error?.message || 'Falha ao analisar manifestação' });
    }
  });

  // 2. Endpoint: Rascunho de resposta institucional ao manifestante
  app.post('/api/gemini/draft-reply', async (req, res) => {
    try {
      const { title, description, currentStatus, actionTaken } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(400).json({ error: 'GEMINI_API_KEY não configurada no servidor' });
      }

      const prompt = `Gere uma resposta institucional acolhedora, transparente e formal para ser enviada ao manifestante do Canal de Ética do Grupo Bairral.
Detalhes do Caso:
- Título: ${title}
- Relato Resumido: ${description}
- Status Atual: ${currentStatus}
- Providência em andamento / decisão: ${actionTaken || 'Análise técnica inicial pela Ouvidoria'}

Requisitos da resposta:
- Tom profissional, empático e de respeito à privacidade.
- Não prometa prazos impossíveis nem revele dados sigilosos do investigado.
- Confirme que o Comitê de Ética está tratando com o devido sigilo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Você é a Ouvidoria e Comitê de Ética Oficial do Grupo Bairral. Redija comunicações oficiais claras, éticas e acolhedoras para manifestantes.',
        },
      });

      return res.json({ suggestedReply: response.text || '' });
    } catch (error: any) {
      console.error('Erro na API Gemini (draft-reply):', error);
      return res.status(500).json({ error: error?.message || 'Falha ao gerar rascunho de resposta' });
    }
  });

  // 3. Endpoint: Diagnóstico Executivo de Governança
  app.post('/api/gemini/executive-insights', async (req, res) => {
    try {
      const { totalReports, pendingReports, criticalCount, overdueCount, topCategories, topUnits } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(400).json({ error: 'GEMINI_API_KEY não configurada no servidor' });
      }

      const prompt = `Analise os dados consolidados do Canal de Ética do Grupo Bairral e gere um Diagnóstico Executivo de Governança:
Métricas Atuais:
- Total de Manifestações: ${totalReports}
- Em Tratativa / Pendentes: ${pendingReports}
- Casos de Gravidade Crítica: ${criticalCount}
- Casos Fora do SLA (Em Atraso): ${overdueCount}
- Principais Categorias: ${JSON.stringify(topCategories || [])}
- Unidades Mais Recorrentes: ${JSON.stringify(topUnits || [])}

Retorne um JSON com:
1. executiveSummary: Uma visão geral do cenário de integridade e aderência ao SLA.
2. topRisks: Lista dos 3 principais riscos identificados com base nos dados.
3. recommendedActions: 3 a 5 recomendações estratégicas para a Diretoria Executiva e RH/Compliance.
4. trendAnalysis: Avaliação de tendências e áreas prioritárias para ações preventivas.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Você é o Auditor Executivo de Governança e Compliance do Grupo Bairral. Apresente relatórios sintéticos, orientados a dados e acionáveis.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              topRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              trendAnalysis: { type: Type.STRING },
            },
            required: ['executiveSummary', 'topRisks', 'recommendedActions', 'trendAnalysis'],
          },
        },
      });

      const jsonText = response.text || '{}';
      const result = JSON.parse(jsonText);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro na API Gemini (executive-insights):', error);
      return res.status(500).json({ error: error?.message || 'Falha ao gerar diagnóstico executivo' });
    }
  });

  // Servir Vite no ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando com suporte full-stack Gemini na porta ${PORT}`);
  });
}

startServer();
