import React, { useState } from 'react';
import { Send, Paperclip, CheckCircle2, AlertTriangle, RefreshCw, Lock, ShieldCheck, Check } from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Typography } from '../ui/Typography';
import { FormField, FormLabel } from '../forms/FormField';
import { Button } from '../ui/Button';
import { FileUpload, UploadedFileItem } from '../forms/FileUpload';

interface PublicReplyFormProps {
  isClosed: boolean;
  onSendReply: (message: string, attachments: UploadedFileItem[]) => Promise<void>;
  onCloseReport: () => Promise<void>;
  isLoading: boolean;
}

export function PublicReplyForm({
  isClosed,
  onSendReply,
  onCloseReport,
  isLoading,
}: PublicReplyFormProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<UploadedFileItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed || isLoading) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!message.trim() && attachments.length === 0) {
      setErrorMsg('Escreva uma mensagem de resposta ou anexe ao menos um arquivo.');
      return;
    }

    try {
      await onSendReply(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      setSuccessMsg('Sua resposta e anexos foram enviados com sucesso à Ouvidoria do Grupo Bairral.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao enviar resposta. Tente novamente.');
    }
  };

  const handleCloseCase = async () => {
    if (isClosed || isLoading || isClosing) return;
    if (!window.confirm('Tem certeza que deseja declarar esta manifestação como resolvida e encerrar o acompanhamento público?')) {
      return;
    }

    setIsClosing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await onCloseReport();
      setSuccessMsg('Manifestação encerrada com sucesso. Obrigado por contatar o Grupo Bairral.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao encerrar manifestação.');
    } finally {
      setIsClosing(false);
    }
  };

  if (isClosed) {
    return (
      <Surface variant="card" className="border border-[#E5E5E5] bg-[#FAFAFA] p-6 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#64748B] mx-auto flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <Typography variant="h4" className="text-sm font-bold text-[#1E293B]">
            Formulário de Resposta Desativado
          </Typography>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
            Esta manifestação foi encerrada e não aceita novos esclarecimentos ou envios de arquivos.
          </p>
        </div>
      </Surface>
    );
  }

  return (
    <Surface variant="card" className="space-y-6 border border-[#E5E5E5]">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-[#0A0A0A]" />
          <Typography variant="h4" className="text-sm font-bold text-[#171717]">
            Enviar Esclarecimento / Novos Anexos
          </Typography>
        </div>
        <span className="text-[11px] text-[#737373]">Comunicação Direta e Criptografada</span>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-md text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField>
          <FormLabel>Mensagem / Esclarecimento Adicional</FormLabel>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            rows={4}
            placeholder="Digite aqui as informações adicionais solicitadas pela comissão ou seu comentário de acompanhamento..."
            disabled={isLoading || isClosing}
            className="w-full p-3 text-xs bg-white border border-[#D4D4D4] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0A0A0A] focus:border-transparent transition-all placeholder:text-[#A3A3A3]"
          />
        </FormField>

        {/* Upload de Novos Anexos */}
        <FileUpload
          label="Adicionar Novos Documentos ou Evidências"
          files={attachments}
          onChange={setAttachments}
          showMetadataWarning={true}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E5E5E5]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCloseCase}
            disabled={isLoading || isClosing}
            leftIcon={isClosing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-[#16A34A]" />}
            className="w-full sm:w-auto text-xs font-semibold text-[#166534] border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7]"
          >
            {isClosing ? 'Encerrando...' : 'Declarar Atendimento Resolvido / Encerrar'}
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || isClosing}
            leftIcon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold justify-center"
          >
            {isLoading ? 'Enviando...' : 'Enviar Resposta à Ouvidoria'}
          </Button>
        </div>
      </form>
    </Surface>
  );
}
