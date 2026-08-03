import { http, HttpResponse, delay } from 'msw';
import {
  mockReports,
  mockCategories,
  mockUnits,
  mockUsers,
  mockRoles,
  mockAuditLogs,
  mockDashboardMetrics,
  mockDepartments,
  mockSettings,
} from './data';
import {
  Report,
  ReportStatusEnum,
  RiskLevelEnum,
  PriorityLevelEnum,
  RegistrationTypeEnum,
} from '../types';

// Estado em memória local mutável durante a sessão
let reportsStore: Report[] = [...mockReports];
let categoriesStore = [...mockCategories];
let unitsStore = [...mockUnits];
let departmentsStore = [...mockDepartments];
let usersStore = [...mockUsers];
let rolesStore = [...mockRoles];
let auditLogsStore = [...mockAuditLogs];
let settingsStore = { ...mockSettings };

function checkSimulatedError(url: URL) {
  const errCode = url.searchParams.get('simulatedError');
  if (errCode) {
    const code = Number(errCode);
    if (code === 400) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Requisição inválida ou parâmetros incorretos.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    if (code === 401) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Sessão expirada ou token de acesso inválido.',
            statusCode: 401,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    if (code === 403) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Você não possui permissão para acessar este recurso.',
            statusCode: 403,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }
    if (code === 404) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'O recurso solicitado não foi encontrado.',
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    if (code === 409) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Houve um conflito de dados com o estado atual.',
            statusCode: 409,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }
    if (code === 429) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Limite de requisições excedido. Tente novamente em instantes.',
            statusCode: 429,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 429 }
      );
    }
    if (code === 500) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro interno inesperado no servidor do Grupo Bairral.',
            statusCode: 500,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  }
  return null;
}

export const handlers = [
  // Health check
  http.get('/api/health', async () => {
    await delay(50);
    return HttpResponse.json({ status: 'ok', service: 'Grupo Bairral Mock API v1' });
  }),

  // Auth Endpoints (Simulados via MSW - Autorização oficial será no Backend NestJS)
  http.post('/api/auth/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() || '';

    if (!email) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Informe o e-mail corporativo.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Mapa de Usuários por Perfil Simulados
    let role = 'ETHICS_MANAGER';
    let name = 'Dr. Carlos Silva';
    let roleName = 'Gestor de Ética';
    let mustChangePassword = false;

    if (email.includes('superadmin') || email.includes('helena')) {
      role = 'SUPER_ADMIN';
      name = 'Dra. Helena Souza';
      roleName = 'Superadministradora';
    } else if (email.includes('triagem') || email.includes('mariana')) {
      role = 'TRIAGE_ANALYST';
      name = 'Mariana Costa';
      roleName = 'Analista de Triagem';
    } else if (email.includes('investigador') || email.includes('roberto')) {
      role = 'INVESTIGATOR';
      name = 'Roberto Mendes';
      roleName = 'Investigador de Ética';
    } else if (email.includes('responsavel') || email.includes('fernanda')) {
      role = 'AREA_RESPONSIBLE';
      name = 'Fernanda Lima';
      roleName = 'Responsável de Área (Enfermagem)';
    } else if (email.includes('auditor') || email.includes('paulo')) {
      role = 'AUDITOR';
      name = 'Paulo Ribeiro';
      roleName = 'Auditor de Integridade';
    } else if (email.includes('executivo') || email.includes('beatriz')) {
      role = 'EXECUTIVE_VIEWER';
      name = 'Beatriz Rocha';
      roleName = 'Visualizadora Executiva';
    } else if (email.includes('novo') || email.includes('primeiro')) {
      role = 'TRIAGE_ANALYST';
      name = 'Lucas Andrade';
      roleName = 'Analista de Triagem';
      mustChangePassword = true;
    }

    const permissions = {
      SUPER_ADMIN: [
        'VIEW_CASES', 'VIEW_IDENTITY', 'CHANGE_CLASSIFICATION', 'ASSIGN_CASES', 'CHANGE_STATUS',
        'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS', 'CREATE_ACTION_PLAN',
        'CONCLUDE_CASE', 'REOPEN_CASE', 'EXPORT_DATA', 'ACCESS_AUDIT', 'MANAGE_USERS', 'MANAGE_SETTINGS'
      ],
      ETHICS_MANAGER: [
        'VIEW_CASES', 'VIEW_IDENTITY', 'CHANGE_CLASSIFICATION', 'ASSIGN_CASES', 'CHANGE_STATUS',
        'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS', 'CREATE_ACTION_PLAN',
        'CONCLUDE_CASE', 'REOPEN_CASE', 'EXPORT_DATA', 'ACCESS_AUDIT', 'MANAGE_USERS', 'MANAGE_SETTINGS'
      ],
      TRIAGE_ANALYST: [
        'VIEW_CASES', 'CHANGE_CLASSIFICATION', 'ASSIGN_CASES', 'CHANGE_STATUS',
        'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS'
      ],
      INVESTIGATOR: [
        'VIEW_CASES', 'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS',
        'CREATE_ACTION_PLAN', 'CHANGE_STATUS'
      ],
      AREA_RESPONSIBLE: [
        'VIEW_CASES', 'ACCESS_ATTACHMENTS', 'ADD_INTERNAL_COMMENTS', 'CREATE_ACTION_PLAN'
      ],
      AUDITOR: [
        'VIEW_CASES', 'VIEW_IDENTITY', 'ACCESS_ATTACHMENTS', 'EXPORT_DATA', 'ACCESS_AUDIT'
      ],
      EXECUTIVE_VIEWER: [
        'VIEW_CASES', 'EXPORT_DATA'
      ]
    }[role] || [];

    const user = {
      id: `usr-${role.toLowerCase()}`,
      name,
      email,
      role,
      roleName,
      unitId: 'unit-1',
      unitName: 'Sede Administrativa & Operacional - Grupo Bairral (Barcarena/PA)',
      departmentId: 'dept-1',
      departmentName: 'Comitê de Integridade',
      permissions,
      mustChangePassword,
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      success: true,
      data: {
        token: `mock-jwt-bairral-${role.toLowerCase()}-${Date.now()}`,
        user,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/auth/me', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: {
        id: 'usr-ethics_manager',
        name: 'Dr. Carlos Silva',
        email: 'gestor.etica@grupobairral.com.br',
        role: 'ETHICS_MANAGER',
        roleName: 'Gestor de Ética',
        permissions: [
          'VIEW_CASES', 'VIEW_IDENTITY', 'CHANGE_CLASSIFICATION', 'ASSIGN_CASES', 'CHANGE_STATUS',
          'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS', 'CREATE_ACTION_PLAN',
          'CONCLUDE_CASE', 'REOPEN_CASE', 'EXPORT_DATA', 'ACCESS_AUDIT', 'MANAGE_USERS', 'MANAGE_SETTINGS'
        ],
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: { message: 'Sessão encerrada com sucesso.' },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email?: string };
    if (!body.email?.includes('@')) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'E-mail corporativo inválido.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        message: 'Se o e-mail estiver cadastrado em nossa base corporativa, um link de redefinição de senha será enviado.',
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/reset-password', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { token?: string; newPassword?: string };
    if (!body.newPassword || body.newPassword.length < 8) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'A nova senha deve ter no mínimo 8 caracteres.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        message: 'Senha redefinida com sucesso! Você já pode fazer login com as novas credenciais.',
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/first-access', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email?: string; newPassword?: string };
    if (!body.newPassword || body.newPassword.length < 8) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'A nova senha deve ter no mínimo 8 caracteres, maiúsculas, minúsculas e números.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        token: `mock-jwt-first-access-${Date.now()}`,
        user: {
          id: 'usr-first-access',
          name: 'Lucas Andrade',
          email: body.email || 'novo.usuario@grupobairral.com.br',
          role: 'TRIAGE_ANALYST',
          roleName: 'Analista de Triagem',
          permissions: [
            'VIEW_CASES', 'CHANGE_CLASSIFICATION', 'ASSIGN_CASES', 'CHANGE_STATUS',
            'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS'
          ],
          mustChangePassword: false,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/change-password', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    if (!body.newPassword || body.newPassword.length < 8) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'A nova senha deve ter no mínimo 8 caracteres.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { message: 'Senha alterada com sucesso.' },
      timestamp: new Date().toISOString(),
    });
  }),

  // Dashboard Metrics
  http.get('/api/dashboard/metrics', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const err = checkSimulatedError(url);
    if (err) return err;

    const unitId = url.searchParams.get('unitId');
    const categoryId = url.searchParams.get('categoryId');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const riskLevel = url.searchParams.get('riskLevel');

    let filtered = [...reportsStore];

    if (unitId) {
      filtered = filtered.filter((r) => r.unitId === unitId);
    }
    if (categoryId) {
      filtered = filtered.filter((r) => r.categoryId === categoryId);
    }
    if (type) {
      filtered = filtered.filter((r) => r.type === type);
    }
    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (riskLevel) {
      filtered = filtered.filter((r) => r.riskLevel === riskLevel);
    }

    const totalReports = filtered.length;
    const openReports = filtered.filter(
      (r) =>
        r.status !== ReportStatusEnum.RESOLVED &&
        r.status !== ReportStatusEnum.COMPLETED &&
        r.status !== ReportStatusEnum.ARCHIVED
    ).length;
    const completedReports = filtered.filter(
      (r) => r.status === ReportStatusEnum.RESOLVED || r.status === ReportStatusEnum.COMPLETED
    ).length;
    const criticalReports = filtered.filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL).length;
    const delayedReports = filtered.filter(
      (r) =>
        new Date(r.slaDueDate) < new Date() &&
        r.status !== ReportStatusEnum.RESOLVED &&
        r.status !== ReportStatusEnum.COMPLETED
    ).length;
    const assignedToMe = filtered.filter((r) => r.assignments.some((a) => a.assigneeId === 'user-1')).length;

    const reportsByStatus: Record<string, number> = {};
    Object.values(ReportStatusEnum).forEach((st) => {
      reportsByStatus[st] = filtered.filter((r) => r.status === st).length;
    });

    const reportsByRisk: Record<string, number> = {};
    Object.values(RiskLevelEnum).forEach((rk) => {
      reportsByRisk[rk] = filtered.filter((r) => r.riskLevel === rk).length;
    });

    const reportsByCategory = categoriesStore.map((c) => ({
      categoryId: c.id,
      categoryName: c.name,
      count: filtered.filter((r) => r.categoryId === c.id).length,
    }));

    const reportsByUnit = unitsStore.map((u) => ({
      unitId: u.id,
      unitName: u.name,
      count: filtered.filter((r) => r.unitId === u.id).length,
    }));

    const anonymousCount = filtered.filter((r) => r.registrationType === RegistrationTypeEnum.ANONYMOUS).length;
    const identifiedCount = filtered.filter((r) => r.registrationType === RegistrationTypeEnum.IDENTIFIED).length;

    const recentCriticalReports = filtered
      .filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL)
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        protocol: r.protocol,
        title: r.title,
        unitName: r.unitName,
        categoryName: r.categoryName,
        createdAt: r.createdAt,
        status: r.status,
        riskLevel: r.riskLevel,
      }));

    const nearDeadlineReports = filtered
      .filter(
        (r) =>
          r.status !== ReportStatusEnum.RESOLVED &&
          r.status !== ReportStatusEnum.COMPLETED &&
          r.status !== ReportStatusEnum.ARCHIVED
      )
      .slice(0, 5)
      .map((r) => {
        const now = new Date();
        const due = new Date(r.slaDueDate);
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return {
          id: r.id,
          protocol: r.protocol,
          title: r.title,
          slaDueDate: r.slaDueDate,
          unitName: r.unitName,
          categoryName: r.categoryName,
          status: r.status,
          daysRemaining: diffDays,
        };
      });

    return HttpResponse.json({
      success: true,
      data: {
        ...mockDashboardMetrics,
        totalReports,
        newInPeriod: Math.min(14, totalReports),
        openReports,
        completedReports,
        criticalReports,
        delayedReports,
        assignedToMe,
        reportsByStatus,
        reportsByRisk,
        reportsByCategory,
        reportsByUnit,
        registrationTypeDistribution: {
          anonymous: anonymousCount,
          identified: identifiedCount,
        },
        recentCriticalReports,
        nearDeadlineReports,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  // Reports Endpoints
  http.get('/api/reports', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const err = checkSimulatedError(url);
    if (err) return err;

    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.getAll('status');
    const riskLevel = url.searchParams.getAll('riskLevel');
    const priorityLevel = url.searchParams.getAll('priorityLevel');
    const categoryId = url.searchParams.get('categoryId');
    const unitId = url.searchParams.get('unitId');
    const assignedToMe = url.searchParams.get('assignedToMe') === 'true';
    const delayedOnly = url.searchParams.get('delayedOnly') === 'true';
    const criticalOnly = url.searchParams.get('criticalOnly') === 'true';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let filtered = [...reportsStore];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.protocol.toLowerCase().includes(search) ||
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          r.categoryName.toLowerCase().includes(search) ||
          r.unitName.toLowerCase().includes(search)
      );
    }

    if (status.length > 0) {
      filtered = filtered.filter((r) => status.includes(r.status));
    }

    if (riskLevel.length > 0) {
      filtered = filtered.filter((r) => riskLevel.includes(r.riskLevel));
    }

    if (priorityLevel.length > 0) {
      filtered = filtered.filter((r) => priorityLevel.includes(r.priorityLevel));
    }

    if (categoryId) {
      filtered = filtered.filter((r) => r.categoryId === categoryId);
    }

    if (unitId) {
      filtered = filtered.filter((r) => r.unitId === unitId);
    }

    if (assignedToMe) {
      filtered = filtered.filter((r) => r.assignments.some((a) => a.assigneeId === 'user-1'));
    }

    if (delayedOnly) {
      filtered = filtered.filter(
        (r) =>
          new Date(r.slaDueDate) < new Date() &&
          r.status !== ReportStatusEnum.RESOLVED &&
          r.status !== ReportStatusEnum.COMPLETED
      );
    }

    if (criticalOnly) {
      filtered = filtered.filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let valA: any = (a as any)[sortBy] || '';
      let valB: any = (b as any)[sortBy] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        data: paginatedData,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/reports/:id', async ({ params, request }) => {
    await delay(150);
    const url = new URL(request.url);
    const err = checkSimulatedError(url);
    if (err) return err;

    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);
    if (!report) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Manifestação com ID ou protocolo "${params.id}" não foi encontrada.`,
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch('/api/reports/:id', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as Partial<Report> & { reason?: string };
    const reportIndex = reportsStore.findIndex((r) => r.id === params.id || r.protocol === params.id);

    if (reportIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Manifestação não encontrada para atualização.',
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const currentReport = reportsStore[reportIndex];
    const updatedReport: Report = {
      ...currentReport,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    let auditAction = 'ATUALIZACAO_MANIFESTACAO';
    let auditDetails = `Atualização de atributos no protocolo ${currentReport.protocol}.`;

    if (body.status && body.status !== currentReport.status) {
      auditAction = 'ALTERACAO_STATUS';
      auditDetails = `Status do protocolo ${currentReport.protocol} alterado de ${currentReport.status} para ${body.status}. ${body.reason ? `Justificativa: ${body.reason}` : ''}`;

      updatedReport.statusHistory = [
        ...currentReport.statusHistory,
        {
          id: `sth-${Date.now()}`,
          reportId: currentReport.id,
          previousStatus: currentReport.status,
          newStatus: body.status,
          changedById: usersStore[0].id,
          changedByName: usersStore[0].name,
          reason: body.reason || 'Status alterado pelo comitê',
          changedAt: new Date().toISOString(),
        },
      ];
    } else if (body.categoryId && body.categoryId !== currentReport.categoryId) {
      auditAction = 'CLASSIFICACAO_ALTERADA';
      auditDetails = `Reclassificação de categoria do protocolo ${currentReport.protocol} para ${body.categoryName || 'Nova Categoria'}.`;
    } else if (body.unitId && body.unitId !== currentReport.unitId) {
      auditAction = 'TRANSFERENCIA_UNIDADE';
      auditDetails = `Protocolo ${currentReport.protocol} transferido para a unidade ${body.unitName || 'Nova Unidade'}. ${body.reason ? `Justificativa: ${body.reason}` : ''}`;
    } else if (body.riskLevel && body.riskLevel !== currentReport.riskLevel) {
      auditAction = 'RISCO_ALTERADO';
      auditDetails = `Nível de risco do protocolo ${currentReport.protocol} alterado de ${currentReport.riskLevel} para ${body.riskLevel}.`;
    } else if (body.priorityLevel && body.priorityLevel !== currentReport.priorityLevel) {
      auditAction = 'PRIORIDADE_ALTERADA';
      auditDetails = `Prioridade do protocolo ${currentReport.protocol} alterada de ${currentReport.priorityLevel} para ${body.priorityLevel}.`;
    } else if (body.isRestricted !== undefined && body.isRestricted !== currentReport.isRestricted) {
      auditAction = 'SIGILO_ALTERADO';
      auditDetails = body.isRestricted
        ? `Acesso ao protocolo ${currentReport.protocol} RESTRITO pelo comitê de ética.`
        : `Restrição de acesso ao protocolo ${currentReport.protocol} removida.`;
    }

    if (body.assignments && body.assignments.length > currentReport.assignments.length) {
      const newAssign = body.assignments[body.assignments.length - 1];
      auditAction = 'ATRIBUICAO_CASO';
      auditDetails = `Protocolo ${currentReport.protocol} atribuído a ${newAssign.assigneeName}.`;
    }

    reportsStore[reportIndex] = updatedReport;

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: auditAction,
      resource: 'Report',
      resourceId: currentReport.id,
      details: auditDetails,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    });

    return HttpResponse.json({
      success: true,
      data: updatedReport,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/reports/:id/messages', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as { content: string; senderType?: 'COMMITTEE' | 'REPORTER' };
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);

    if (!report) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Manifestação não encontrada.', statusCode: 404 },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      reportId: report.id,
      senderType: body.senderType || 'COMMITTEE',
      senderName: body.senderType === 'REPORTER' ? 'Manifestante' : 'Ouvidoria / Comitê de Ética',
      content: body.content,
      attachments: [],
      createdAt: new Date().toISOString(),
    };

    report.publicMessages.push(newMessage);
    report.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'MENSAGEM_PUBLICA_ENVIADA',
      resource: 'Report',
      resourceId: report.id,
      details: `Nova mensagem pública enviada ao manifestante no protocolo ${report.protocol}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({
      success: true,
      data: newMessage,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/reports/:id/comments', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as { content: string };
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);

    if (!report) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Manifestação não encontrada.', statusCode: 404 },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const newComment = {
      id: `cmt-${Date.now()}`,
      reportId: report.id,
      authorId: usersStore[0].id,
      authorName: usersStore[0].name,
      authorRole: usersStore[0].roleName,
      content: body.content,
      attachments: [],
      isPrivate: true,
      createdAt: new Date().toISOString(),
    };

    report.internalComments.push(newComment);
    report.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'COMENTARIO_INTERNO_ADICIONADO',
      resource: 'Report',
      resourceId: report.id,
      details: `Comentário interno confidencial adicionado no protocolo ${report.protocol}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({
      success: true,
      data: newComment,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/reports/:id/action-plans', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);

    if (!report) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Manifestação não encontrada.', statusCode: 404 }, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    const newPlan = {
      id: `acp-${Date.now()}`,
      reportId: report.id,
      title: body.title,
      description: body.description,
      responsibleId: body.responsibleId || usersStore[0].id,
      responsibleName: body.responsibleName || usersStore[0].name,
      dueDate: body.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: body.status || 'NOT_STARTED',
      progressPercentage: body.progressPercentage || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!report.actionPlans) report.actionPlans = [];
    report.actionPlans.push(newPlan);
    report.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'PLANO_ACAO_CRIADO',
      resource: 'ActionPlan',
      resourceId: report.id,
      details: `Plano de ação "${body.title}" criado para o protocolo ${report.protocol}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newPlan, timestamp: new Date().toISOString() });
  }),

  http.post('/api/reports/:id/evidences', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);

    if (!report) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Manifestação não encontrada.', statusCode: 404 }, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    const newEvidence = {
      id: `att-${Date.now()}`,
      fileName: body.fileName || 'documento_anexo.pdf',
      fileSize: body.fileSize || 1048576,
      mimeType: body.mimeType || 'application/pdf',
      url: body.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: usersStore[0].name,
    };

    if (!report.attachments) report.attachments = [];
    report.attachments.push(newEvidence);
    report.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'EVIDENCIA_ANEXADA',
      resource: 'Report',
      resourceId: report.id,
      details: `Nova evidência "${newEvidence.fileName}" anexada ao protocolo ${report.protocol}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newEvidence, timestamp: new Date().toISOString() });
  }),

  http.post('/api/reports/:id/related-people', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);

    if (!report) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Manifestação não encontrada.', statusCode: 404 }, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    const newPerson = {
      id: `person-${Date.now()}`,
      name: body.name,
      role: body.role,
      department: body.department,
      involvementType: body.involvementType || 'INVOLVED',
      status: body.status || 'PENDING_INTERVIEW',
      notes: body.notes,
    };

    if (!report.relatedPeople) report.relatedPeople = [];
    report.relatedPeople.push(newPerson);
    report.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'PESSOA_RELACIONADA_ADICIONADA',
      resource: 'Report',
      resourceId: report.id,
      details: `Pessoa citada "${body.name}" vinculada ao protocolo ${report.protocol}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newPerson, timestamp: new Date().toISOString() });
  }),

  http.post('/api/reports/:id/conflict-of-interest', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as { reason: string };
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);

    if (!report) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Manifestação não encontrada.', statusCode: 404 }, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    report.conflictDeclared = true;
    report.conflictNote = body.reason;
    report.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'DECLARACAO_CONFLITO_INTERESSE',
      resource: 'Report',
      resourceId: report.id,
      details: `Declaração de conflito de interesse / suspeição registrada pelo analista ${usersStore[0].name}. Motivo: ${body.reason}`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({
      success: true,
      data: { success: true, message: 'Conflito de interesse registrado com sucesso. O caso foi sinalizado para redistribuição pelo gestor.' },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/reports/:id/audit-logs', async ({ params }) => {
    await delay(150);
    const report = reportsStore.find((r) => r.id === params.id || r.protocol === params.id);
    const reportId = report ? report.id : params.id;
    const protocol = report ? report.protocol : '';

    const logs = auditLogsStore.filter(
      (l) => l.resourceId === reportId || (protocol && l.details.includes(protocol))
    );

    return HttpResponse.json({
      success: true,
      data: logs,
      timestamp: new Date().toISOString(),
    });
  }),

  // Categories Endpoints
  http.get('/api/categories', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: categoriesStore,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/categories', async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as Omit<typeof categoriesStore[0], 'id' | 'createdAt' | 'updatedAt' | 'reportCount'>;
    const newCat = {
      ...body,
      id: `cat-${Date.now()}`,
      active: body.active !== undefined ? body.active : true,
      reportCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    categoriesStore.push(newCat);

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'CATEGORIA_CRIADA',
      resource: 'Category',
      resourceId: newCat.id,
      details: `Nova categoria "${newCat.name}" (SLA: ${newCat.slaDays}d) cadastrada.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newCat, timestamp: new Date().toISOString() });
  }),

  http.put('/api/categories/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as Partial<typeof categoriesStore[0]>;
    const idx = categoriesStore.findIndex((c) => c.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Categoria não encontrada', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }
    categoriesStore[idx] = { ...categoriesStore[idx], ...body, updatedAt: new Date().toISOString() };

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'CATEGORIA_ATUALIZADA',
      resource: 'Category',
      resourceId: categoriesStore[idx].id,
      details: `Categoria "${categoriesStore[idx].name}" atualizada.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: categoriesStore[idx], timestamp: new Date().toISOString() });
  }),

  http.patch('/api/categories/:id/active', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as { active: boolean };
    const idx = categoriesStore.findIndex((c) => c.id === params.id);
    if (idx !== -1) {
      categoriesStore[idx].active = body.active;
      categoriesStore[idx].updatedAt = new Date().toISOString();
    }
    return HttpResponse.json({ success: true, data: categoriesStore[idx], timestamp: new Date().toISOString() });
  }),

  http.delete('/api/categories/:id', async ({ params }) => {
    await delay(150);
    categoriesStore = categoriesStore.filter((c) => c.id !== params.id);
    return HttpResponse.json({ success: true, data: { id: params.id }, timestamp: new Date().toISOString() });
  }),

  // Units Endpoints
  http.get('/api/units', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: unitsStore,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/units', async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as Omit<typeof unitsStore[0], 'id' | 'createdAt' | 'updatedAt'>;
    const newUnit = {
      ...body,
      id: `unit-${Date.now()}`,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    unitsStore.push(newUnit);

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'UNIDADE_CRIADA',
      resource: 'Unit',
      resourceId: newUnit.id,
      details: `Nova unidade "${newUnit.name}" cadastrada no sistema.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newUnit, timestamp: new Date().toISOString() });
  }),

  http.put('/api/units/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as Partial<typeof unitsStore[0]>;
    const idx = unitsStore.findIndex((u) => u.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Unidade não encontrada', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }
    unitsStore[idx] = { ...unitsStore[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: unitsStore[idx], timestamp: new Date().toISOString() });
  }),

  http.delete('/api/units/:id', async ({ params }) => {
    await delay(150);
    unitsStore = unitsStore.filter((u) => u.id !== params.id);
    return HttpResponse.json({ success: true, data: { id: params.id }, timestamp: new Date().toISOString() });
  }),

  // Departments Endpoints
  http.get('/api/departments', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const unitId = url.searchParams.get('unitId');
    let res = [...departmentsStore];
    if (unitId) {
      res = res.filter((d) => d.unitId === unitId);
    }
    return HttpResponse.json({
      success: true,
      data: res,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/departments', async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as Omit<typeof departmentsStore[0], 'id' | 'createdAt' | 'updatedAt'>;
    const newDept = {
      ...body,
      id: `dept-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    departmentsStore.push(newDept);

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'DEPARTAMENTO_CRIADO',
      resource: 'Department',
      resourceId: newDept.id,
      details: `Novo departamento "${newDept.name}" cadastrado.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newDept, timestamp: new Date().toISOString() });
  }),

  http.put('/api/departments/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as Partial<typeof departmentsStore[0]>;
    const idx = departmentsStore.findIndex((d) => d.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Departamento não encontrado', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }
    departmentsStore[idx] = { ...departmentsStore[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: departmentsStore[idx], timestamp: new Date().toISOString() });
  }),

  http.delete('/api/departments/:id', async ({ params }) => {
    await delay(150);
    departmentsStore = departmentsStore.filter((d) => d.id !== params.id);
    return HttpResponse.json({ success: true, data: { id: params.id }, timestamp: new Date().toISOString() });
  }),

  // Users Endpoints
  http.get('/api/users', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    let res = [...usersStore];
    if (search) {
      res = res.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    }
    return HttpResponse.json({
      success: true,
      data: res,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const roleObj = rolesStore.find((r) => r.id === body.roleId) || rolesStore[0];
    const unitObj = unitsStore.find((u) => u.id === body.unitId);
    const deptObj = departmentsStore.find((d) => d.id === body.departmentId);

    const newUser = {
      id: `user-${Date.now()}`,
      name: body.name,
      email: body.email,
      roleId: roleObj.id,
      roleName: roleObj.name,
      unitId: unitObj?.id,
      unitName: unitObj?.name,
      departmentId: deptObj?.id,
      departmentName: deptObj?.name,
      status: body.status || 'ACTIVE',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.push(newUser as any);

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'USUARIO_CRIADO',
      resource: 'User',
      resourceId: newUser.id,
      details: `Novo usuário "${newUser.name}" (${newUser.email}) cadastrado com perfil ${newUser.roleName}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newUser, timestamp: new Date().toISOString() });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const idx = usersStore.findIndex((u) => u.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Usuário não encontrado', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }

    let roleName = usersStore[idx].roleName;
    if (body.roleId) {
      const r = rolesStore.find((x) => x.id === body.roleId);
      if (r) roleName = r.name;
    }

    usersStore[idx] = {
      ...usersStore[idx],
      ...body,
      roleName,
      updatedAt: new Date().toISOString(),
    };

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'USUARIO_ATUALIZADO',
      resource: 'User',
      resourceId: usersStore[idx].id,
      details: `Dados do usuário "${usersStore[idx].name}" atualizados.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: usersStore[idx], timestamp: new Date().toISOString() });
  }),

  http.patch('/api/users/:id/status', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as { status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' };
    const idx = usersStore.findIndex((u) => u.id === params.id);
    if (idx !== -1) {
      usersStore[idx].status = body.status;
      usersStore[idx].updatedAt = new Date().toISOString();

      auditLogsStore.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: usersStore[0].id,
        userName: usersStore[0].name,
        userRole: usersStore[0].roleName,
        action: 'STATUS_USUARIO_ALTERADO',
        resource: 'User',
        resourceId: usersStore[idx].id,
        details: `Status do usuário "${usersStore[idx].name}" alterado para ${body.status}.`,
        ipAddress: '192.168.1.100',
      });
    }
    return HttpResponse.json({ success: true, data: usersStore[idx], timestamp: new Date().toISOString() });
  }),

  // Roles Endpoints
  http.get('/api/roles', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: rolesStore,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/roles', async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const newRole = {
      id: `role-${Date.now()}`,
      name: body.name,
      description: body.description,
      permissions: body.permissions || [],
      isSystemRole: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    rolesStore.push(newRole as any);

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'PERFIL_CRIADO',
      resource: 'Role',
      resourceId: newRole.id,
      details: `Novo perfil de acesso "${newRole.name}" criado com ${newRole.permissions.length} permissões.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: newRole, timestamp: new Date().toISOString() });
  }),

  http.put('/api/roles/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const idx = rolesStore.findIndex((r) => r.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Perfil não encontrado', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }
    rolesStore[idx] = {
      ...rolesStore[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'MATRIZ_PERMISSOES_ALTERADA',
      resource: 'Role',
      resourceId: rolesStore[idx].id,
      details: `Permissões do perfil "${rolesStore[idx].name}" alteradas pelo administrador.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: rolesStore[idx], timestamp: new Date().toISOString() });
  }),

  // Action Plans Global Endpoints
  http.get('/api/action-plans', async ({ request }) => {
    await delay(120);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase();

    let allPlans: any[] = [];
    reportsStore.forEach((rep) => {
      (rep.actionPlans || []).forEach((plan) => {
        const now = new Date();
        const due = new Date(plan.dueDate);
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

        allPlans.push({
          ...plan,
          reportId: rep.id,
          reportProtocol: rep.protocol,
          reportTitle: rep.title,
          unitName: rep.unitName,
          categoryName: rep.categoryName,
          daysOverdue: diffDays < 0 && plan.status !== 'COMPLETED' ? Math.abs(diffDays) : 0,
        });
      });
    });

    if (status && status !== 'ALL') {
      if (status === 'OVERDUE') {
        allPlans = allPlans.filter((p) => p.daysOverdue > 0 && p.status !== 'COMPLETED');
      } else {
        allPlans = allPlans.filter((p) => p.status === status);
      }
    }

    if (search) {
      allPlans = allPlans.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.responsibleName.toLowerCase().includes(search) ||
          p.reportProtocol?.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({ success: true, data: allPlans, timestamp: new Date().toISOString() });
  }),

  http.get('/api/action-plans/:id', async ({ params }) => {
    await delay(100);
    let foundPlan: any = null;
    reportsStore.forEach((rep) => {
      const p = (rep.actionPlans || []).find((x) => x.id === params.id);
      if (p) {
        foundPlan = {
          ...p,
          reportId: rep.id,
          reportProtocol: rep.protocol,
          reportTitle: rep.title,
          unitName: rep.unitName,
          categoryName: rep.categoryName,
        };
      }
    });

    if (!foundPlan) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Plano de ação não encontrado', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }

    return HttpResponse.json({ success: true, data: foundPlan, timestamp: new Date().toISOString() });
  }),

  http.post('/api/action-plans', async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const targetReport = reportsStore.find((r) => r.id === body.reportId || r.protocol === body.reportId) || reportsStore[0];

    const newPlan = {
      id: `acp-${Date.now()}`,
      reportId: targetReport.id,
      title: body.title,
      description: body.description,
      responsibleId: body.responsibleId || usersStore[0].id,
      responsibleName: body.responsibleName || usersStore[0].name,
      dueDate: body.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: body.status || 'NOT_STARTED',
      progressPercentage: body.progressPercentage || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!targetReport.actionPlans) targetReport.actionPlans = [];
    targetReport.actionPlans.push(newPlan);
    targetReport.updatedAt = new Date().toISOString();

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'PLANO_ACAO_CRIADO',
      resource: 'ActionPlan',
      resourceId: newPlan.id,
      details: `Plano de ação "${newPlan.title}" associado ao protocolo ${targetReport.protocol}.`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({
      success: true,
      data: { ...newPlan, reportProtocol: targetReport.protocol, reportTitle: targetReport.title },
      timestamp: new Date().toISOString(),
    });
  }),

  http.put('/api/action-plans/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as any;

    let updatedPlan: any = null;
    let parentReport: any = null;

    reportsStore.forEach((rep) => {
      const pIdx = (rep.actionPlans || []).findIndex((x) => x.id === params.id);
      if (pIdx !== -1) {
        parentReport = rep;
        rep.actionPlans[pIdx] = {
          ...rep.actionPlans[pIdx],
          ...body,
          updatedAt: new Date().toISOString(),
        };
        updatedPlan = rep.actionPlans[pIdx];
      }
    });

    if (!updatedPlan) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Plano de ação não encontrado', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'PLANO_ACAO_ATUALIZADO',
      resource: 'ActionPlan',
      resourceId: updatedPlan.id,
      details: `Plano de ação "${updatedPlan.title}" atualizado (Progresso: ${updatedPlan.progressPercentage}%, Status: ${updatedPlan.status}).`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({
      success: true,
      data: { ...updatedPlan, reportProtocol: parentReport?.protocol, reportTitle: parentReport?.title },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/action-plans/:id/validate', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as { status: 'COMPLETED' | 'CANCELLED'; validationNotes: string };

    let validatedPlan: any = null;
    let parentReport: any = null;

    reportsStore.forEach((rep) => {
      const pIdx = (rep.actionPlans || []).findIndex((x) => x.id === params.id);
      if (pIdx !== -1) {
        parentReport = rep;
        rep.actionPlans[pIdx].status = body.status;
        if (body.status === 'COMPLETED') {
          rep.actionPlans[pIdx].progressPercentage = 100;
          rep.actionPlans[pIdx].completedAt = new Date().toISOString();
        }
        (rep.actionPlans[pIdx] as any).validationNotes = body.validationNotes;
        rep.actionPlans[pIdx].updatedAt = new Date().toISOString();
        validatedPlan = rep.actionPlans[pIdx];
      }
    });

    if (!validatedPlan) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Plano de ação não encontrado', statusCode: 404 }, timestamp: new Date().toISOString() }, { status: 404 });
    }

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'VALIDACAO_PLANO_ACAO',
      resource: 'ActionPlan',
      resourceId: validatedPlan.id,
      details: `Plano de ação "${validatedPlan.title}" validado como ${body.status}. Parecer: ${body.validationNotes}`,
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({
      success: true,
      data: { ...validatedPlan, reportProtocol: parentReport?.protocol, reportTitle: parentReport?.title },
      timestamp: new Date().toISOString(),
    });
  }),

  // Settings Endpoints
  http.get('/api/settings', async () => {
    await delay(100);
    return HttpResponse.json({
      success: true,
      data: settingsStore,
      timestamp: new Date().toISOString(),
    });
  }),

  http.put('/api/settings', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    settingsStore = {
      ...settingsStore,
      ...body,
      institutional: { ...settingsStore.institutional, ...(body.institutional || {}) },
      slaDefaults: { ...settingsStore.slaDefaults, ...(body.slaDefaults || {}) },
      policies: { ...settingsStore.policies, ...(body.policies || {}) },
      messageTemplates: { ...settingsStore.messageTemplates, ...(body.messageTemplates || {}) },
      retention: { ...settingsStore.retention, ...(body.retention || {}) },
      alternativeChannels: { ...settingsStore.alternativeChannels, ...(body.alternativeChannels || {}) },
      notifications: { ...settingsStore.notifications, ...(body.notifications || {}) },
    };

    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: usersStore[0].id,
      userName: usersStore[0].name,
      userRole: usersStore[0].roleName,
      action: 'CONFIGURACOES_SISTEMA_ALTERADAS',
      resource: 'Settings',
      details: 'Parâmetros institucionais, prazos de SLA e templates de mensagens atualizados pelo administrador.',
      ipAddress: '192.168.1.100',
    });

    return HttpResponse.json({ success: true, data: settingsStore, timestamp: new Date().toISOString() });
  }),

  // Audit Logs Endpoints (Extended search & filters)
  http.get('/api/audit-logs', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const userId = url.searchParams.get('userId');
    const action = url.searchParams.get('action')?.toLowerCase();
    const resource = url.searchParams.get('resource')?.toLowerCase();
    const protocol = url.searchParams.get('protocol')?.toLowerCase();
    const ipAddress = url.searchParams.get('ipAddress')?.toLowerCase();
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    let logs = [...auditLogsStore];

    if (search) {
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(search) ||
          l.action.toLowerCase().includes(search) ||
          l.details.toLowerCase().includes(search) ||
          (l.resourceId && l.resourceId.toLowerCase().includes(search))
      );
    }

    if (userId) {
      logs = logs.filter((l) => l.userId === userId);
    }

    if (action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(action));
    }

    if (resource) {
      logs = logs.filter((l) => l.resource.toLowerCase().includes(resource));
    }

    if (protocol) {
      logs = logs.filter((l) => l.details.toLowerCase().includes(protocol));
    }

    if (ipAddress) {
      logs = logs.filter((l) => l.ipAddress && l.ipAddress.toLowerCase().includes(ipAddress));
    }

    if (dateFrom) {
      logs = logs.filter((l) => new Date(l.timestamp) >= new Date(dateFrom));
    }

    if (dateTo) {
      logs = logs.filter((l) => new Date(l.timestamp) <= new Date(dateTo));
    }

    const totalItems = logs.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        data: paginated,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
    });
  }),

  // Public Reports endpoints
  http.post('/api/public/reports', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<Report>;

    const count = reportsStore.length + 1;
    const protocol = `GB-2025-${String(count).padStart(3, '0')}`;
    const accessKey = `KEY-${Math.floor(1000 + Math.random() * 9000)}`;

    const cat = categoriesStore.find((c) => c.id === body.categoryId) || categoriesStore[0];
    const unit = unitsStore.find((u) => u.id === body.unitId) || unitsStore[0];

    const newReport: Report = {
      id: `rep-${count}`,
      protocol,
      accessKey,
      title: body.title || 'Manifestação sem título',
      description: body.description || '',
      type: body.type || ('DENUNCIA' as any),
      registrationType: body.registrationType || RegistrationTypeEnum.ANONYMOUS,
      status: ReportStatusEnum.RECEIVED,
      riskLevel: cat.defaultRiskLevel || RiskLevelEnum.MEDIUM,
      priorityLevel: PriorityLevelEnum.NORMAL,
      categoryId: cat.id,
      categoryName: cat.name,
      unitId: unit.id,
      unitName: unit.name,
      reporter: body.reporter || { type: RegistrationTypeEnum.ANONYMOUS },
      attachments: body.attachments || [],
      assignments: [],
      statusHistory: [
        {
          id: `sth-${Date.now()}`,
          reportId: `rep-${count}`,
          newStatus: ReportStatusEnum.RECEIVED,
          changedById: 'system',
          changedByName: 'Canal Público',
          changedAt: new Date().toISOString(),
        },
      ],
      publicMessages: [
        {
          id: `msg-${Date.now()}`,
          reportId: `rep-${count}`,
          senderType: 'SYSTEM',
          senderName: 'Grupo Bairral - Ouvidoria',
          content: `Manifestação registrada com sucesso sob o protocolo ${protocol}. Guarde sua chave de acesso (${accessKey}) para acompanhar o andamento.`,
          attachments: [],
          createdAt: new Date().toISOString(),
        },
      ],
      internalComments: [],
      actionPlans: [],
      relatedPeople: [],
      isRestricted: false,
      conflictDeclared: false,
      slaDueDate: new Date(Date.now() + cat.slaDays * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reportsStore.unshift(newReport);

    // Registra log de auditoria
    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'public-user',
      userName: 'Usuário do Canal Público',
      userRole: 'Cidadão/Manifestante',
      action: 'NOVA_MANIFESTACAO_PUBLICA',
      resource: 'Report',
      resourceId: newReport.id,
      details: `Nova manifestação protocolo ${protocol} registrada via canal público.`,
      ipAddress: '189.40.122.15',
    });

    return HttpResponse.json({
      success: true,
      data: {
        protocol,
        accessKey,
        report: newReport,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/public/reports/track', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as { protocol?: string; accessKey?: string };

    const report = reportsStore.find(
      (r) =>
        r.protocol.trim().toUpperCase() === body.protocol?.trim().toUpperCase() &&
        r.accessKey.trim().toUpperCase() === body.accessKey?.trim().toUpperCase()
    );

    if (!report) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Manifestação não encontrada. Verifique o número de protocolo e a chave de acesso informados.',
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const isClosed = [
      ReportStatusEnum.RESOLVED,
      ReportStatusEnum.COMPLETED,
      ReportStatusEnum.ARCHIVED,
    ].includes(report.status as any);

    // Sanitiza mensagens públicas (remove nomes individuais de analistas)
    const sanitizedMessages = (report.publicMessages || []).map((msg) => ({
      id: msg.id,
      reportId: report.id,
      senderType: msg.senderType,
      senderName:
        msg.senderType === 'COMMITTEE'
          ? 'Ouvidoria / Comitê de Ética'
          : msg.senderType === 'REPORTER'
          ? 'Manifestante'
          : 'Sistema de Ouvidoria',
      content: msg.content,
      isInformationRequest: msg.content.toLowerCase().includes('solicita') || msg.content.toLowerCase().includes('informaç'),
      attachments: msg.attachments || [],
      createdAt: msg.createdAt,
    }));

    // Constrói linha do tempo pública sanitizada
    const timeline: any[] = [
      {
        id: `tl-init-${report.id}`,
        title: 'Manifestação Registrada',
        description: 'Sua manifestação foi recebida com sucesso e armazenada com criptografia de ponta a ponta.',
        status: ReportStatusEnum.RECEIVED,
        date: report.createdAt,
        type: 'SYSTEM',
      },
    ];

    if (report.statusHistory && report.statusHistory.length > 0) {
      report.statusHistory.forEach((sh, idx) => {
        if (sh.newStatus === ReportStatusEnum.RECEIVED && idx === 0) return;

        let statusTitle = 'Atualização de Status';
        let statusDesc = 'O processo de análise avançou no comitê de ética.';

        switch (sh.newStatus) {
          case ReportStatusEnum.TRIAGE:
          case ReportStatusEnum.ANALYSIS:
            statusTitle = 'Em Análise Inicial';
            statusDesc = 'Sua demanda está sob análise prévia pela comissão de integridade.';
            break;
          case ReportStatusEnum.INVESTIGATION:
            statusTitle = 'Em Processo de Apuração';
            statusDesc = 'Iniciados os procedimentos formais de averiguação interna.';
            break;
          case ReportStatusEnum.ACTION_PLAN:
            statusTitle = 'Plano de Ação Corretiva';
            statusDesc = 'Medidas de correção e ajustes operacionais estão sendo executados.';
            break;
          case ReportStatusEnum.RESOLVED:
          case ReportStatusEnum.COMPLETED:
            statusTitle = 'Manifestação Concluída / Resolvida';
            statusDesc = 'A apuração foi finalizada e as providências foram tomadas.';
            break;
          case ReportStatusEnum.ARCHIVED:
            statusTitle = 'Manifestação Arquivada';
            statusDesc = 'O processo foi encerrado ou arquivado.';
            break;
        }

        timeline.push({
          id: sh.id,
          title: statusTitle,
          description: statusDesc,
          status: sh.newStatus,
          date: sh.changedAt,
          type: 'STATUS_CHANGE',
        });
      });
    }

    // Adiciona mensagens relevantes à linha do tempo
    sanitizedMessages.forEach((msg) => {
      timeline.push({
        id: `tl-msg-${msg.id}`,
        title: msg.senderType === 'COMMITTEE' ? 'Mensagem da Ouvidoria' : 'Resposta do Manifestante',
        description: msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content,
        date: msg.createdAt,
        type: msg.senderType === 'REPORTER' ? 'REPORTER_REPLY' : 'MESSAGE',
      });
    });

    // Ordena linha do tempo por data
    timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return HttpResponse.json({
      success: true,
      data: {
        protocol: report.protocol,
        title: report.title,
        type: report.type,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        slaDueDate: report.slaDueDate,
        categoryName: report.categoryName,
        unitName: report.unitName,
        isClosed,
        publicMessages: sanitizedMessages,
        timeline,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/public/reports/reply', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      protocol?: string;
      accessKey?: string;
      message?: string;
      attachments?: any[];
    };

    const report = reportsStore.find(
      (r) =>
        r.protocol.trim().toUpperCase() === body.protocol?.trim().toUpperCase() &&
        r.accessKey.trim().toUpperCase() === body.accessKey?.trim().toUpperCase()
    );

    if (!report) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Manifestação não encontrada ou credenciais inválidas.',
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const isClosed = [
      ReportStatusEnum.RESOLVED,
      ReportStatusEnum.COMPLETED,
      ReportStatusEnum.ARCHIVED,
    ].includes(report.status as any);

    if (isClosed) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'CASE_CLOSED',
            message: 'Esta manifestação já está encerrada e não aceita novos envios.',
            statusCode: 400,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      reportId: report.id,
      senderType: 'REPORTER' as const,
      senderName: 'Manifestante',
      content: body.message || '',
      attachments: body.attachments || [],
      createdAt: new Date().toISOString(),
    };

    report.publicMessages.push(newMsg);
    report.updatedAt = new Date().toISOString();

    // Retorna a representação atualizada da manifestação
    const updatedMessages = report.publicMessages.map((msg) => ({
      id: msg.id,
      reportId: report.id,
      senderType: msg.senderType,
      senderName:
        msg.senderType === 'COMMITTEE'
          ? 'Ouvidoria / Comitê de Ética'
          : msg.senderType === 'REPORTER'
          ? 'Manifestante'
          : 'Sistema de Ouvidoria',
      content: msg.content,
      isInformationRequest: msg.content.toLowerCase().includes('solicita') || msg.content.toLowerCase().includes('informaç'),
      attachments: msg.attachments || [],
      createdAt: msg.createdAt,
    }));

    const timeline: any[] = [
      {
        id: `tl-init-${report.id}`,
        title: 'Manifestação Registrada',
        description: 'Sua manifestação foi recebida com sucesso e armazenada com criptografia de ponta a ponta.',
        status: ReportStatusEnum.RECEIVED,
        date: report.createdAt,
        type: 'SYSTEM',
      },
    ];

    if (report.statusHistory) {
      report.statusHistory.forEach((sh) => {
        timeline.push({
          id: sh.id,
          title: 'Atualização de Status',
          description: 'Avanço no fluxo de apuração.',
          status: sh.newStatus,
          date: sh.changedAt,
          type: 'STATUS_CHANGE',
        });
      });
    }

    updatedMessages.forEach((msg) => {
      timeline.push({
        id: `tl-msg-${msg.id}`,
        title: msg.senderType === 'COMMITTEE' ? 'Mensagem da Ouvidoria' : 'Resposta do Manifestante',
        description: msg.content,
        date: msg.createdAt,
        type: msg.senderType === 'REPORTER' ? 'REPORTER_REPLY' : 'MESSAGE',
      });
    });

    timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return HttpResponse.json({
      success: true,
      data: {
        protocol: report.protocol,
        title: report.title,
        type: report.type,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        slaDueDate: report.slaDueDate,
        categoryName: report.categoryName,
        unitName: report.unitName,
        isClosed: false,
        publicMessages: updatedMessages,
        timeline,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/public/reports/close', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { protocol?: string; accessKey?: string };

    const report = reportsStore.find(
      (r) =>
        r.protocol.trim().toUpperCase() === body.protocol?.trim().toUpperCase() &&
        r.accessKey.trim().toUpperCase() === body.accessKey?.trim().toUpperCase()
    );

    if (!report) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Manifestação não encontrada ou credenciais inválidas.',
            statusCode: 404,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    report.status = ReportStatusEnum.RESOLVED;
    report.updatedAt = new Date().toISOString();

    report.statusHistory.push({
      id: `sth-${Date.now()}`,
      reportId: report.id,
      previousStatus: report.status,
      newStatus: ReportStatusEnum.RESOLVED,
      changedById: 'reporter',
      changedByName: 'Manifestante',
      reason: 'Encerrado e declarado como resolvido pelo próprio manifestante.',
      changedAt: new Date().toISOString(),
    });

    report.publicMessages.push({
      id: `msg-${Date.now()}`,
      reportId: report.id,
      senderType: 'REPORTER',
      senderName: 'Manifestante',
      content: 'Atendimento encerrado e considerado resolvido pelo manifestante.',
      attachments: [],
      createdAt: new Date().toISOString(),
    });

    const updatedMessages = report.publicMessages.map((msg) => ({
      id: msg.id,
      reportId: report.id,
      senderType: msg.senderType,
      senderName:
        msg.senderType === 'COMMITTEE'
          ? 'Ouvidoria / Comitê de Ética'
          : msg.senderType === 'REPORTER'
          ? 'Manifestante'
          : 'Sistema de Ouvidoria',
      content: msg.content,
      isInformationRequest: false,
      attachments: msg.attachments || [],
      createdAt: msg.createdAt,
    }));

    return HttpResponse.json({
      success: true,
      data: {
        protocol: report.protocol,
        title: report.title,
        type: report.type,
        status: ReportStatusEnum.RESOLVED,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        slaDueDate: report.slaDueDate,
        categoryName: report.categoryName,
        unitName: report.unitName,
        isClosed: true,
        publicMessages: updatedMessages,
        timeline: [],
      },
      timestamp: new Date().toISOString(),
    });
  }),
];
