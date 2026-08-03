import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : new Date(isoString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return '—';
  }
}

export function formatDate(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : new Date(isoString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return '—';
  }
}

export function calculateOpenTime(createdAtISO: string, resolvedAtISO?: string | null): string {
  if (!createdAtISO) return '—';
  try {
    const start = parseISO(createdAtISO);
    const end = resolvedAtISO ? parseISO(resolvedAtISO) : new Date();

    const days = Math.abs(differenceInDays(end, start));
    const hours = Math.abs(differenceInHours(end, start)) % 24;
    const minutes = Math.abs(differenceInMinutes(end, start)) % 60;

    let timeText = '';
    if (days > 0) {
      timeText += `${days} dia${days > 1 ? 's' : ''}`;
      if (hours > 0) timeText += ` e ${hours}h`;
    } else if (hours > 0) {
      timeText += `${hours} hora${hours > 1 ? 's' : ''}`;
      if (minutes > 0) timeText += ` e ${minutes} min`;
    } else {
      timeText += `${Math.max(1, minutes)} minuto${minutes > 1 ? 's' : ''}`;
    }

    if (resolvedAtISO) {
      return `Concluído em ${timeText}`;
    }
    return `${timeText} em aberto`;
  } catch {
    return '—';
  }
}

export function calculateSlaStatus(slaDueDateISO?: string | null, isClosed = false) {
  if (!slaDueDateISO) {
    return { isOverdue: false, text: 'Sem SLA definido', daysLeft: 0, badgeVariant: 'default' as const };
  }
  try {
    const dueDate = parseISO(slaDueDateISO);
    const now = new Date();
    const overdue = isBefore(dueDate, now) && !isClosed;
    const daysLeft = differenceInDays(dueDate, now);

    if (isClosed) {
      return { isOverdue: false, text: `Prazo final: ${formatDate(slaDueDateISO)}`, daysLeft, badgeVariant: 'secondary' as const };
    }

    if (overdue) {
      const daysOverdue = Math.abs(daysLeft);
      return {
        isOverdue: true,
        text: `Atrasado há ${daysOverdue} dia${daysOverdue !== 1 ? 's' : ''} (Venceu em ${formatDate(slaDueDateISO)})`,
        daysLeft,
        badgeVariant: 'danger' as const,
      };
    }

    if (daysLeft === 0) {
      return {
        isOverdue: false,
        text: `Vence hoje (${formatDate(slaDueDateISO)})`,
        daysLeft: 0,
        badgeVariant: 'warning' as const,
      };
    }

    return {
      isOverdue: false,
      text: `Vence em ${daysLeft} dia${daysLeft > 1 ? 's' : ''} (${formatDate(slaDueDateISO)})`,
      daysLeft,
      badgeVariant: 'info' as const,
    };
  } catch {
    return { isOverdue: false, text: '—', daysLeft: 0, badgeVariant: 'default' as const };
  }
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
