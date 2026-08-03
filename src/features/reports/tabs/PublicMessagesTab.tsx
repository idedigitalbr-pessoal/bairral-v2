import React, { useState } from 'react';
import { Send, MessageSquare, Info, Shield, HelpCircle, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { Report, PublicMessage } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { formatDateTime } from '../../../lib/dateUtils';
import { useAddPublicMessage, useUpdateReport } from '../../../hooks/useReports';
import { ReportStatusEnum } from '../../../types/enums';
import { geminiService } from '../../../services/geminiService';

interface PublicMessagesTabProps {
  report: Report;
  onShowToast: (title: string, message?: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

export function PublicMessagesTab({ report, onShowToast }: PublicMessagesTabProps) {
  const addPublicMessageMutation = useAddPublicMessage();
  const updateReportMutation = useUpdateReport();

  const [messageContent, setMessageContent] = useState('');
  const [draftingAi, setDraftingAi] = useState(false);

  const publicMessages: PublicMessage[] = report.publicMessages || [];

  const handleGenerateDraftAi = async () => {
    setDraftingAi(true);
    try {
      const result = await geminiService.draftReply({
        title: report.title,
        description: report.description,
        currentStatus: report.status,
      });
      if (result?.suggestedReply) {
        setMessageContent(result.suggestedReply);
        onShowToast('Rascunho IA Gerado', 'O texto sugerido pelo Gemini foi aplicado na caixa de mensagem.', 'info');
      }
    } catch (err) {
      onShowToast('Erro na IA', 'Não foi possível gerar a resposta neste momento.', 'danger');
    } finally {
      setDraftingAi(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      onShowToast('Campo obrigatório', 'Digite o texto da mensagem.', 'warning');
      return;
    }

    await addPublicMessageMutation.mutateAsync({
      id: report.id,
      content: messageContent,
      senderType: 'COMMITTEE',
    });

    onShowToast('Mensagem enviada', 'Mensagem enviada ao canal de acompanhamento do manifestante.', 'success');
    setMessageContent('');
  };

  const handleSendRequestInfo = async () => {
    if (!messageContent.trim()) {
      onShowToast('Campo obrigatório', 'Digite a solicitação de informações no campo de texto.', 'warning');
      return;
    }

    await addPublicMessageMutation.mutateAsync({
      id: report.id,
      content: messageContent,
      senderType: 'COMMITTEE',
    });

    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status: ReportStatusEnum.PENDING_INFO,
        reason: 'Solicitação de informações enviada ao manifestante pelo canal público.',
      } as any,
    });

    onShowToast(
      'Informações solicitadas',
      'Mensagem enviada e status alterado para Aguardando Informações.',
      'success'
    );
    setMessageContent('');
  };

  return (
    <div className="space-y-6">
      {/* Public Channel Banner */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1E40AF] space-y-1">
          <h4 className="font-bold">Canal Público de Comunicação Bilateral</h4>
          <p className="leading-relaxed">
            As mensagens postadas nesta aba ficam visíveis para o manifestante através da chave de acesso e protocolo na área pública de acompanhamento. Comentários e notas internas privadas NUNCA são transmitidos neste canal.
          </p>
        </div>
      </div>

      {/* Message History Chat */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
          <MessageSquare className="w-4 h-4 text-[#171717]" />
          Histórico de Diálogo Bilateral ({publicMessages.length})
        </h3>

        {publicMessages.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#737373]">
            Nenhuma mensagem trocada no canal público deste protocolo ainda.
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
            {publicMessages.map((msg) => {
              const isCommittee = msg.senderType === 'COMMITTEE';
              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg border text-xs space-y-2 ${
                    isCommittee
                      ? 'bg-[#F0FDF4] border-[#BBF7D0] ml-6'
                      : 'bg-[#FAFAFA] border-[#E5E5E5] mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
                    <span className="font-bold text-[#0A0A0A] flex items-center gap-1.5">
                      {isCommittee ? (
                        <>
                          <Shield className="w-3.5 h-3.5 text-[#166534]" />
                          Ouvidoria / Comitê de Ética
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                          {msg.senderName || 'Manifestante'}
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-[#737373]">
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>

                  <p className="text-[#171717] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0A0A0A]">
            Escrever Mensagem para o Manifestante
          </h4>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateDraftAi}
            disabled={draftingAi}
            className="text-[11px] gap-1.5 border-[#FACC15] bg-[#FEF9C3]/50 hover:bg-[#FEF9C3] text-[#0A0A0A] font-semibold"
          >
            {draftingAi ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-[#D97706]" />
                Sugerindo...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                Rascunhar Resposta com IA
              </>
            )}
          </Button>
        </div>

        <textarea
          rows={4}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Digite o comunicado ou resposta que será publicado para o manifestante..."
          className="w-full bg-white border border-[#D4D4D4] rounded-md p-3 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
        />

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSendRequestInfo}
            isLoading={addPublicMessageMutation.isPending || updateReportMutation.isPending}
            className="w-full sm:w-auto text-xs gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
            Solicitar Info (+ Status Aguardando)
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            isLoading={addPublicMessageMutation.isPending}
            className="w-full sm:w-auto text-xs gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar Mensagem Pública
          </Button>
        </div>
      </div>
    </div>
  );
}
