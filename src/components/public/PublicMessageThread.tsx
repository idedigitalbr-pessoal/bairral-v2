import React from 'react';
import { MessageSquare, Shield, User, Paperclip, FileText, Download, HelpCircle } from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Typography } from '../ui/Typography';
import { PublicMessageItem } from '../../services/publicService';

interface PublicMessageThreadProps {
  messages: PublicMessageItem[];
}

export function PublicMessageThread({ messages }: PublicMessageThreadProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!messages || messages.length === 0) {
    return (
      <Surface variant="card" className="border border-[#E5E5E5] text-center py-8">
        <MessageSquare className="w-8 h-8 text-[#A3A3A3] mx-auto mb-2" />
        <p className="text-xs text-[#737373]">Nenhuma mensagem pública trocada até o momento.</p>
      </Surface>
    );
  }

  return (
    <Surface variant="card" className="space-y-4 border border-[#E5E5E5]">
      <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
        <MessageSquare className="w-4 h-4 text-[#0A0A0A]" />
        <Typography variant="h4" className="text-sm font-bold text-[#171717]">
          Comunicações Públicas ({messages.length})
        </Typography>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => {
          const isCommittee = msg.senderType === 'COMMITTEE';
          const isReporter = msg.senderType === 'REPORTER';
          const isInfoReq = msg.isInformationRequest || (isCommittee && (msg.content.toLowerCase().includes('solicita') || msg.content.toLowerCase().includes('informaç')));

          return (
            <div
              key={msg.id}
              className={`p-4 rounded-lg border transition-colors ${
                isInfoReq
                  ? 'bg-[#FEFCE8] border-[#FDE047]'
                  : isCommittee
                  ? 'bg-[#F8FAFC] border-[#E2E8F0]'
                  : 'bg-[#F0FDF4] border-[#BBF7D0]'
              }`}
            >
              {/* Cabeçalho da Mensagem */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-full ${
                      isCommittee
                        ? 'bg-[#0A0A0A] text-white'
                        : 'bg-[#166534] text-white'
                    }`}
                  >
                    {isCommittee ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#171717]">
                      {isCommittee ? 'Ouvidoria / Comitê de Ética' : 'Manifestante (Você)'}
                    </span>
                    {isInfoReq && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#854D0E] bg-[#FEF08A] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <HelpCircle className="w-3 h-3" /> Solicitação de Informações
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-[#737373] font-mono">{formatDate(msg.createdAt)}</span>
              </div>

              {/* Conteúdo da Mensagem */}
              <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Anexos da Mensagem */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-black/5 space-y-2">
                  <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                    <Paperclip className="w-3 h-3 text-[#64748B]" /> Documentos Anexados ({msg.attachments.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 bg-white rounded border border-[#CBD5E1] hover:border-[#94A3B8] transition-colors text-xs group"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <FileText className="w-4 h-4 text-[#64748B] shrink-0" />
                          <span className="font-medium text-[#1E293B] truncate group-hover:underline">
                            {att.fileName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] shrink-0">
                          {att.fileSize && <span>{formatFileSize(att.fileSize)}</span>}
                          <Download className="w-3.5 h-3.5 text-[#475569]" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
