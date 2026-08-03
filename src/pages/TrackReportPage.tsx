import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck, Key, FileQuestion, CheckCircle2 } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

import { TrackingLogin } from '../components/public/TrackingLogin';
import { PublicReportSummary } from '../components/public/PublicReportSummary';
import { PublicTimeline } from '../components/public/PublicTimeline';
import { PublicMessageThread } from '../components/public/PublicMessageThread';
import { PublicReplyForm } from '../components/public/PublicReplyForm';

import { publicService, TrackPublicReportResponse } from '../services/publicService';
import { UploadedFileItem } from '../components/forms/FileUpload';

export function TrackReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Credenciais ativas da sessão de acompanhamento
  const [credentials, setCredentials] = useState<{ protocol: string; accessKey: string } | null>(() => {
    const p = searchParams.get('protocol');
    const k = searchParams.get('accessKey') || searchParams.get('key');
    if (p && k) {
      return { protocol: p, accessKey: k };
    }
    return null;
  });

  const [authError, setAuthError] = useState<string | null>(null);

  // TanStack Query: Consulta de manifestação pública com credenciais
  const {
    data: report,
    isLoading: isQueryLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery<TrackPublicReportResponse, Error>({
    queryKey: ['public-report-track', credentials?.protocol, credentials?.accessKey],
    queryFn: async () => {
      if (!credentials?.protocol || !credentials?.accessKey) {
        throw new Error('Credenciais de acompanhamento não fornecidas.');
      }
      return publicService.trackReport({
        protocol: credentials.protocol,
        accessKey: credentials.accessKey,
      });
    },
    enabled: !!credentials?.protocol && !!credentials?.accessKey,
    retry: 1,
    staleTime: 1000 * 60, // 1 minuto
  });

  // Trata erro de autenticação vindo do Query
  useEffect(() => {
    if (isError && queryError) {
      setAuthError(queryError.message || 'Protocolo ou chave de acesso incorretos.');
    } else if (report) {
      setAuthError(null);
    }
  }, [isError, queryError, report]);

  // TanStack Query Mutation: Enviar Resposta do Manifestante
  const replyMutation = useMutation({
    mutationFn: async ({ message, attachments }: { message: string; attachments: UploadedFileItem[] }) => {
      if (!credentials) throw new Error('Sessão expirada. Autentique-se novamente.');
      return publicService.sendReply({
        protocol: credentials.protocol,
        accessKey: credentials.accessKey,
        message,
        attachments,
      });
    },
    onSuccess: (updatedReport) => {
      // Invalida e atualiza em tempo real o cache do TanStack Query
      queryClient.setQueryData(
        ['public-report-track', credentials?.protocol, credentials?.accessKey],
        updatedReport
      );
      queryClient.invalidateQueries({
        queryKey: ['public-report-track', credentials?.protocol, credentials?.accessKey],
      });
    },
  });

  // TanStack Query Mutation: Encerrar Manifestação
  const closeMutation = useMutation({
    mutationFn: async () => {
      if (!credentials) throw new Error('Sessão expirada.');
      return publicService.closeReport({
        protocol: credentials.protocol,
        accessKey: credentials.accessKey,
      });
    },
    onSuccess: (updatedReport) => {
      queryClient.setQueryData(
        ['public-report-track', credentials?.protocol, credentials?.accessKey],
        updatedReport
      );
      queryClient.invalidateQueries({
        queryKey: ['public-report-track', credentials?.protocol, credentials?.accessKey],
      });
    },
  });

  const handleLoginSubmit = (protocol: string, accessKey: string) => {
    setAuthError(null);
    setCredentials({ protocol, accessKey });
    setSearchParams({ protocol, accessKey });
  };

  const handleLogout = () => {
    setCredentials(null);
    setAuthError(null);
    setSearchParams({});
  };

  const handleSendReply = async (message: string, attachments: UploadedFileItem[]) => {
    await replyMutation.mutateAsync({ message, attachments });
  };

  const handleCloseReport = async () => {
    await closeMutation.mutateAsync();
  };

  return (
    <Container size="md" className="py-10 space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors"
            title="Voltar ao início"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <Typography variant="h2" className="text-xl font-extrabold text-[#0A0A0A]">
              Acompanhamento de Manifestação
            </Typography>
            <p className="text-xs text-[#737373]">
              Canal Oficial de Integridade do Grupo Bairral &bull; Consulta Segura
            </p>
          </div>
        </div>

        {credentials && report && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-[#525252] hover:text-[#171717]"
          >
            Nova Consulta
          </Button>
        )}
      </div>

      {/* ESTADO 1: Tela de Entrada / Autenticação Simulada (TrackingLogin) */}
      {!credentials || (!report && !isQueryLoading && authError) ? (
        <TrackingLogin
          initialProtocol={credentials?.protocol || ''}
          initialAccessKey={credentials?.accessKey || ''}
          onSubmit={handleLoginSubmit}
          isLoading={isQueryLoading}
          errorMessage={authError}
        />
      ) : isQueryLoading ? (
        /* ESTADO 2: Carregamento (Loading Skeleton) */
        <Surface variant="card" className="py-16 text-center space-y-4 border border-[#E5E5E5]">
          <RefreshCw className="w-8 h-8 text-[#0A0A0A] animate-spin mx-auto" />
          <div className="space-y-1">
            <Typography variant="h4" className="text-sm font-bold text-[#171717]">
              Autenticando e Localizando Manifestação...
            </Typography>
            <p className="text-xs text-[#737373]">
              Verificando chaves de acesso no servidor seguro do Grupo Bairral.
            </p>
          </div>
        </Surface>
      ) : isError || !report ? (
        /* ESTADO 3: Erro ou Protocolo Não Encontrado */
        <Surface variant="card" className="p-8 text-center space-y-6 border border-[#E5E5E5]">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <Typography variant="h3" className="text-lg font-bold text-[#171717]">
              Manifestação Não Encontrada
            </Typography>
            <p className="text-xs text-[#525252] leading-relaxed">
              Não localizamos nenhuma manifestação correspondente ao protocolo{' '}
              <strong className="text-[#171717]">{credentials.protocol}</strong> e chave de acesso fornecidos.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs">
              Tentar Outras Credenciais
            </Button>
            <Button variant="primary" size="sm" onClick={() => refetch()} className="text-xs font-bold">
              Tentar Novamente
            </Button>
          </div>
        </Surface>
      ) : (
        /* ESTADO 4: Painel do Manifestante Autenticado */
        <div className="space-y-8">
          {/* 1. Resumo Público */}
          <PublicReportSummary report={report} onLogout={handleLogout} />

          {/* 2. Mensagens Públicas e Solicitações de Informação */}
          <PublicMessageThread messages={report.publicMessages} />

          {/* 3. Formulário de Resposta / Envio de Novos Anexos */}
          <PublicReplyForm
            isClosed={report.isClosed}
            onSendReply={handleSendReply}
            onCloseReport={handleCloseReport}
            isLoading={replyMutation.isPending || closeMutation.isPending}
          />

          {/* 4. Linha do Tempo Pública */}
          <PublicTimeline timeline={report.timeline} />
        </div>
      )}
    </Container>
  );
}
