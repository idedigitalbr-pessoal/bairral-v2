import { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Shield,
  Building,
  Mail,
  MoreHorizontal,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useUsers, useRoles } from '../hooks/useUsers';
import { useUnits } from '../hooks/useUnits';
import { useDepartments } from '../hooks/useDepartments';
import { User } from '../types';

import { ExportButton } from '../components/ui/ExportButton';

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    roleId: '',
    unitId: '',
    departmentId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    roleId: '',
    unitId: '',
    departmentId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  });

  // Hooks
  const { users = [], isLoading, createUser, updateUser, toggleUserStatus } = useUsers(searchTerm);
  const { roles = [] } = useRoles();
  const { units = [] } = useUnits();
  const { departments = [] } = useDepartments(createForm.unitId || editForm.unitId);

  const filteredUsers = users.filter((u) => {
    if (roleFilter && u.roleId !== roleFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    return true;
  });

  const exportHeaders = ['Nome', 'E-mail Institucional', 'Perfil / Função', 'Unidade / Depto', 'Status', 'Data de Cadastro'];
  const exportRows = filteredUsers.map((u) => [
    u.name,
    u.email,
    u.roleName || 'Sem Perfil',
    `${u.unitName || 'Geral'}${u.departmentName ? ` - ${u.departmentName}` : ''}`,
    u.status === 'ACTIVE' ? 'Ativo' : u.status === 'INACTIVE' ? 'Inativo' : 'Suspenso',
    new Date(u.createdAt).toLocaleDateString('pt-BR'),
  ]);

  // Handlers
  const handleOpenCreate = () => {
    setCreateForm({
      name: '',
      email: '',
      roleId: roles[0]?.id || '',
      unitId: units[0]?.id || '',
      departmentId: '',
      status: 'ACTIVE',
    });
    setIsCreateModalOpen(true);
  };


  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser(createForm);
    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      unitId: user.unitId || '',
      departmentId: user.departmentId || '',
      status: user.status as any,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    await updateUser({
      id: selectedUser.id,
      data: editForm,
    });
    setIsEditModalOpen(false);
  };

  const handleToggleStatus = async (user: User, newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    if (confirm(`Tem certeza que deseja alterar o status do usuário "${user.name}" para ${newStatus}?`)) {
      await toggleUserStatus({ id: user.id, status: newStatus });
    }
  };

  return (

    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Gestão de Usuários</Typography>
          <p className="text-xs text-[#737373]">
            Gerenciamento de operadores, investigadores, gestores e perfis de acesso ao sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            title="Gestão de Usuários"
            subtitle="Listagem de operadores, investigadores e gestores cadastrados"
            filename="usuarios_cadastrados"
            headers={exportHeaders}
            rows={exportRows}
          />
          <PermissionGate permission={AdminPermissionEnum.MANAGE_USERS}>
            <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />} onClick={handleOpenCreate}>
              Novo Usuário
            </Button>
          </PermissionGate>
        </div>
      </div>


      {/* Barra de Busca e Filtros */}
      <Surface variant="card" className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737373]" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#737373]" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-2.5 py-1 focus:outline-none focus:border-[#004B87]"
          >
            <option value="">Todos os Perfis</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-2.5 py-1 focus:outline-none focus:border-[#004B87]"
          >
            <option value="">Todos os Status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="SUSPENDED">Suspenso</option>
          </select>
        </div>
      </Surface>

      {/* Tabela de Usuários */}
      <Surface variant="card" className="p-0 overflow-hidden border border-[#E5E5E5]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#525252] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Usuário</th>
              <th className="p-3">Perfil de Acesso</th>
              <th className="p-3">Unidade / Depto</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#737373]">
                  Carregando usuários...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#737373]">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border border-[#E5E5E5] object-cover"
                      />
                      <div>
                        <span className="font-bold text-[#0A0A0A] block">{user.name}</span>
                        <span className="text-[11px] text-[#737373] flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#EFF6FF] text-[#004B87] font-semibold text-[11px]">
                      <Shield className="w-3 h-3 text-[#004B87]" />
                      {user.roleName || 'Sem perfil'}
                    </span>
                  </td>

                  <td className="p-3 text-[#525252]">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Building className="w-3 h-3 text-[#737373]" />
                      {user.unitName || 'Geral'} {user.departmentName ? `• ${user.departmentName}` : ''}
                    </span>
                  </td>

                  <td className="p-3">
                    <Badge
                      variant={
                        user.status === 'ACTIVE' ? 'success' : user.status === 'SUSPENDED' ? 'danger' : 'secondary'
                      }
                      size="sm"
                    >
                      {user.status === 'ACTIVE' ? 'Ativo' : user.status === 'SUSPENDED' ? 'Suspenso' : 'Inativo'}
                    </Badge>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <PermissionGate permission={AdminPermissionEnum.MANAGE_USERS}>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenEdit(user)}
                        >
                          Editar
                        </Button>
                        {user.status === 'ACTIVE' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#A80000] hover:bg-[#FDE8E8]"
                            onClick={() => handleToggleStatus(user, 'INACTIVE')}
                          >
                            Desativar
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#107C41] hover:bg-[#EDF7F1]"
                            onClick={() => handleToggleStatus(user, 'ACTIVE')}
                          >
                            Ativar
                          </Button>
                        )}
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Surface>

      {/* Modal: Criar Usuário */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Cadastrar Novo Usuário</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormField>
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  required
                  placeholder="Ex: Dra. Mariana Vasconcelos"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Endereço de E-mail Institucional</FormLabel>
                <Input
                  type="email"
                  required
                  placeholder="mariana.vasconcelos@grupobairral.com.br"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>Perfil de Acesso</FormLabel>
                  <select
                    required
                    value={createForm.roleId}
                    onChange={(e) => setCreateForm({ ...createForm, roleId: e.target.value })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField>
                  <FormLabel>Status Inicial</FormLabel>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>Unidade de Lotação</FormLabel>
                  <select
                    value={createForm.unitId}
                    onChange={(e) => setCreateForm({ ...createForm, unitId: e.target.value })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    <option value="">Todas / Corporativo</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField>
                  <FormLabel>Departamento</FormLabel>
                  <select
                    value={createForm.departmentId}
                    onChange={(e) => setCreateForm({ ...createForm, departmentId: e.target.value })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    <option value="">Todos / Não especificado</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Cadastrar Usuário
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}

      {/* Modal: Editar Usuário */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Editar Dados do Usuário</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <FormField>
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>Perfil de Acesso</FormLabel>
                  <select
                    value={editForm.roleId}
                    onChange={(e) => setEditForm({ ...editForm, roleId: e.target.value })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                    <option value="SUSPENDED">Suspenso</option>
                  </select>
                </FormField>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}
    </div>
  );
}
