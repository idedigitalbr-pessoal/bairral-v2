import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seeding de Permissões, Perfis, Usuários, Categorias e Unidades...');

  // 1. Permissões
  const permissions = [
    { code: 'VIEW_CASES', name: 'Visualizar Manifestações', module: 'Manifestações' },
    { code: 'VIEW_IDENTITY', name: 'Visualizar Identidade de Manifestante', module: 'Manifestações' },
    { code: 'CHANGE_CLASSIFICATION', name: 'Alterar Classificação de Risco/Categoria', module: 'Triagem' },
    { code: 'ASSIGN_CASES', name: 'Atribuir Casos e Relatores', module: 'Triagem' },
    { code: 'CHANGE_STATUS', name: 'Alterar Status da Manifestação', module: 'Tratativa' },
    { code: 'ACCESS_ATTACHMENTS', name: 'Acessar Evidências e Anexos Sigilosos', module: 'Tratativa' },
    { code: 'SEND_MESSAGES', name: 'Enviar Mensagens ao Manifestante', module: 'Comunicação' },
    { code: 'ADD_INTERNAL_COMMENTS', name: 'Adicionar Notas Internas da Apuração', module: 'Tratativa' },
    { code: 'CREATE_ACTION_PLAN', name: 'Criar e Gerenciar Planos de Ação', module: 'Planos de Ação' },
    { code: 'CONCLUDE_CASE', name: 'Concluir Casos e Emitir Parecer Final', module: 'Encerramento' },
    { code: 'REOPEN_CASE', name: 'Reabrir Manifestações Encerradas', module: 'Encerramento' },
    { code: 'EXPORT_DATA', name: 'Exportar Relatórios Governamentais/PDF', module: 'Relatórios' },
    { code: 'ACCESS_AUDIT', name: 'Acessar Logs de Auditoria do Sistema', module: 'Governança' },
    { code: 'MANAGE_USERS', name: 'Gerenciar Usuários e Atribuições', module: 'Administração' },
    { code: 'MANAGE_SETTINGS', name: 'Gerenciar Parâmetros e SLAs do Sistema', module: 'Administração' },
  ];

  const createdPerms: Record<string, string> = {};

  for (const perm of permissions) {
    const p = await prisma.permission.upsert({
      where: { code: perm.code },
      update: { name: perm.name, module: perm.module },
      create: perm,
    });
    createdPerms[perm.code] = p.id;
  }

  // 2. Perfis (Roles)
  const roles = [
    {
      code: 'SUPER_ADMIN',
      name: 'Superadministrador',
      description: 'Acesso total a todos os recursos do sistema',
      isSystemRole: true,
      permissions: Object.keys(createdPerms),
    },
    {
      code: 'ETHICS_MANAGER',
      name: 'Gestor de Ética',
      description: 'Gestão executiva, apuração de casos e condução das reuniões do comitê',
      isSystemRole: true,
      permissions: [
        'VIEW_CASES',
        'VIEW_IDENTITY',
        'CHANGE_CLASSIFICATION',
        'ASSIGN_CASES',
        'CHANGE_STATUS',
        'ACCESS_ATTACHMENTS',
        'SEND_MESSAGES',
        'ADD_INTERNAL_COMMENTS',
        'CREATE_ACTION_PLAN',
        'CONCLUDE_CASE',
        'REOPEN_CASE',
        'EXPORT_DATA',
        'ACCESS_AUDIT',
      ],
    },
    {
      code: 'TRIAGE_ANALYST',
      name: 'Analista de Triagem',
      description: 'Triagem inicial, validação de admissibilidade e encaminhamento de casos',
      isSystemRole: false,
      permissions: [
        'VIEW_CASES',
        'CHANGE_CLASSIFICATION',
        'ASSIGN_CASES',
        'ACCESS_ATTACHMENTS',
        'SEND_MESSAGES',
        'ADD_INTERNAL_COMMENTS',
      ],
    },
    {
      code: 'INVESTIGATOR',
      name: 'Investigador',
      description: 'Condução de investigações internas, coleta de evidências e pareceres',
      isSystemRole: false,
      permissions: [
        'VIEW_CASES',
        'ACCESS_ATTACHMENTS',
        'ADD_INTERNAL_COMMENTS',
        'CREATE_ACTION_PLAN',
      ],
    },
    {
      code: 'AREA_MANAGER',
      name: 'Responsável por Área',
      description: 'Execução e acompanhamento de planos de ação',
      isSystemRole: false,
      permissions: ['VIEW_CASES', 'CREATE_ACTION_PLAN'],
    },
    {
      code: 'AUDITOR',
      name: 'Auditor',
      description: 'Acompanhamento do cumprimento de prazos, conformidade e auditoria',
      isSystemRole: false,
      permissions: ['VIEW_CASES', 'EXPORT_DATA', 'ACCESS_AUDIT'],
    },
    {
      code: 'EXECUTIVE_VIEWER',
      name: 'Visualizador Executivo',
      description: 'Acesso a relatórios gerenciais e dashboards sem identificadores',
      isSystemRole: false,
      permissions: ['VIEW_CASES', 'EXPORT_DATA'],
    },
  ];

  for (const roleDef of roles) {
    const role = await prisma.role.upsert({
      where: { code: roleDef.code },
      update: { name: roleDef.name, description: roleDef.description },
      create: {
        code: roleDef.code,
        name: roleDef.name,
        description: roleDef.description,
        isSystemRole: roleDef.isSystemRole,
      },
    });

    for (const permCode of roleDef.permissions) {
      const permId = createdPerms[permCode];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permId,
          },
        });
      }
    }
  }

  // 3. Categorias de Manifestação
  const categories = [
    { code: 'MORAL_HARASSMENT', name: 'Assédio Moral', description: 'Condutas abusivas frequentes no ambiente de trabalho', slaDays: 15 },
    { code: 'SEXUAL_HARASSMENT', name: 'Assédio Sexual', description: 'Insinuações, propostas não solicitadas ou constrangimento sexual', slaDays: 10 },
    { code: 'DISCRIMINATION', name: 'Discriminação e Diversidade', description: 'Tratamento diferencial por raça, gênero, religião ou orientação', slaDays: 15 },
    { code: 'FRAUD_CORRUPTION', name: 'Fraude, Suborno ou Corrupção', description: 'Fraude financeira, pagamentos indevidos ou vantagens ilícitas', slaDays: 20 },
    { code: 'ETHICAL_DEVIATION', name: 'Desvio de Conduta Ética', description: 'Inobservância do Código de Conduta e Valores do Grupo Bairral', slaDays: 15 },
    { code: 'PATIENT_SAFETY_LGPD', name: 'Segurança do Paciente / LGPD', description: 'Violação de protocolos assistenciais ou vazamento de dados de pacientes', slaDays: 10 },
    { code: 'ASSET_MISUSE', name: 'Uso Indevido de Patrimônio', description: 'Uso inadequado de insumos, equipamentos ou estruturas do hospital', slaDays: 15 },
    { code: 'CONFLICT_OF_INTEREST', name: 'Conflito de Interesses', description: 'Situações em que interesses pessoais se contrapõem aos do hospital', slaDays: 15 },
    { code: 'OTHER', name: 'Outros Assuntos', description: 'Outras manifestações não enquadradas nas categorias específicas', slaDays: 15 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: { name: cat.name, description: cat.description, slaDays: cat.slaDays },
      create: cat,
    });
  }

  // 4. Unidades e Departamentos
  const unitsData = [
    {
      code: 'HOSPITAL_CENTRAL',
      name: 'Complexo Hospitalar Bairral',
      city: 'Itapira',
      state: 'SP',
      departments: [
        { code: 'ENFERMAGEM', name: 'Enfermagem e Assistência' },
        { code: 'CORPO_MEDICO', name: 'Corpo Médico' },
        { code: 'RH', name: 'Recursos Humanos' },
        { code: 'FINANCEIRO', name: 'Financeiro e Suprimentos' },
        { code: 'MANUTENCAO', name: 'Manutenção e Infraestrutura' },
        { code: 'TI', name: 'Tecnologia da Informação' },
      ],
    },
    {
      code: 'UNIDADE_INTERNACAO',
      name: 'Unidade de Internação Psiquiátrica',
      city: 'Itapira',
      state: 'SP',
      departments: [
        { code: 'ASSISTENCIA', name: 'Equipe Multidisciplinar' },
        { code: 'RECEPCAO', name: 'Atendimento e Recepção' },
      ],
    },
    {
      code: 'RESIDENCIA_TERAPEUTICA',
      name: 'Residência Terapêutica',
      city: 'Itapira',
      state: 'SP',
      departments: [
        { code: 'CUIDADORES', name: 'Equipe de Cuidadores' },
      ],
    },
  ];

  for (const uData of unitsData) {
    const unit = await prisma.unit.upsert({
      where: { code: uData.code },
      update: { name: uData.name, city: uData.city, state: uData.state },
      create: {
        code: uData.code,
        name: uData.name,
        city: uData.city,
        state: uData.state,
      },
    });

    for (const dData of uData.departments) {
      await prisma.department.upsert({
        where: {
          unitId_code: {
            unitId: unit.id,
            code: dData.code,
          },
        },
        update: { name: dData.name },
        create: {
          unitId: unit.id,
          code: dData.code,
          name: dData.name,
        },
      });
    }
  }

  // 5. Usuários Adicionais e Perfis
  const superAdminRole = await prisma.role.findUnique({ where: { code: 'SUPER_ADMIN' } });
  const ethicsManagerRole = await prisma.role.findUnique({ where: { code: 'ETHICS_MANAGER' } });
  const investigatorRole = await prisma.role.findUnique({ where: { code: 'INVESTIGATOR' } });

  const defaultPasswordHash = await bcrypt.hash('Admin@Bairral2026', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bairral.com.br' },
    update: { name: 'Administrador do Sistema' },
    create: {
      name: 'Administrador do Sistema',
      email: 'admin@bairral.com.br',
      passwordHash: defaultPasswordHash,
      status: 'ACTIVE',
      isFirstAccess: false,
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  const userCompliance = await prisma.user.upsert({
    where: { email: 'mariana.souza@bairral.com.br' },
    update: { name: 'Mariana Ferreira Souza' },
    create: {
      name: 'Mariana Ferreira Souza',
      email: 'mariana.souza@bairral.com.br',
      passwordHash: defaultPasswordHash,
      status: 'ACTIVE',
      isFirstAccess: false,
    },
  });

  if (ethicsManagerRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: userCompliance.id,
          roleId: ethicsManagerRole.id,
        },
      },
      update: {},
      create: {
        userId: userCompliance.id,
        roleId: ethicsManagerRole.id,
      },
    });
  }

  const userInvestigator = await prisma.user.upsert({
    where: { email: 'roberto.mendes@bairral.com.br' },
    update: { name: 'Dr. Roberto Mendes' },
    create: {
      name: 'Dr. Roberto Mendes',
      email: 'roberto.mendes@bairral.com.br',
      passwordHash: defaultPasswordHash,
      status: 'ACTIVE',
      isFirstAccess: false,
    },
  });

  if (investigatorRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: userInvestigator.id,
          roleId: investigatorRole.id,
        },
      },
      update: {},
      create: {
        userId: userInvestigator.id,
        roleId: investigatorRole.id,
      },
    });
  }

  // Buscar referências no BD para vincular manifestações
  const allCategories = await prisma.category.findMany();
  const allUnits = await prisma.unit.findMany({ include: { departments: true } });

  // 6. Criar Manifestações (Reports) para o Dashboard
  const sampleReportsData = [
    {
      title: 'Relato sobre conduta inadequada na recepção da ala A',
      description: 'Ocorreu um episódio de tratamento ríspido com acompanhante de paciente na recepção principal.',
      type: 'DEVIATION' as const,
      submissionMode: 'ANONYMOUS' as const,
      status: 'SUBMITTED' as const,
      riskLevel: 'MEDIUM' as const,
      priority: 'MEDIUM' as const,
      catCode: 'ETHICAL_DEVIATION',
      daysAgo: 1,
    },
    {
      title: 'Descumprimento de protocolo de higiene no refeitório',
      description: 'Inobservância do uso obrigatorio de equipamentos de proteção individual durante manipulação de refeições.',
      type: 'SAFETY' as const,
      submissionMode: 'IDENTIFIED' as const,
      status: 'UNDER_TRIAGE' as const,
      riskLevel: 'HIGH' as const,
      priority: 'HIGH' as const,
      catCode: 'PATIENT_SAFETY_LGPD',
      daysAgo: 3,
    },
    {
      title: 'Vazamento recorrente de dados de prontuário eletrônico',
      description: 'Identificado acesso não autorizado a prontuários na ala de internação por funcionário sem atribuição clínica.',
      type: 'PRIVACY' as const,
      submissionMode: 'CONFIDENTIAL' as const,
      status: 'UNDER_INVESTIGATION' as const,
      riskLevel: 'CRITICAL' as const,
      priority: 'URGENT' as const,
      catCode: 'PATIENT_SAFETY_LGPD',
      daysAgo: 5,
    },
    {
      title: 'Suspeita de favorecimento em processo licitatório de pintura',
      description: 'Apuração sobre orçamentos divergentes apresentados por prestadores de serviços de reforma predial.',
      type: 'FRAUD' as const,
      submissionMode: 'ANONYMOUS' as const,
      status: 'ACTION_PLAN' as const,
      riskLevel: 'HIGH' as const,
      priority: 'HIGH' as const,
      catCode: 'FRAUD_CORRUPTION',
      daysAgo: 10,
    },
    {
      title: 'Assédio moral recorrente durante trocas de plantão',
      description: 'Relato confidencial indicando linguagem intimidatória por parte de liderança em relação a subordinados diretos.',
      type: 'HARASSMENT' as const,
      submissionMode: 'CONFIDENTIAL' as const,
      status: 'UNDER_INVESTIGATION' as const,
      riskLevel: 'HIGH' as const,
      priority: 'HIGH' as const,
      catCode: 'MORAL_HARASSMENT',
      daysAgo: 8,
    },
    {
      title: 'Elogio ao atendimento da equipe de enfermagem da UTI',
      description: 'Manifestação de agradecimento da família de paciente pelo acolhimento humanizado e dedicação.',
      type: 'OTHER' as const,
      submissionMode: 'IDENTIFIED' as const,
      status: 'CONCLUDED' as const,
      riskLevel: 'LOW' as const,
      priority: 'LOW' as const,
      catCode: 'OTHER',
      daysAgo: 15,
    },
    {
      title: 'Uso indevido de veículo institucional em horários não comerciais',
      description: 'Veículo com identificação do hospital foi visto estacionado fora de expediente em local inapropriado.',
      type: 'DEVIATION' as const,
      submissionMode: 'ANONYMOUS' as const,
      status: 'CONCLUDED' as const,
      riskLevel: 'MEDIUM' as const,
      priority: 'MEDIUM' as const,
      catCode: 'ASSET_MISUSE',
      daysAgo: 20,
    },
    {
      title: 'Falta de manutenção no elevador da Unidade Infantil',
      description: 'Elevador apresentando ruídos e paralisações bruscas, colocando em risco transporte de pacientes.',
      type: 'SAFETY' as const,
      submissionMode: 'IDENTIFIED' as const,
      status: 'ACTION_PLAN' as const,
      riskLevel: 'HIGH' as const,
      priority: 'HIGH' as const,
      catCode: 'PATIENT_SAFETY_LGPD',
      daysAgo: 12,
    },
    {
      title: 'Incompatibilidade em prestação de contas de suprimentos médicos',
      description: 'Discrepância entre contagem física de estoque e relatório de saída de medicamentos de alto custo.',
      type: 'FRAUD' as const,
      submissionMode: 'ANONYMOUS' as const,
      status: 'UNDER_INVESTIGATION' as const,
      riskLevel: 'CRITICAL' as const,
      priority: 'URGENT' as const,
      catCode: 'FRAUD_CORRUPTION',
      daysAgo: 6,
    },
    {
      title: 'Sugestão de ampliação das sinalizações para visitantes',
      description: 'Sugestão para inclusão de placas indicativas com maior contraste e acessibilidade visual nas entradas.',
      type: 'OTHER' as const,
      submissionMode: 'IDENTIFIED' as const,
      status: 'CONCLUDED' as const,
      riskLevel: 'LOW' as const,
      priority: 'LOW' as const,
      catCode: 'OTHER',
      daysAgo: 25,
    },
  ];

  for (let idx = 0; idx < sampleReportsData.length; idx++) {
    const item = sampleReportsData[idx];
    const protocol = `GB-202608-P${String(idx + 1).padStart(3, '0')}`;
    const trackingPasswordHash = await bcrypt.hash(`SenhaSegura${idx + 1}`, 10);

    const category = allCategories.find((c) => c.code === item.catCode) || allCategories[0];
    const unit = allUnits[idx % allUnits.length];
    const department = unit.departments[0];

    const createdAt = new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000);
    const dueAt = new Date(createdAt.getTime() + (category?.slaDays || 15) * 24 * 60 * 60 * 1000);

    const report = await prisma.report.upsert({
      where: { protocol },
      update: {
        title: item.title,
        status: item.status,
        riskLevel: item.riskLevel,
      },
      create: {
        protocol,
        trackingPasswordHash,
        title: item.title,
        description: item.description,
        type: item.type,
        submissionMode: item.submissionMode,
        status: item.status,
        riskLevel: item.riskLevel,
        priority: item.priority,
        categoryId: category?.id,
        unitId: unit?.id,
        departmentId: department?.id,
        assignedUserId: item.status !== 'SUBMITTED' ? userCompliance.id : null,
        dueAt,
        createdAt,
        closedAt: item.status === 'CONCLUDED' ? new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
      },
    });

    // Histórico de status
    await prisma.statusHistory.create({
      data: {
        reportId: report.id,
        previousStatus: null,
        newStatus: 'SUBMITTED',
        createdAt,
      },
    });

    if (item.status !== 'SUBMITTED') {
      await prisma.statusHistory.create({
        data: {
          reportId: report.id,
          previousStatus: 'SUBMITTED',
          newStatus: item.status,
          changedByUserId: adminUser.id,
          reason: 'Encaminhamento para triagem/apuração pelo Comitê de Ética.',
          createdAt: new Date(createdAt.getTime() + 12 * 60 * 60 * 1000),
        },
      });
    }

    // Criar Plano de Ação se status for ACTION_PLAN ou CONCLUDED
    if (item.status === 'ACTION_PLAN' || item.status === 'CONCLUDED') {
      const planStatus = item.status === 'CONCLUDED' ? 'COMPLETED' as const : 'IN_PROGRESS' as const;
      await prisma.actionPlan.create({
        data: {
          reportId: report.id,
          title: `Plano de Ação Corretiva - ${item.title.substring(0, 40)}`,
          description: 'Adoção de medidas de orientação, reciclagem de equipe e revisão de procedimentos operacionais padrão.',
          responsibleUserId: userInvestigator.id,
          responsibleName: userInvestigator.name,
          dueDate: new Date(createdAt.getTime() + 10 * 24 * 60 * 60 * 1000),
          status: planStatus,
          createdByUserId: adminUser.id,
          createdAt,
          completedAt: planStatus === 'COMPLETED' ? new Date(createdAt.getTime() + 4 * 24 * 60 * 60 * 1000) : null,
        },
      });
    }

    // Criar Mensagem Pública
    await prisma.publicMessage.create({
      data: {
        reportId: report.id,
        senderType: 'ADMIN',
        senderUserId: adminUser.id,
        content: `Sua manifestação sob protocolo ${protocol} foi recebida e registrada com sucesso no sistema de integridade do Grupo Bairral.`,
        createdAt,
      },
    });
  }

  // 7. Logs de Auditoria
  const auditActions = [
    { action: 'LOGIN_SUCCESS', entity: 'User', details: { message: 'Login realizado com sucesso' } },
    { action: 'VIEW_REPORT', entity: 'Report', details: { message: 'Consulta a detalhes de manifestação' } },
    { action: 'UPDATE_STATUS', entity: 'Report', details: { message: 'Alteração de status do caso para Em Apuração' } },
    { action: 'CREATE_ACTION_PLAN', entity: 'ActionPlan', details: { message: 'Criação de plano de ação preventivo' } },
  ];

  for (let i = 0; i < auditActions.length; i++) {
    const act = auditActions[i];
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: act.action,
        entity: act.entity,
        details: act.details,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - i * 3600000 * 6),
      },
    });
  }

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
