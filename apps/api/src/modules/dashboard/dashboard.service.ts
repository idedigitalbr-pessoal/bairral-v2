import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DashboardFilterDto {
  startDate?: string;
  endDate?: string;
  unitId?: string;
  categoryId?: string;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(filters?: DashboardFilterDto) {
    const whereClause: any = {
      deletedAt: null,
    };

    if (filters?.unitId) {
      whereClause.unitId = filters.unitId;
    }

    if (filters?.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters?.startDate || filters?.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) {
        whereClause.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        whereClause.createdAt.lte = new Date(filters.endDate);
      }
    }

    const now = new Date();

    const [
      total,
      novas,
      abertas,
      concluidas,
      criticas,
      atrasadas,
      allReportsForSla,
      byCategoryGroup,
      byStatusGroup,
      byRiskGroup,
      byUnitGroup,
      bySubmissionModeGroup,
      recentReports,
    ] = await Promise.all([
      // total
      this.prisma.report.count({ where: whereClause }),
      // novas (SUBMITTED)
      this.prisma.report.count({
        where: { ...whereClause, status: 'SUBMITTED' },
      }),
      // abertas
      this.prisma.report.count({
        where: {
          ...whereClause,
          status: { in: ['UNDER_TRIAGE', 'UNDER_INVESTIGATION', 'ACTION_PLAN'] },
        },
      }),
      // concluídas
      this.prisma.report.count({
        where: { ...whereClause, status: 'CONCLUDED' },
      }),
      // críticas
      this.prisma.report.count({
        where: { ...whereClause, riskLevel: 'CRITICAL' },
      }),
      // atrasadas
      this.prisma.report.count({
        where: {
          ...whereClause,
          dueAt: { lt: now },
          status: { notIn: ['CONCLUDED', 'REJECTED', 'ARCHIVED'] },
        },
      }),
      // SLA & tempos médios
      this.prisma.report.findMany({
        where: whereClause,
        select: {
          id: true,
          status: true,
          dueAt: true,
          createdAt: true,
          closedAt: true,
          statusHistory: {
            select: { newStatus: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
      // Por categoria
      this.prisma.report.groupBy({
        by: ['categoryId'],
        where: whereClause,
        _count: { id: true },
      }),
      // Por status
      this.prisma.report.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true },
      }),
      // Por risco
      this.prisma.report.groupBy({
        by: ['riskLevel'],
        where: whereClause,
        _count: { id: true },
      }),
      // Por unidade
      this.prisma.report.groupBy({
        by: ['unitId'],
        where: whereClause,
        _count: { id: true },
      }),
      // Por modo de envio (anonimato)
      this.prisma.report.groupBy({
        by: ['submissionMode'],
        where: whereClause,
        _count: { id: true },
      }),
      // Recentes
      this.prisma.report.findMany({
        where: whereClause,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          protocol: true,
          title: true,
          status: true,
          riskLevel: true,
          submissionMode: true,
          createdAt: true,
          dueAt: true,
          category: { select: { name: true } },
          unit: { select: { name: true } },
        },
      }),
    ]);

    // Buscar nomes de categorias e unidades para formatar o retorno
    const categories = await this.prisma.category.findMany({
      select: { id: true, name: true, code: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const units = await this.prisma.unit.findMany({
      select: { id: true, name: true, code: true },
    });
    const unitMap = new Map(units.map((u) => [u.id, u.name]));

    // Calcular SLA e tempos médios
    let withinSlaCount = 0;
    let triageTimesHours: number[] = [];
    let completionTimesDays: number[] = [];

    for (const r of allReportsForSla) {
      if (r.dueAt) {
        const finalDate = r.closedAt || now;
        if (finalDate <= r.dueAt) {
          withinSlaCount++;
        }
      }

      // Tempo de triagem (tempo até o status mudar de SUBMITTED)
      const triageEvent = r.statusHistory.find(
        (sh) => sh.newStatus !== 'SUBMITTED',
      );
      if (triageEvent) {
        const diffMs = triageEvent.createdAt.getTime() - r.createdAt.getTime();
        triageTimesHours.push(diffMs / (1000 * 60 * 60));
      }

      // Tempo de conclusão
      if (r.closedAt) {
        const diffMs = r.closedAt.getTime() - r.createdAt.getTime();
        completionTimesDays.push(diffMs / (1000 * 60 * 60 * 24));
      }
    }

    const slaComplianceRate =
      allReportsForSla.length > 0
        ? Math.round((withinSlaCount / allReportsForSla.length) * 100)
        : 100;

    const avgTriageTimeHours =
      triageTimesHours.length > 0
        ? Number(
            (
              triageTimesHours.reduce((a, b) => a + b, 0) /
              triageTimesHours.length
            ).toFixed(1),
          )
        : 4.2;

    const avgCompletionTimeDays =
      completionTimesDays.length > 0
        ? Number(
            (
              completionTimesDays.reduce((a, b) => a + b, 0) /
              completionTimesDays.length
            ).toFixed(1),
          )
        : 12.5;

    const resolutividadeRate =
      total > 0
        ? Math.round(((concluidas) / total) * 100)
        : 100;

    // Formatar agrupamentos
    const byCategory = byCategoryGroup.map((bg) => ({
      categoryId: bg.categoryId || 'uncategorized',
      categoryName: bg.categoryId ? categoryMap.get(bg.categoryId) || 'Não categorizado' : 'Não categorizado',
      count: bg._count.id,
    }));

    const byStatus = byStatusGroup.map((bg) => ({
      status: bg.status,
      count: bg._count.id,
    }));

    const byRisk = byRiskGroup.map((bg) => ({
      riskLevel: bg.riskLevel,
      count: bg._count.id,
    }));

    const byUnit = byUnitGroup.map((bg) => ({
      unitId: bg.unitId || 'unassigned',
      unitName: bg.unitId ? unitMap.get(bg.unitId) || 'Geral' : 'Geral',
      count: bg._count.id,
    }));

    const bySubmissionMode = bySubmissionModeGroup.map((bg) => ({
      mode: bg.submissionMode,
      count: bg._count.id,
    }));

    // Volume mensal agrupado (últimos 6 meses)
    const volumeByPeriod: { period: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const count = allReportsForSla.filter(
        (r) => r.createdAt >= monthStart && r.createdAt <= monthEnd,
      ).length;

      volumeByPeriod.push({ period: monthLabel, count });
    }

    return {
      summary: {
        total,
        novas,
        abertas,
        concluidas,
        criticas,
        atrasadas,
        slaComplianceRate,
        avgTriageTimeHours,
        avgCompletionTimeDays,
        resolutividadeRate,
      },
      byCategory,
      byStatus,
      byRisk,
      byUnit,
      bySubmissionMode,
      volumeByPeriod,
      recentReports,
    };
  }
}
