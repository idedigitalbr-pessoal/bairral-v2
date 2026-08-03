import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const INITIAL_PERMISSIONS = [
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

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const dbPermissions = await this.prisma.permission.findMany({
        orderBy: { code: 'asc' },
      });
      if (dbPermissions.length > 0) {
        return dbPermissions;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PERMISSIONS;
  }
}
