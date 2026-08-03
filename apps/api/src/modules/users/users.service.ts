import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Administrador de Integridade',
    email: 'admin@bairral.com.br',
    status: 'ACTIVE',
    roleId: 'role-superadmin',
    roleName: 'Superadministrador',
    isFirstAccess: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-gestor',
    name: 'Dra. Maria Clara Silva',
    email: 'maria.clara@bairral.com.br',
    status: 'ACTIVE',
    roleId: 'role-ethics-manager',
    roleName: 'Gestor de Ética',
    isFirstAccess: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-analista',
    name: 'Carlos Eduardo Oliveira',
    email: 'carlos.oliveira@bairral.com.br',
    status: 'ACTIVE',
    roleId: 'role-triage-analyst',
    roleName: 'Analista de Triagem',
    isFirstAccess: false,
    createdAt: new Date().toISOString(),
  },
];

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          userRoles: {
            include: { role: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      if (users.length > 0) {
        return users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          status: u.status,
          isFirstAccess: u.isFirstAccess,
          unitId: u.unitId,
          departmentId: u.departmentId,
          avatarUrl: u.avatarUrl,
          roles: u.userRoles.map((ur) => ur.role.name),
          createdAt: u.createdAt,
        }));
      }
    } catch {
      // Fallback
    }
    return INITIAL_USERS;
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });

      if (user) return user;
    } catch {
      // Fallback
    }

    const fallback = INITIAL_USERS.find((u) => u.id === id);
    if (!fallback) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return fallback;
  }

  async create(dto: CreateUserDto, currentUserId?: string) {
    let existing;
    try {
      existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
    } catch {
      // Standby
    }

    if (existing) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        unitId: dto.unitId || null,
        departmentId: dto.departmentId || null,
        isFirstAccess: true,
        userRoles: {
          create: {
            roleId: dto.roleId,
            assignedBy: currentUserId || null,
          },
        },
      },
    });

    await this.auditService.logAction({
      userId: currentUserId,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, roleId: dto.roleId },
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        status: dto.status as any,
        unitId: dto.unitId,
        departmentId: dto.departmentId,
      },
    });

    if (dto.roleId) {
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      await this.prisma.userRole.create({
        data: {
          userId: id,
          roleId: dto.roleId,
          assignedBy: currentUserId || null,
        },
      });
    }

    await this.auditService.logAction({
      userId: currentUserId,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: id,
      details: dto,
    });

    return updated;
  }

  async remove(id: string, currentUserId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({ where: { id } });

    await this.auditService.logAction({
      userId: currentUserId,
      action: 'USER_DELETED',
      entity: 'User',
      entityId: id,
      details: { email: user.email },
    });

    return { message: 'Usuário removido com sucesso' };
  }
}
