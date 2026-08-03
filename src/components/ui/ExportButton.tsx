import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { exportToCSV, exportToPDF } from '../../lib/exportUtils';

export interface ExportButtonProps {
  title: string;
  subtitle?: string;
  filename?: string;
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
}

export function ExportButton({
  title,
  subtitle = 'Relatório extraído do Canal de Ética e Integridade',
  filename,
  headers,
  rows,
  size = 'sm',
  variant = 'outline',
  disabled = false,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportExcel = () => {
    setIsOpen(false);
    exportToCSV(filename || title, headers, rows);
  };

  const handleExportPdf = () => {
    setIsOpen(false);
    exportToPDF(title, subtitle, headers, rows, filename);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled || rows.length === 0}
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Download className="w-3.5 h-3.5" />}
        rightIcon={<ChevronDown className="w-3 h-3 ml-0.5" />}
      >
        Exportar
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg border border-[#E5E5E5] py-1 z-50 focus:outline-none">
          <button
            onClick={handleExportExcel}
            className="w-full text-left px-3 py-2 text-xs text-[#171717] hover:bg-[#FAFAFA] flex items-center gap-2 transition-colors font-medium"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#107C41]" />
            <span>Exportar Excel (.csv)</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="w-full text-left px-3 py-2 text-xs text-[#171717] hover:bg-[#FAFAFA] flex items-center gap-2 transition-colors font-medium border-t border-[#F5F5F5]"
          >
            <FileText className="w-4 h-4 text-[#A80000]" />
            <span>Exportar Documento (PDF)</span>
          </button>
        </div>
      )}
    </div>
  );
}
