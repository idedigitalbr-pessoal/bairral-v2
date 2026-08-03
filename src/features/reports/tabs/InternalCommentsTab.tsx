import React, { useState } from 'react';
import { Lock, FileText, Send, UserCheck, ShieldAlert } from 'lucide-react';
import { Report, InternalComment } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { formatDateTime } from '../../../lib/dateUtils';
import { useAddInternalComment } from '../../../hooks/useReports';

interface InternalCommentsTabProps {
  report: Report;
  onShowToast: (title: string, message?: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

export function InternalCommentsTab({ report, onShowToast }: InternalCommentsTabProps) {
  const addInternalCommentMutation = useAddInternalComment();
  const [commentContent, setCommentContent] = useState('');

  const commentsList: InternalComment[] = report.internalComments || [];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      onShowToast('Campo obrigatório', 'Digite o texto do comentário interno.', 'warning');
      return;
    }

    await addInternalCommentMutation.mutateAsync({
      id: report.id,
      content: commentContent,
    });

    onShowToast('Comentário adicionado', 'Nota interna gravada com sigilo absoluto.', 'success');
    setCommentContent('');
  };

  return (
    <div className="space-y-6">
      {/* Strict Confidentiality Banner */}
      <div className="bg-[#FEF2F2] border border-[#FECACA] p-4 rounded-lg flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
        <div className="text-xs text-[#991B1B] space-y-1">
          <h4 className="font-bold">SIGILO INTERNO E RESTRITO AO COMITÊ</h4>
          <p className="leading-relaxed">
            Os comentários e notas gravados nesta aba são estritamente confidenciais e acessíveis exclusivamente por membros autorizados do comitê de integridade. Nenhuma dessas informações é visível no portal público do manifestante.
          </p>
        </div>
      </div>

      {/* Internal Comments Timeline */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
          <FileText className="w-4 h-4 text-[#171717]" />
          Notas e Análises Internas ({commentsList.length})
        </h3>

        {commentsList.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#737373]">
            Nenhum comentário interno registrado para esta manifestação até o momento.
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
            {commentsList.map((cmt) => (
              <div
                key={cmt.id}
                className="p-4 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] text-xs space-y-2"
              >
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0A0A0A]">
                      {cmt.authorName}
                    </span>
                    <span className="text-[10px] bg-[#E5E5E5] text-[#171717] px-2 py-0.5 rounded-full font-semibold">
                      {cmt.authorRole}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#737373]">
                    {formatDateTime(cmt.createdAt)}
                  </span>
                </div>

                <p className="text-[#171717] leading-relaxed whitespace-pre-wrap">
                  {cmt.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Internal Comment Form */}
      <form onSubmit={handleAddComment} className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-[#0A0A0A]">
          Adicionar Nova Análise / Nota Interna Confidencial
        </h4>

        <textarea
          rows={4}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Registre impressões técnicas, oitivas, recomendações de conduta e deliberações do comitê..."
          className="w-full bg-white border border-[#D4D4D4] rounded-md p-3 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={addInternalCommentMutation.isPending}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Salvar Nota Interna Sigilosa
          </Button>
        </div>
      </form>
    </div>
  );
}
