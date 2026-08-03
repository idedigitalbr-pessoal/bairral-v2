import {
  Report,
  Category,
  Unit,
  Department,
  User,
  Role,
  AuditLog,
  DashboardMetrics,
  ReportTypeEnum,
  RegistrationTypeEnum,
  ReportStatusEnum,
  RiskLevelEnum,
  PriorityLevelEnum,
  PermissionEnum,
} from '../types';

import { AdminPermissionEnum } from '../types/auth';

export const mockRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrador do Sistema',
    description: 'Acesso total a todos os recursos do portal de integridade',
    permissions: Object.values(AdminPermissionEnum) as any,
    isSystemRole: true,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'role-compliance',
    name: 'Analista de Compliance',
    description: 'Gestão, apuração e tratativas de manifestações',
    permissions: [
      AdminPermissionEnum.VIEW_CASES,
      AdminPermissionEnum.CHANGE_CLASSIFICATION,
      AdminPermissionEnum.CREATE_ACTION_PLAN,
      AdminPermissionEnum.ACCESS_AUDIT,
    ] as any,
    isSystemRole: true,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'role-ouvidor',
    name: 'Ouvidor Geral',
    description: 'Acompanhamento e mediação de manifestações públicas',
    permissions: [
      AdminPermissionEnum.VIEW_CASES,
      AdminPermissionEnum.SEND_MESSAGES,
      AdminPermissionEnum.CREATE_ACTION_PLAN,
    ] as any,
    isSystemRole: false,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'role-gestor',
    name: 'Gestor de Unidade',
    description: 'Visualização e acompanhamento de planos de ação da sua unidade',
    permissions: [AdminPermissionEnum.VIEW_CASES] as any,
    isSystemRole: false,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Carlos Alberto Silva',
    email: 'carlos.silva@grupobairral.com.br',
    roleId: 'role-admin',
    roleName: 'Administrador do Sistema',
    unitId: 'unit-1',
    departmentId: 'dept-1',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Mariana Ferreira Souza',
    email: 'mariana.souza@grupobairral.com.br',
    roleId: 'role-compliance',
    roleName: 'Analista de Compliance',
    unitId: 'unit-1',
    departmentId: 'dept-2',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2025-01-12T10:30:00Z',
    updatedAt: '2025-01-12T10:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Dr. Roberto Mendes',
    email: 'roberto.mendes@grupobairral.com.br',
    roleId: 'role-ouvidor',
    roleName: 'Ouvidor Geral',
    unitId: 'unit-2',
    departmentId: 'dept-3',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2025-01-15T14:00:00Z',
    updatedAt: '2025-01-15T14:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Ana Paula Rocha',
    email: 'ana.rocha@grupobairral.com.br',
    roleId: 'role-gestor',
    roleName: 'Gestor de Unidade',
    unitId: 'unit-3',
    departmentId: 'dept-4',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2025-01-20T11:15:00Z',
    updatedAt: '2025-01-20T11:15:00Z',
  },
];

export const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    name: 'Sede Administrativa & Operacional - Grupo Bairral (Barcarena/PA)',
    code: 'GB-SEDE',
    address: 'Rua Antônio Manoel Menineia, S/N - Bairro Burajuba - Barcarena/PA - CEP 68447-000',
    managerId: 'user-1',
    managerName: 'Diogo Bairral',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-2',
    name: 'Escritório Central - Vila dos Cabanos (Barcarena/PA)',
    code: 'GB-CABANOS',
    address: 'Rua José Bernardino Gomes, Qd 290, Lt 13, Altos - Vila dos Cabanos - Barcarena/PA',
    managerId: 'user-2',
    managerName: 'Beatriz Bairral',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-3',
    name: 'Base Operacional Bairral Transportes & Cargas (Barcarena/PA)',
    code: 'GB-TRANSP',
    address: 'Distrito Industrial - Barcarena/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-4',
    name: 'Base Operacional Bairral Locações & Equipamentos (Barcarena/PA)',
    code: 'GB-LOC',
    address: 'Distrito Industrial - Barcarena/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-5',
    name: 'Base Operacional Bairral Resíduos & Meio Ambiente (Barcarena/PA)',
    code: 'GB-RESIDUOS',
    address: 'Área Industrial - Barcarena/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-6',
    name: 'Base Operacional Belém (Região Metropolitana/PA)',
    code: 'GB-BELEM',
    address: 'Belém/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-7',
    name: 'Base Operacional Abaetetuba/PA',
    code: 'GB-ABAETETUBA',
    address: 'Abaetetuba/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-8',
    name: 'Base Operacional Mojú/PA',
    code: 'GB-MOJU',
    address: 'Mojú/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-9',
    name: 'Base Operacional Mãe do Rio/PA',
    code: 'GB-MAE-DO-RIO',
    address: 'Mãe do Rio/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-10',
    name: 'Base Operacional Tailândia/PA',
    code: 'GB-TAILANDIA',
    address: 'Tailândia/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'unit-11',
    name: 'Base Operacional Paragominas/PA',
    code: 'GB-PARAGOMINAS',
    address: 'Paragominas/PA',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    unitId: 'unit-3',
    name: 'Operação de Transportes & Frotas (Cargas e Pessoas)',
    code: 'TRANS-FROTA',
    description: 'Gestão de logística de transporte pesado, ônibus e frotas operacionais',
    managerId: 'user-1',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-2',
    unitId: 'unit-4',
    name: 'Locação de Equipamentos & Oficina Mecânica de Manutenção',
    code: 'LOC-MEC',
    description: 'Manutenção preventiva/corretiva e locação de máquinas industriais e veículos',
    managerId: 'user-3',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-3',
    unitId: 'unit-5',
    name: 'Gestão de Resíduos, Meio Ambiente & SMS (HSE)',
    code: 'RES-SMS',
    description: 'Tratamento de resíduos, conformidade ambiental e sustentabilidade',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-4',
    unitId: 'unit-1',
    name: 'Segurança do Trabalho & Saúde Ocupacional (SST)',
    code: 'SST-SEG',
    description: 'Treinamentos, EPIs, prevenção de acidentes e segurança de motoristas e riggers',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-5',
    unitId: 'unit-2',
    name: 'Recursos Humanos & Gestão de Pessoas (RH)',
    code: 'RH-GP',
    description: 'Recrutamento, departamento pessoal, avaliação contínua e bem-estar do colaborador',
    managerId: 'user-4',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-6',
    unitId: 'unit-2',
    name: 'Financeiro, Contabilidade & Controladoria',
    code: 'FIN-CONT',
    description: 'Gestão financeira do grupo, contas a pagar/receber e controladoria',
    managerId: 'user-2',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-7',
    unitId: 'unit-1',
    name: 'Jurídico, Compliance & Ouvidoria (Bairral Advocacia)',
    code: 'JUR-COMP',
    description: 'Programa de ética e integridade, contratos e governança corporativa',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-8',
    unitId: 'unit-1',
    name: 'Tecnologia da Informação (TI) & Sistemas',
    code: 'TI-GOV',
    description: 'Infraestrutura tecnológica, sistemas de monitoramento de frotas e LGPD',
    managerId: 'user-1',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Assédio Moral ou Sexual',
    code: 'ASSEDIO',
    description: 'Condutas inadequadas que constrangem ou afetam a dignidade do indivíduo no ambiente de trabalho',
    defaultRiskLevel: RiskLevelEnum.HIGH,
    slaDays: 5,
    active: true,
    reportCount: 12,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Fraude ou Irregularidade Financeira',
    code: 'FRAUDE',
    description: 'Uso indevido de recursos, compras irregulares ou desvio de suprimentos',
    defaultRiskLevel: RiskLevelEnum.CRITICAL,
    slaDays: 3,
    active: true,
    reportCount: 6,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Segurança do Paciente e Protocolos Clínicos',
    code: 'SEG_PACIENTE',
    description: 'Descumprimento de procedimentos médicos, enfermagem ou atendimento ao paciente',
    defaultRiskLevel: RiskLevelEnum.HIGH,
    slaDays: 3,
    active: true,
    reportCount: 9,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Infraestrutura e Segurança Patrimonial',
    code: 'INFRA',
    description: 'Problemas de manutenção física, riscos de acidentes ou controle de acesso',
    defaultRiskLevel: RiskLevelEnum.MEDIUM,
    slaDays: 10,
    active: true,
    reportCount: 5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Elogio ou Sugestão de Melhoria',
    code: 'ELOGIO_SUGESTAO',
    description: 'Reconhecimento de bom atendimento ou ideias de aprimoramento operacional',
    defaultRiskLevel: RiskLevelEnum.LOW,
    slaDays: 15,
    active: true,
    reportCount: 8,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// Gerador determinístico de 40 manifestações fictícias
function generate40Reports(): Report[] {
  const reports: Report[] = [];
  const statuses = Object.values(ReportStatusEnum);
  const risks = Object.values(RiskLevelEnum);
  const priorities = Object.values(PriorityLevelEnum);

  const sampleTitles = [
    'Relato sobre conduta inadequada na recepção da ala A',
    'Irregularidade no controle de validade de insumos farmacêuticos',
    'Elogio ao atendimento da equipe médica do plantão noturno',
    'Descumprimento de protocolo de higiene no refeitório',
    'Suspeita de favorecimento em processo licitatório de pintura',
    'Sugestão de ampliação das vagas de estacionamento para acompanhantes',
    'Uso de linguagem desrespeitosa durante reunião de alinhamento',
    'Falta de manutenção no elevador social da Unidade Infantil',
    'Vazamento recorrente de água no vestiário masculino da enfermagem',
    'Cobrança indevida a paciente em leito do SUS',
  ];

  for (let i = 1; i <= 40; i++) {
    const padId = String(i).padStart(3, '0');
    const protocol = `GB-2025-${padId}`;
    const accessKey = `KEY-${Math.floor(1000 + Math.random() * 9000)}`;

    const type = i % 5 === 0 ? ReportTypeEnum.ELOGIO : i % 7 === 0 ? ReportTypeEnum.SUGESTAO : ReportTypeEnum.DENUNCIA;
    const isAnon = i % 2 === 0;
    const regType = isAnon ? RegistrationTypeEnum.ANONYMOUS : RegistrationTypeEnum.IDENTIFIED;

    const status = statuses[(i - 1) % statuses.length];
    const riskLevel = risks[(i - 1) % risks.length];
    const priorityLevel = priorities[(i - 1) % priorities.length];

    const cat = mockCategories[(i - 1) % mockCategories.length];
    const unit = mockUnits[(i - 1) % mockUnits.length];
    const dept = mockDepartments[(i - 1) % mockDepartments.length];

    const baseTitle = sampleTitles[(i - 1) % sampleTitles.length];
    const title = `${baseTitle} #${padId}`;

    const createdDaysAgo = 40 - i;
    const dateObj = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000);
    const createdAt = dateObj.toISOString();
    const slaDueDate = new Date(dateObj.getTime() + cat.slaDays * 24 * 60 * 60 * 1000).toISOString();

    const report: Report = {
      id: `rep-${i}`,
      protocol,
      accessKey,
      title,
      description: `Esta manifestação de código ${protocol} refere-se a observações efetuadas na unidade ${unit.name}, setor de ${dept.name}. Solicita-se averiguação cuidadosa por parte do comitê de ética e compliance do Grupo Bairral.`,
      type,
      registrationType: regType,
      status,
      riskLevel,
      priorityLevel,
      categoryId: cat.id,
      categoryName: cat.name,
      unitId: unit.id,
      unitName: unit.name,
      departmentId: dept.id,
      departmentName: dept.name,
      reporter: {
        type: regType,
        name: isAnon ? undefined : `Manifestante ${i}`,
        email: isAnon ? undefined : `manifestante${i}@exemplo.com.br`,
        phone: isAnon ? undefined : `(19) 98765-432${i % 10}`,
        relationshipToHospital: 'EMPLOYEE',
      },
      attachments: i % 3 === 0 ? [
        {
          id: `att-${i}-1`,
          fileName: `evidencia_${protocol}.pdf`,
          fileSize: 1048576,
          mimeType: 'application/pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          uploadedAt: createdAt,
        }
      ] : [],
      assignments: [
        {
          id: `asg-${i}`,
          reportId: `rep-${i}`,
          assigneeId: mockUsers[i % mockUsers.length].id,
          assigneeName: mockUsers[i % mockUsers.length].name,
          assignedById: mockUsers[0].id,
          assignedByName: mockUsers[0].name,
          assignedAt: createdAt,
          note: 'Atribuído para triagem e averiguação inicial.',
        }
      ],
      statusHistory: [
        {
          id: `sth-${i}-1`,
          reportId: `rep-${i}`,
          newStatus: ReportStatusEnum.RECEIVED,
          changedById: 'system',
          changedByName: 'Sistema de Registro',
          changedAt: createdAt,
        },
        ...(status !== ReportStatusEnum.RECEIVED ? [
          {
            id: `sth-${i}-2`,
            reportId: `rep-${i}`,
            previousStatus: ReportStatusEnum.RECEIVED,
            newStatus: status,
            changedById: mockUsers[1].id,
            changedByName: mockUsers[1].name,
            reason: 'Atualização de status durante a rotina de apuração.',
            changedAt: new Date(dateObj.getTime() + 12 * 60 * 60 * 1000).toISOString(),
          }
        ] : [])
      ],
      publicMessages: [
        {
          id: `msg-${i}-1`,
          reportId: `rep-${i}`,
          senderType: 'COMMITTEE',
          senderName: 'Ouvidoria / Comitê de Ética',
          content: `Sua manifestação foi recebida com sucesso sob o protocolo ${protocol}. Nossa equipe iniciou os procedimentos de análise.`,
          attachments: [],
          createdAt,
        }
      ],
      internalComments: [
        {
          id: `cmt-${i}-1`,
          reportId: `rep-${i}`,
          authorId: mockUsers[1].id,
          authorName: mockUsers[1].name,
          authorRole: mockUsers[1].roleName,
          content: 'Primeira verificação concluída. Solicitar informações adicionais ao responsável de setor.',
          attachments: [],
          isPrivate: true,
          createdAt,
        }
      ],
      actionPlans: status === ReportStatusEnum.ACTION_PLAN || status === ReportStatusEnum.RESOLVED ? [
        {
          id: `acp-${i}`,
          reportId: `rep-${i}`,
          title: `Plano de Ação Corretiva ${protocol}`,
          description: 'Revisão das rotinas operacionais e treinamento de reciclagem com os colaboradores envolvidos.',
          responsibleId: mockUsers[2].id,
          responsibleName: mockUsers[2].name,
          dueDate: new Date(dateObj.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: status === ReportStatusEnum.RESOLVED ? 'COMPLETED' : 'IN_PROGRESS',
          progressPercentage: status === ReportStatusEnum.RESOLVED ? 100 : 45,
          createdAt,
          updatedAt: new Date().toISOString(),
        }
      ] : [],
      slaDueDate,
      resolvedAt: status === ReportStatusEnum.RESOLVED || status === ReportStatusEnum.COMPLETED ? new Date().toISOString() : undefined,
      relatedPeople: [],
      isRestricted: false,
      conflictDeclared: false,
      createdAt,
      updatedAt: new Date().toISOString(),
    };

    reports.push(report);
  }

  return reports;
}

export const mockReports: Report[] = generate40Reports();

export const mockAuditLogs: AuditLog[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `log-${i + 1}`,
  timestamp: new Date(Date.now() - i * 3600000 * 4).toISOString(),
  userId: mockUsers[i % mockUsers.length].id,
  userName: mockUsers[i % mockUsers.length].name,
  userRole: mockUsers[i % mockUsers.length].roleName,
  action: i % 4 === 0 ? 'CONSULTA_MANIFESTACAO' : i % 4 === 1 ? 'ALTERACAO_STATUS' : i % 4 === 2 ? 'LOGIN_USUARIO' : 'ATRIBUICAO_CASO',
  resource: i % 2 === 0 ? 'Report' : 'User',
  resourceId: `rep-${(i % 40) + 1}`,
  details: `Operação de auditoria realizada com sucesso no recurso rep-${(i % 40) + 1}`,
  ipAddress: `192.168.1.${10 + (i % 50)}`,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}));

export const mockDashboardMetrics: DashboardMetrics = {
  totalReports: mockReports.length,
  newInPeriod: 14,
  openReports: mockReports.filter(
    (r) =>
      r.status !== ReportStatusEnum.RESOLVED &&
      r.status !== ReportStatusEnum.COMPLETED &&
      r.status !== ReportStatusEnum.ARCHIVED
  ).length,
  completedReports: mockReports.filter(
    (r) => r.status === ReportStatusEnum.RESOLVED || r.status === ReportStatusEnum.COMPLETED
  ).length,
  criticalReports: mockReports.filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL).length,
  delayedReports: mockReports.filter(
    (r) =>
      new Date(r.slaDueDate) < new Date() &&
      r.status !== ReportStatusEnum.RESOLVED &&
      r.status !== ReportStatusEnum.COMPLETED
  ).length,
  assignedToMe: mockReports.filter((r) => r.assignments.some((a) => a.assigneeId === 'user-1')).length,
  avgTriageDays: 1.2,
  avgResolutionDays: 4.5,
  slaAdherencePercentage: 94.2,
  resolutionRate: 82.5,
  monthlyComparisonPercentage: 12.4,

  periodVolume: [
    { date: '2026-07-26', label: '26/07', abertos: 4, recentes: 2, concluidas: 2, count: 6, resolved: 2 },
    { date: '2026-07-27', label: '27/07', abertos: 5, recentes: 3, concluidas: 4, count: 8, resolved: 4 },
    { date: '2026-07-28', label: '28/07', abertos: 4, recentes: 2, concluidas: 3, count: 6, resolved: 3 },
    { date: '2026-07-29', label: '29/07', abertos: 7, recentes: 4, concluidas: 5, count: 9, resolved: 5 },
    { date: '2026-07-30', label: '30/07', abertos: 5, recentes: 3, concluidas: 4, count: 7, resolved: 4 },
    { date: '2026-07-31', label: '31/07', abertos: 8, recentes: 5, concluidas: 7, count: 10, resolved: 7 },
    { date: '2026-08-01', label: '01/08', abertos: 5, recentes: 2, concluidas: 3, count: 6, resolved: 3 },
  ],

  reportsByStatus: {
    [ReportStatusEnum.RECEIVED]: mockReports.filter((r) => r.status === ReportStatusEnum.RECEIVED).length,
    [ReportStatusEnum.TRIAGE]: mockReports.filter((r) => r.status === ReportStatusEnum.TRIAGE).length,
    [ReportStatusEnum.PENDING_INFO]: mockReports.filter((r) => r.status === ReportStatusEnum.PENDING_INFO).length,
    [ReportStatusEnum.ANALYSIS]: mockReports.filter((r) => r.status === ReportStatusEnum.ANALYSIS).length,
    [ReportStatusEnum.INVESTIGATION]: mockReports.filter((r) => r.status === ReportStatusEnum.INVESTIGATION).length,
    [ReportStatusEnum.FORWARDED]: mockReports.filter((r) => r.status === ReportStatusEnum.FORWARDED).length,
    [ReportStatusEnum.ACTION_PLAN]: mockReports.filter((r) => r.status === ReportStatusEnum.ACTION_PLAN).length,
    [ReportStatusEnum.RESOLVED]: mockReports.filter((r) => r.status === ReportStatusEnum.RESOLVED).length,
    [ReportStatusEnum.COMPLETED]: mockReports.filter((r) => r.status === ReportStatusEnum.COMPLETED).length,
    [ReportStatusEnum.ARCHIVED]: mockReports.filter((r) => r.status === ReportStatusEnum.ARCHIVED).length,
    [ReportStatusEnum.REOPENED]: mockReports.filter((r) => r.status === ReportStatusEnum.REOPENED).length,
  },

  reportsByRisk: {
    [RiskLevelEnum.LOW]: mockReports.filter((r) => r.riskLevel === RiskLevelEnum.LOW).length,
    [RiskLevelEnum.MEDIUM]: mockReports.filter((r) => r.riskLevel === RiskLevelEnum.MEDIUM).length,
    [RiskLevelEnum.HIGH]: mockReports.filter((r) => r.riskLevel === RiskLevelEnum.HIGH).length,
    [RiskLevelEnum.CRITICAL]: mockReports.filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL).length,
  },

  reportsByCategory: mockCategories.map((c) => ({
    categoryId: c.id,
    categoryName: c.name,
    count: mockReports.filter((r) => r.categoryId === c.id).length,
  })),

  reportsByUnit: mockUnits.map((u) => ({
    unitId: u.id,
    unitName: u.name,
    count: mockReports.filter((r) => r.unitId === u.id).length,
  })),

  slaTrend: [
    { month: 'Fev', slaPercentage: 88.0 },
    { month: 'Mar', slaPercentage: 90.5 },
    { month: 'Abr', slaPercentage: 89.2 },
    { month: 'Mai', slaPercentage: 92.4 },
    { month: 'Jun', slaPercentage: 95.0 },
    { month: 'Jul', slaPercentage: 94.2 },
  ],

  resolutivityTrend: [
    { month: 'Fev', rate: 72.0 },
    { month: 'Mar', rate: 74.5 },
    { month: 'Abr', rate: 77.0 },
    { month: 'Mai', rate: 79.2 },
    { month: 'Jun', rate: 81.0 },
    { month: 'Jul', rate: 82.5 },
  ],

  registrationTypeDistribution: {
    anonymous: mockReports.filter((r) => r.registrationType === RegistrationTypeEnum.ANONYMOUS).length,
    identified: mockReports.filter((r) => r.registrationType === RegistrationTypeEnum.IDENTIFIED).length,
  },

  recentCriticalReports: mockReports
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
    })),

  nearDeadlineReports: mockReports
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
    }),

  recentActivities: mockAuditLogs.slice(0, 6).map((log) => ({
    id: log.id,
    userName: log.userName,
    userRole: log.userRole,
    action: log.action,
    details: log.details,
    timestamp: log.timestamp,
  })),

  delayedActionPlans: [
    {
      id: 'ap-101',
      reportId: 'rep-1',
      reportProtocol: 'GB-2025-001',
      title: 'Treinamento sobre segurança do paciente na Enfermagem',
      responsibleName: 'Fernanda Lima',
      dueDate: '2026-07-28T18:00:00Z',
      daysOverdue: 4,
      progressPercentage: 40,
    },
    {
      id: 'ap-102',
      reportId: 'rep-4',
      reportProtocol: 'GB-2025-004',
      title: 'Adequação dos processos de descarte no Pavilhão B',
      responsibleName: 'Roberto Mendes',
      dueDate: '2026-07-30T18:00:00Z',
      daysOverdue: 2,
      progressPercentage: 65,
    },
    {
      id: 'ap-103',
      reportId: 'rep-9',
      reportProtocol: 'GB-2025-009',
      title: 'Revisão do protocolo de acolhimento noturno',
      responsibleName: 'Carlos Silva',
      dueDate: '2026-07-31T18:00:00Z',
      daysOverdue: 1,
      progressPercentage: 20,
    },
  ],
};

export const mockActionPlans = [
  {
    id: 'ap-101',
    reportId: 'rep-1',
    reportProtocol: 'GB-2025-001',
    title: 'Treinamento sobre segurança do paciente na Enfermagem',
    description: 'Realização de workshop de reciclagem sobre protocolos de medicação e atendimento empático com foco no Pavilhão Central.',
    responsibleId: 'user-2',
    responsibleName: 'Fernanda Lima',
    status: 'IN_PROGRESS' as const,
    progressPercentage: 40,
    dueDate: '2026-07-28T18:00:00Z',
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-12T14:00:00Z',
    daysOverdue: 4,
    evidences: [
      { name: 'lista_presenca_treinamento.pdf', uploadedAt: '2025-02-11T16:00:00Z' }
    ]
  },
  {
    id: 'ap-102',
    reportId: 'rep-4',
    reportProtocol: 'GB-2025-004',
    title: 'Adequação dos processos de descarte na Base Operacional Barcarena',
    description: 'Substituição das lixeiras industriais e instalação de sinalização visual ampliada para resíduos industriais e óleo usado.',
    responsibleId: 'user-3',
    responsibleName: 'Roberto Mendes',
    status: 'IN_PROGRESS' as const,
    progressPercentage: 65,
    dueDate: '2026-07-30T18:00:00Z',
    createdAt: '2025-02-05T09:00:00Z',
    updatedAt: '2025-02-14T11:00:00Z',
    daysOverdue: 2,
    evidences: []
  },
  {
    id: 'ap-103',
    reportId: 'rep-9',
    reportProtocol: 'GB-2025-009',
    title: 'Revisão do protocolo de acolhimento noturno',
    description: 'Reunião de alinhamento com os supervisores de plantão para garantir preenchimento adequado da ficha de triagem.',
    responsibleId: 'user-1',
    responsibleName: 'Carlos Silva',
    status: 'NOT_STARTED' as const,
    progressPercentage: 0,
    dueDate: '2026-08-15T18:00:00Z',
    createdAt: '2025-02-12T15:00:00Z',
    updatedAt: '2025-02-12T15:00:00Z',
    daysOverdue: 0,
    evidences: []
  },
  {
    id: 'ap-104',
    reportId: 'rep-2',
    reportProtocol: 'GB-2025-002',
    title: 'Auditoria de inventário do Almoxarifado de Insumos',
    description: 'Recontagem física completa e reconciliação dos registros do sistema ERP com verificação de lacres.',
    responsibleId: 'user-1',
    responsibleName: 'Carlos Silva',
    status: 'COMPLETED' as const,
    progressPercentage: 100,
    dueDate: '2025-02-01T18:00:00Z',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-30T17:00:00Z',
    validationNotes: 'Auditoria concluída e estoque reconciliado sem divergências materiais.',
    daysOverdue: 0,
    evidences: [
      { name: 'relatorio_reconciliacao_estoque.pdf', uploadedAt: '2025-01-30T16:30:00Z' }
    ]
  },
];

export const mockSettings = {

  institutional: {
    organizationName: 'Grupo Bairral',
    cnpj: '34.567.890/0001-12',
    address: 'Rua Antônio Manoel Menineia, S/N - Bairro Burajuba - Barcarena/PA - CEP 68447-000',
    ethicsEmail: 'comissao.etica@grupobairral.com.br',
    dpoName: 'Beatriz Bairral',
    dpoEmail: 'dpo@grupobairral.com.br',
  },
  slaDefaults: {
    criticalTriageDays: 1,
    normalTriageDays: 3,
    finalResolutionDays: 15,
    maxExtensionDays: 10,
  },
  policies: {
    privacyTerms:
      'Garantimos a total confidencialidade, integridade e proteção dos dados pessoais fornecidos no Canal de Integridade do Grupo Bairral, em estrito cumprimento à Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).',
    antiRetaliationPolicy:
      'É expressamente proibida qualquer forma de retaliação contra manifestantes de boa-fé. Qualquer conduta retaliatória comprovada resultará em sanções disciplinares severas.',
    anonymityGuidelines:
      'O manifestante possui o direito inalienável de optar pelo anonimato. Nenhuma informação técnica de IP ou dispositivo é divulgada nas instâncias de investigação.',
  },
  messageTemplates: {
    receiptConfirmation:
      'Sua manifestação foi recebida com sucesso sob o protocolo {{PROTOCOL}}. Sua demanda foi encaminhada ao Comitê de Ética e Integridade.',
    infoRequest:
      'Prezado(a) manifestante, para prosseguimento da análise do protocolo {{PROTOCOL}}, solicitamos o envio de mais informações ou documentos complementares.',
    extensionNotice:
      'Informamos que o prazo de análise da manifestação {{PROTOCOL}} foi prorrogado por mais {{DAYS}} dias úteis em virtude da complexidade dos fatos.',
    closureNotice:
      'A apuração da manifestação {{PROTOCOL}} foi concluída pelo Comitê de Ética. As medidas corretivas aplicáveis foram devidamente encaminhadas.',
  },
  retention: {
    retentionYears: 5,
    autoPurgeSensitiveEvidence: true,
  },
  alternativeChannels: {
    phone0800: '(91) 99141-7722',
    whatsappNumber: '+55 91 99141-7722',
    physicalBoxLocations: 'Urnas físicas localizadas nas recepções da Sede (Burajuba) e do Escritório (Vila dos Cabanos) em Barcarena/PA.',
  },
  notifications: {
    notifyCriticalCasesImmediately: true,
    notifySlaWarning24h: true,
    weeklyCommitteeDigest: true,
  },
};

