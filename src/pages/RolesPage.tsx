import { useState } from 'react';
import { Shield, Plus, Check, Edit2, Info, Lock } from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useRoles } from '../hooks/useUsers';
import { Role, AdminPermission } from '../types';

const ALL_PERMISSIONS_LIST: { id: AdminPermission; label: string; group: string }[] = [
  { id: AdminPermissionEnum.VIEW_REPORTS, label: 'Visualizar Lista de Manifestações', group: 'Manifestações' },
  { id: AdminPermissionEnum.VIEW_SENSITIVE_REPORTS, label: 'Acessar Manifestações Confidenciais/Críticas', group: 'Manifestações' },
  { id: AdminPermissionEnum.CLASSIFY_REPORT, label: 'Classificar e Triar Demandas', group: 'Investigação' },
  { id: AdminPermissionEnum.ASSIGN_RESPONSIBLE, label: 'Atribuir/Transferir Responsáveis', group: 'Investigação' },
  { id: AdminPermissionEnum.CHANGE_STATUS, label: 'Alterar Status da Manifestação', group: 'Investigação' },
  { id: AdminPermissionEnum.CHANGE_RISK_PRIORITY, label: 'Alterar Risco e Prioridade', group: 'Investigação' },
  { id: AdminPermissionEnum.REQUEST_INFO, label: 'Solicitar Informação ao Manifestante', group: 'Comunicação' },
  { id: AdminPermissionEnum.SEND_PUBLIC_MESSAGE, label: 'Enviar Mensagens Públicas', group: 'Comunicação' },
  { id: AdminPermissionEnum.ADD_INTERNAL_COMMENT, label: 'Adicionar Comentários Internos Secundários', group: 'Comunicação' },
  { id: AdminPermissionEnum.CREATE_ACTION_PLAN, label: 'Criar e Validar Planos de Ação', group: 'Planos de Ação' },
  { id: AdminPermissionEnum.MANAGE_ACTION_PLANS, label: 'Gerenciar Todos os Planos de Ação', group: 'Planos de Ação' },
  { id: AdminPermissionEnum.RESTRICT_ACCESS, label: 'Restringir Acesso e Conflito de Interesses', group: 'Segurança' },
  { id: AdminPermissionEnum.MANAGE_USERS, label: 'Gerenciar Usuários', group: 'Administração' },
  { id: AdminPermissionEnum.MANAGE_ROLES, label: 'Gerenciar Perfis e Permissões', group: 'Administração' },
  { id: AdminPermissionEnum.MANAGE_CATEGORIES, label: 'Gerenciar Categorias e SLAs', group: 'Administração' },
  { id: AdminPermissionEnum.MANAGE_UNITS, label: 'Gerenciar Unidades e Departamentos', group: 'Administração' },
  { id: AdminPermissionEnum.VIEW_AUDIT_LOGS, label: 'Consultar Logs de Auditoria', group: 'Auditoria' },
  { id: AdminPermissionEnum.MANAGE_SETTINGS, label: 'Alterar Configurações do Sistema', group: 'Administração' },
];

export function RolesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as AdminPermission[],
  });

  const { roles = [], isLoading, createRole, updateRole } = useRoles();

  const handleOpenCreate = () => {
    setRoleForm({
      name: '',
      description: '',
      permissions: [AdminPermissionEnum.VIEW_REPORTS],
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRole(roleForm as any);
    setIsCreateModalOpen(false);
  };


  const handleOpenEdit = (role: Role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions as any,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    await updateRole({
      id: selectedRole.id,
      data: roleForm as any,
    });
    setIsEditModalOpen(false);
  };


  const togglePermission = (permId: AdminPermission) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permId);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== permId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permId] };
      }
    });
  };

  // Agrupar permissões por módulo
  const permissionGroups = Array.from(new Set(ALL_PERMISSIONS_LIST.map((p) => p.group)));

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Perfis e Matriz de Permissões</Typography>
          <p className="text-xs text-[#737373]">
            Controle de acesso granular baseado em perfis (RBAC) para conformidade com a LGPD e Governança
          </p>
        </div>
        <PermissionGate permission={AdminPermissionEnum.MANAGE_ROLES}>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
            Novo Perfil
          </Button>
        </PermissionGate>
      </div>

      {/* Grid de Perfis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Surface key={role.id} variant="card" className="space-y-3 flex flex-col justify-between border border-[#E5E5E5]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#004B87]" />
                  {role.name}
                </span>
                {role.isSystemRole && (
                  <Badge variant="secondary" size="sm">
                    Sistema
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#525252] min-h-[36px]">{role.description}</p>
            </div>

            <div className="pt-3 border-t border-[#F5F5F5] flex items-center justify-between text-xs text-[#737373]">
              <span>{role.permissions.length} permissões ativas</span>
              <PermissionGate permission={AdminPermissionEnum.MANAGE_ROLES}>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenEdit(role)}
                  disabled={role.isSystemRole}
                >
                  Editar
                </Button>
              </PermissionGate>
            </div>
          </Surface>
        ))}
      </div>

      {/* Matriz Completa de Permissões */}
      <Surface variant="card" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Matriz de Controle de Permissões</h3>
            <p className="text-xs text-[#737373]">Visualização comparativa de acessos por perfil funcional</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#525252] text-[10px] uppercase font-bold">
                <th className="p-3 min-w-[240px]">Funcionalidade / Ação</th>
                {roles.map((r) => (
                  <th key={r.id} className="p-3 text-center min-w-[120px]">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {ALL_PERMISSIONS_LIST.map((perm) => (
                <tr key={perm.id} className="hover:bg-[#FAFAFA]">
                  <td className="p-3">
                    <span className="font-medium text-[#0A0A0A] block">{perm.label}</span>
                    <span className="text-[10px] text-[#737373]">{perm.group}</span>
                  </td>
                  {roles.map((r) => {
                    const hasPerm = (r.permissions as string[]).includes(perm.id);
                    return (
                      <td key={r.id} className="p-3 text-center">
                        {hasPerm ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF7F1] text-[#107C41]">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-[#E5E5E5]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      {/* Modal: Criar / Editar Perfil */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">
                {isCreateModalOpen ? 'Criar Novo Perfil' : `Editar Perfil: ${selectedRole?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={isCreateModalOpen ? handleCreateSubmit : handleEditSubmit}
              className="space-y-4 text-xs"
            >
              <FormField>
                <FormLabel>Nome do Perfil</FormLabel>
                <Input
                  required
                  placeholder="Ex: Auditor Externo"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Descrição de Atribuições</FormLabel>
                <textarea
                  required
                  rows={2}
                  placeholder="Descreva as responsabilidades operacionais deste perfil..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <div className="space-y-3 border-t border-[#E5E5E5] pt-3">
                <FormLabel>Permissões Concedidas</FormLabel>

                {permissionGroups.map((group) => (
                  <div key={group} className="space-y-1.5 bg-[#FAFAFA] p-3 rounded border border-[#F5F5F5]">
                    <span className="font-bold text-[#004B87] uppercase text-[10px] tracking-wider block">
                      {group}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ALL_PERMISSIONS_LIST.filter((p) => p.group === group).map((perm) => {
                        const checked = roleForm.permissions.includes(perm.id);
                        return (
                          <label key={perm.id} className="flex items-start gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-0.5 rounded border-[#D4D4D4] text-[#004B87] focus:ring-[#004B87]"
                            />
                            <span className={checked ? 'font-semibold text-[#0A0A0A]' : 'text-[#525252]'}>
                              {perm.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Perfil
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}
    </div>
  );
}
