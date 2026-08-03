import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface UploadedFileItem {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url?: string;
}

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  files?: UploadedFileItem[];
  onChange?: (files: UploadedFileItem[]) => void;
  showMetadataWarning?: boolean;
  className?: string;
}

export function FileUpload({
  label = 'Anexar Documentos ou Evidências',
  accept = '.pdf, .png, .jpg, .jpeg, .docx, .doc, .txt',
  maxSizeMB = 10,
  maxFiles = 5,
  files = [],
  onChange,
  showMetadataWarning = true,
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const addedFiles: UploadedFileItem[] = [...files];

    if (addedFiles.length >= maxFiles) {
      setErrorMsg(`Limite máximo de ${maxFiles} arquivos atingido.`);
      return;
    }

    Array.from(fileList).forEach((file) => {
      if (addedFiles.length >= maxFiles) return;

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setErrorMsg(`O arquivo "${file.name}" excede o tamanho máximo de ${maxSizeMB} MB.`);
        return;
      }

      // Simula leitura de arquivo e gera objeto
      const newItem: UploadedFileItem = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file),
      };

      addedFiles.push(newItem);
    });

    if (onChange) {
      onChange(addedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    if (onChange) onChange(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#171717]">{label}</label>
        <span className="text-[11px] text-[#737373]">
          {files.length}/{maxFiles} arquivo(s)
        </span>
      </div>

      {/* Drag and Drop Zone */}
      {files.length < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-md p-6 text-center transition-all cursor-pointer group',
            isDragOver
              ? 'border-[#FDC503] bg-[#FFF4C2]/30 scale-[1.005]'
              : 'border-[#D4D4D4] hover:border-[#171717] bg-[#FAFAFA]'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileSelect}
            className="sr-only"
            id="file-upload-input"
          />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] group-hover:bg-[#FFF4C2] text-[#737373] group-hover:text-[#0A0A0A] flex items-center justify-center transition-colors mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#0A0A0A]">
              Arraste seus arquivos até aqui ou <span className="text-[#2563EB] underline">clique para selecionar</span>
            </span>
            <span className="text-[11px] text-[#737373] mt-1">
              Tipos aceitos: PDF, PNG, JPG, JPEG, DOC, DOCX, TXT (Máx. {maxSizeMB}MB por arquivo)
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded text-xs text-[#991B1B] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#0A0A0A] block">Arquivos Anexados ({files.length}):</span>
          <div className="space-y-1.5">
            {files.map((file) => {
              const isImg = file.mimeType.startsWith('image/');
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded-md shadow-xs hover:border-[#171717] transition-all"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2 bg-[#F5F5F5] rounded text-[#171717] shrink-0">
                      {isImg ? <ImageIcon className="w-4 h-4 text-[#2563EB]" /> : <FileText className="w-4 h-4 text-[#D97706]" />}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-semibold text-[#0A0A0A] truncate">{file.fileName}</span>
                      <span className="text-[10px] text-[#737373]">
                        {formatFileSize(file.fileSize)} &bull; <span className="text-[#16A34A] font-medium">Pronto para envio</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    className="text-[#DC2626] hover:bg-[#FEF2F2] h-8 w-8 p-0 shrink-0"
                    title="Remover arquivo"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metadata Warning */}
      {showMetadataWarning && (
        <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-md text-[11px] text-[#92400E] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
          <div className="leading-relaxed">
            <strong className="font-bold">Aviso sobre Privacidade e Metadados de Arquivos:</strong>
            <p className="mt-0.5">
              Se você optou por uma manifestação anônima, lembre-se de que arquivos de imagem (como fotos de câmera de celular) ou documentos em PDF/Word podem conter metadados originais (como seu nome, marca d'água ou dados de GPS). Remova as propriedades pessoais dos arquivos caso queira resguardar 100% de sigilo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
