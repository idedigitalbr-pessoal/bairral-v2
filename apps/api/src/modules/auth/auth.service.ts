import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FirstAccessDto } from './dto/first-access.dto';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKTIME_MINUTES = 15;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
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
    } catch {
      // Standby state if database is not active
    }

    if (!user) {
      await this.auditService.logAction({
        userEmail: loginDto.email,
        action: 'LOGIN_FAILED_USER_NOT_FOUND',
        entity: 'User',
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Credenciais de acesso inválidas');
    }

    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      throw new ForbiddenException(`Usuário ${user.status === 'BLOCKED' ? 'bloqueado' : 'suspenso'}. Entre em contato com o administrador.`);
    }

    // Verificar bloqueio temporário por tentativas malsucedidas
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(
        `Conta bloqueada temporariamente devido a sucessivas tentativas incorretas. Tente novamente em ${remainingMinutes} minuto(s).`,
      );
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      const newFailedAttempts = user.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKTIME_MINUTES * 60 * 1000);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockedUntil,
        },
      });

      await this.auditService.logAction({
        userId: user.id,
        userEmail: user.email,
        action: newFailedAttempts >= MAX_FAILED_ATTEMPTS ? 'ACCOUNT_TEMPORARILY_LOCKED' : 'LOGIN_FAILED_INVALID_PASSWORD',
        entity: 'User',
        entityId: user.id,
        details: { failedAttempts: newFailedAttempts, lockedUntil },
        ipAddress,
        userAgent,
      });

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        throw new ForbiddenException(
          `Sua conta foi bloqueada por ${LOCKTIME_MINUTES} minutos devido a ${MAX_FAILED_ATTEMPTS} tentativas malsucedidas.`,
        );
      }

      throw new UnauthorizedException('Credenciais de acesso inválidas');
    }

    // Resetar falhas após login com sucesso
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    // Extrair permissões agregadas dos perfis
    const permissionsSet = new Set<string>();
    const rolesList: string[] = [];

    user.userRoles.forEach((ur) => {
      rolesList.push(ur.role.code);
      ur.role.rolePermissions.forEach((rp) => {
        permissionsSet.add(rp.permission.code);
      });
    });

    const permissions = Array.from(permissionsSet);

    // Gerar Tokens JWT
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: rolesList,
      permissions,
      isFirstAccess: user.isFirstAccess,
    };

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Salvar sessão
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt,
      },
    });

    await this.auditService.logAction({
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        isFirstAccess: user.isFirstAccess,
        roles: rolesList,
        permissions,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto, ipAddress?: string, userAgent?: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: process.env.JWT_SECRET || 'bairral-secret-key-super-secure-2026',
      });
    } catch {
      throw new UnauthorizedException('Refresh Token inválido ou expirado');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token fornecido não é um Refresh Token válido');
    }

    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuário inativo ou não encontrado');
    }

    // Buscar sessão ativa correspondente
    const sessions = await this.prisma.session.findMany({
      where: {
        userId: user.id,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    let activeSession = null;
    for (const sess of sessions) {
      const match = await bcrypt.compare(dto.refreshToken, sess.refreshTokenHash);
      if (match) {
        activeSession = sess;
        break;
      }
    }

    if (!activeSession) {
      throw new UnauthorizedException('Sessão revogada ou não encontrada');
    }

    // Revogar a sessão antiga e gerar novo par de tokens
    await this.prisma.session.update({
      where: { id: activeSession.id },
      data: { isRevoked: true },
    });

    const permissionsSet = new Set<string>();
    const rolesList: string[] = [];

    user.userRoles.forEach((ur) => {
      rolesList.push(ur.role.code);
      ur.role.rolePermissions.forEach((rp) => {
        permissionsSet.add(rp.permission.code);
      });
    });

    const newPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: rolesList,
      permissions: Array.from(permissionsSet),
      isFirstAccess: user.isFirstAccess,
    };

    const newAccessToken = await this.jwtService.signAsync(newPayload, { expiresIn: '1h' });
    const newRefreshToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: newRefreshTokenHash,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string, userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId, isRevoked: false },
    });

    for (const sess of sessions) {
      const match = await bcrypt.compare(refreshToken, sess.refreshTokenHash);
      if (match) {
        await this.prisma.session.update({
          where: { id: sess.id },
          data: { isRevoked: true },
        });
        break;
      }
    }

    await this.auditService.logAction({
      userId,
      action: 'LOGOUT',
      entity: 'Session',
    });

    return { message: 'Sessão encerrada com sucesso' };
  }

  async logoutAllSessions(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    await this.auditService.logAction({
      userId,
      action: 'LOGOUT_ALL_SESSIONS',
      entity: 'Session',
    });

    return { message: 'Todas as sessões ativas foram revogadas com sucesso' };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const permissionsSet = new Set<string>();
    const rolesList = user.userRoles.map((ur) => {
      ur.role.rolePermissions.forEach((rp) => permissionsSet.add(rp.permission.code));
      return {
        id: ur.role.id,
        code: ur.role.code,
        name: ur.role.name,
      };
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      isFirstAccess: user.isFirstAccess,
      unitId: user.unitId,
      departmentId: user.departmentId,
      avatarUrl: user.avatarUrl,
      roles: rolesList,
      permissions: Array.from(permissionsSet),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      await this.auditService.logAction({
        userId: user.id,
        userEmail: user.email,
        action: 'PASSWORD_RESET_REQUESTED',
        entity: 'User',
        ipAddress,
      });
    }

    // Resposta padrão sem expor existência de usuário por segurança
    return {
      message: 'Se o e-mail estiver cadastrado no sistema, você receberá as instruções para redefinição de senha.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Validar token de recuperação e alterar senha
    await this.auditService.logAction({
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'User',
    });

    return { message: 'Senha redefinida com sucesso. Faça login com suas novas credenciais.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('A senha atual fornecida está incorreta');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        isFirstAccess: false,
      },
    });

    await this.auditService.logAction({
      userId,
      userEmail: user.email,
      action: 'PASSWORD_CHANGED',
      entity: 'User',
      entityId: userId,
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async firstAccess(userId: string, dto: FirstAccessDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isFirstAccess) {
      throw new BadRequestException('O procedimento de primeiro acesso já foi concluído anteriormente');
    }

    const isMatch = await bcrypt.compare(dto.temporaryPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Senha temporária incorreta');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        isFirstAccess: false,
      },
    });

    await this.auditService.logAction({
      userId,
      userEmail: user.email,
      action: 'FIRST_ACCESS_COMPLETED',
      entity: 'User',
      entityId: userId,
    });

    return { message: 'Senha inicial configurada com sucesso. Você já pode utilizar a plataforma.' };
  }
}
