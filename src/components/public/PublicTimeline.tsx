import React from 'react';
import {
  Clock,
  CheckCircle2,
  FileSearch,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  CornerDownRight,
  Archive,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Typography } from '../ui/Typography';
import { PublicTimelineItem } from '../../services/publicService';

interface PublicTimelineProps {
  timeline: PublicTimelineItem[];
}

export function PublicTimeline({ timeline }: PublicTimelineProps) {
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

  const getTimelineIcon = (type: PublicTimelineItem['type'], status?: string) => {
    if (type === 'SYSTEM') {
      return <ShieldCheck className="w-4 h-4 text-[#0A0A0A]" />;
    }
    if (type === 'MESSAGE') {
      return <MessageSquare className="w-4 h-4 text-[#0284C7]" />;
    }
    if (type === 'REPORTER_REPLY') {
      return <CornerDownRight className="w-4 h-4 text-[#15803D]" />;
    }

    // STATUS_CHANGE
    const s = status?.toUpperCase() || '';
    if (s === 'RESOLVED' || s === 'COMPLETED') {
      return <CheckCircle2 className="w-4 h-4 text-[#059669]" />;
    }
    if (s === 'INVESTIGATION' || s === 'ACTION_PLAN') {
      return <FileSearch className="w-4 h-4 text-[#D97706]" />;
    }
    if (s === 'ARCHIVED' || s === 'REJECTED') {
      return <Archive className="w-4 h-4 text-[#737373]" />;
    }
    return <Clock className="w-4 h-4 text-[#525252]" />;
  };

  if (!timeline || timeline.length === 0) {
    return (
      <Surface variant="card" className="border border-[#E5E5E5] text-center py-8">
        <Clock className="w-8 h-8 text-[#A3A3A3] mx-auto mb-2" />
        <p className="text-xs text-[#737373]">Nenhum histórico disponível até o momento.</p>
      </Surface>
    );
  }

  return (
    <Surface variant="card" className="space-y-4 border border-[#E5E5E5]">
      <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
        <Clock className="w-4 h-4 text-[#0A0A0A]" />
        <Typography variant="h4" className="text-sm font-bold text-[#171717]">
          Linha do Tempo Pública
        </Typography>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E5E5]">
        {timeline.map((item, index) => {
          const isLast = index === timeline.length - 1;
          return (
            <div key={item.id || index} className="relative group">
              {/* Ponto / Ícone da Linha do Tempo */}
              <div className="absolute -left-6 top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-white border border-[#D4D4D4] shadow-xs">
                {getTimelineIcon(item.type, item.status)}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-[#171717]">{item.title}</h4>
                  <span className="text-[11px] text-[#737373] bg-[#F5F5F5] px-2 py-0.5 rounded font-mono">
                    {formatDate(item.date)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-[#525252] leading-relaxed max-w-2xl bg-[#FAFAFA] p-2.5 rounded border border-[#F0F0F0]">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
