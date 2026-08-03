import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

const INITIAL_ROLES = [
  {
    id: 'role-superadmin',
    code: 'SUPER_ADMIN',
    name: 'Superadministrador',
    description: 'Acesso total e irrestrito a todas as funcionalidades e configurações',
    isSystemRole: true,
  },
  {
    id: 'role-ethics-manager',
    code: 'ETHICS_MANAGER',
    name: 'Gestor de Ética',
    description: 'Gestão executiva, apuração de casos e condução das reuniões do comitê',
    isSystemRole: true,
  },
  {
    id: 'role-triage-analyst',
    code: 'TRIAGE_ANALYST',
    name: 'Analista de Triagem',
    description: 'Triagem inicial, validação de admissibilidade e encaminhamento de casos',
    isSystemRole: false,
  },
  {
    id: 'role-investigator',
    code: 'INVESTIGATOR',
    name: 'Investigador',
    description: 'Condução de investigações internas, coleta de evidências e elaboração de pareceres',
    isSystemRole: false,
  },
  {
    id: 'role-area-manager',
    code: 'AREA_MANAGER',
    name: 'Responsável por Área',
    description: 'Execução e acompanhamento dos planos de ação recomendados para sua unidade',
    isSystemRole: false,
  },
  {
    id: 'role-auditor',
    code: 'AUDITOR',
    name: 'Auditor',
    description: 'Acompanhamento do cumprimento de prazos, conformidade e auditoria de acessos',
    isSystemRole: false,
  },
  {
    id: 'role-executive-viewer',
    code: 'EXECUTIVE_VIEWER',
    name: 'Visualizador Executivo',
    description: 'Acesso a relatórios gerenciais e dashboards de integridade sem dados de identificação',
    isSystemRole: false,
  },
];

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const roles = await this.prisma.role.findMany({
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      if (roles.length > 0) {
        return roles;
      }
    } catch {
      // Fallback
    }
    return INITIAL_ROLES;
  }

  async findOne(id: string) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      });
      if (role) return role;
    } catch {
      // Fallback
    }
    const fallbackRole = INITIAL_ROLES.find((r) => r.id === id || r.code === id);
    if (!fallbackRole) {
      throw new NotFoundException('Perfil de acesso não encontrado');
    }
    return fallbackRole;
  }

  async create(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description || null,
      },
    });
  }
}
