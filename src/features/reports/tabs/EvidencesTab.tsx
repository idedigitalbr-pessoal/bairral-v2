import React, { useState } from 'react';
import { Paperclip, Upload, FileText, Download, Eye, CheckCircle2, File } from 'lucide-react';
import { Report, Attachment } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { formatDateTime, formatFileSize } from '../../../lib/dateUtils';
import { useAddEvidence } from '../../../hooks/useReports';

interface EvidencesTabProps {
  report: Report;
  onShowToast: (title: string, message?: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

export function EvidencesTab({ report, onShowToast }: EvidencesTabProps) {
  const addEvidenceMutation = useAddEvidence();

  const [fileName, setFileName] = useState('');
  const [mimeType, setMimeType] = useState('application/pdf');

  const attachmentsList: Attachment[] = report.attachments || [];

  const handleUploadSimulated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      onShowToast('Nome do arquivo obrigatório', 'Informe o nome do documento ou imagem.', 'warning');
      return;
    }

    const simulatedSize = Math.floor(Math.random() * 3000000) + 500000;

    await addEvidenceMutation.mutateAsync({
      id: report.id,
      evidence: {
        fileName,
        fileSize: simulatedSize,
        mimeType,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    });

    onShowToast('Evidência anexada', `Arquivo "${fileName}" vinculado com sucesso ao processo.`, 'success');
    setFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#171717]" />
            Anexar Nova Evidência ao Processo
          </h3>
          <p className="text-xs text-[#737373] mt-0.5">
            Adicione documentos, relatórios técnicos, imagens ou registros para instrução do processo.
          </p>
        </div>

        <form onSubmit={handleUploadSimulated} className="flex flex-col sm:flex-row items-end gap-3 bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
          <div className="flex-1 w-full space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">
              Nome do Documento / Arquivo
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Ex: relatorio_escala_plantao_jan2026.pdf"
              className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
            />
          </div>

          <div className="w-full sm:w-48 space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">
              Tipo do Arquivo
            </label>
            <select
              value={mimeType}
              onChange={(e) => setMimeType(e.target.value)}
              className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
            >
              <option value="application/pdf">Documento PDF</option>
              <option value="image/png">Imagem PNG / JPG</option>
              <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word (.docx)</option>
              <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Planilha Excel (.xlsx)</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={addEvidenceMutation.isPending}
            className="w-full sm:w-auto text-xs gap-1.5 cursor-pointer shrink-0"
          >
            <Paperclip className="w-3.5 h-3.5" />
            Anexar Documento
          </Button>
        </form>
      </div>

      {/* Attachments List */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="font-heading text-sm font-bold text-[#0A0A0A] flex items-center gap-2 border-b border-[#F5F5F5] pb-3">
          <FileText className="w-4 h-4 text-[#171717]" />
          Documentos e Arquivos Anexados ({attachmentsList.length})
        </h3>

        {attachmentsList.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#737373]">
            Nenhum documento ou imagem anexado a esta manifestação até o momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attachmentsList.map((att) => (
              <div
                key={att.id}
                className="bg-[#FAFAFA] border border-[#E5E5E5] p-3.5 rounded-md flex items-start justify-between gap-3 hover:border-[#D4D4D4] transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <File className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0A0A0A] truncate" title={att.fileName}>
                      {att.fileName}
                    </h4>
                    <p className="text-[11px] text-[#737373] mt-0.5">
                      {formatFileSize(att.fileSize)} • {formatDateTime(att.uploadedAt)}
                    </p>
                    <p className="text-[10px] text-[#525252] mt-0.5">
                      Enviado por: {att.uploadedBy || 'Sistema'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={att.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-black/5 rounded text-[#525252] hover:text-[#0A0A0A] transition-colors"
                    title="Visualizar documento"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
