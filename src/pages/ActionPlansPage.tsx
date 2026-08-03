import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  Edit2,
  Eye,
  ShieldAlert,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { StatusBadge } from '../components/data-display/StatusBadge';
import { Badge } from '../components/data-display/Badge';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useActionPlans } from '../hooks/useActionPlans';
import { useUsers } from '../hooks/useUsers';
import { useReports } from '../hooks/useReports';
import { ActionPlanExtended } from '../services/actionPlansService';

import { ExportButton } from '../components/ui/ExportButton';

export function ActionPlansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'lista'>('cards');

  // Modais State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlanExtended | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);

  // Form State
  const [createForm, setCreateForm] = useState({
    reportId: '',
    title: '',
    description: '',
    responsibleId: '',
    dueDate: '',
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    responsibleId: '',
    status: 'IN_PROGRESS' as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    progressPercentage: 0,
    dueDate: '',
  });

  const [validationForm, setValidationForm] = useState({
    status: 'COMPLETED' as 'COMPLETED' | 'CANCELLED',
    validationNotes: '',
  });

  const [evidenceFile, setEvidenceFile] = useState('');

  // Hooks
  const { data: plans = [], isLoading, createActionPlan, updateActionPlan, validateActionPlan } = useActionPlans({
    status: statusFilter,
    search: searchTerm,
  });

  const { users = [] } = useUsers();
  const { data: reportsData } = useReports();
  const reports = reportsData?.data || [];

  // Metrics
  const totalCount = plans.length;
  const inProgressCount = plans.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'NOT_STARTED').length;
  const completedCount = plans.filter((p) => p.status === 'COMPLETED').length;
  const overdueCount = plans.filter((p) => p.daysOverdue && p.daysOverdue > 0 && p.status !== 'COMPLETED').length;

  const exportHeaders = ['Protocolo', 'Título do Plano', 'Responsável', 'Status', 'Progresso (%)', 'Data Limite'];
  const exportRows = plans.map((p) => [
    p.reportProtocol || 'N/D',
    p.title,
    p.responsibleName,
    p.status === 'COMPLETED'
      ? 'Concluído'
      : p.status === 'IN_PROGRESS'
      ? 'Em Andamento'
      : p.status === 'CANCELLED'
      ? 'Cancelado'
      : 'Não Iniciado',
    `${p.progressPercentage}%`,
    p.dueDate ? new Date(p.dueDate).toLocaleDateString('pt-BR') : 'N/D',
  ]);

  // Handlers
  const handleOpenCreate = () => {
    setCreateForm({
      reportId: reports[0]?.id || '',
      title: '',
      description: '',
      responsibleId: users[0]?.id || '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
    setIsCreateModalOpen(true);
  };


  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const respUser = users.find((u) => u.id === createForm.responsibleId);
    await createActionPlan({
      reportId: createForm.reportId,
      title: createForm.title,
      description: createForm.description,
      responsibleId: createForm.responsibleId,
      responsibleName: respUser?.name || 'Responsável',
      dueDate: new Date(createForm.dueDate).toISOString(),
    });
    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (plan: ActionPlanExtended) => {
    setSelectedPlan(plan);
    setEditForm({
      title: plan.title,
      description: plan.description,
      responsibleId: plan.responsibleId,
      status: plan.status as any,
      progressPercentage: plan.progressPercentage,
      dueDate: plan.dueDate ? new Date(plan.dueDate).toISOString().split('T')[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const respUser = users.find((u) => u.id === editForm.responsibleId);
    await updateActionPlan({
      id: selectedPlan.id,
      data: {
        title: editForm.title,
        description: editForm.description,
        responsibleId: editForm.responsibleId,
        responsibleName: respUser?.name || selectedPlan.responsibleName,
        status: editForm.status,
        progressPercentage: Number(editForm.progressPercentage),
        dueDate: new Date(editForm.dueDate).toISOString(),
      },
    });
    setIsEditModalOpen(false);
  };

  const handleOpenValidate = (plan: ActionPlanExtended) => {
    setSelectedPlan(plan);
    setValidationForm({
      status: 'COMPLETED',
      validationNotes: '',
    });
    setIsValidateModalOpen(true);
  };

  const handleValidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    await validateActionPlan({
      id: selectedPlan.id,
      validation: {
        status: validationForm.status,
        validationNotes: validationForm.validationNotes,
      },
    });
    setIsValidateModalOpen(false);
  };

  const handleAddEvidence = async () => {
    if (!selectedPlan || !evidenceFile.trim()) return;
    const currentEvidences = selectedPlan.evidences || [];
    const newEv = {
      id: `ev-${Date.now()}`,
      name: evidenceFile.trim(),
      url: '#',
      uploadedAt: new Date().toISOString(),
    };
    await updateActionPlan({
      id: selectedPlan.id,
      data: {
        evidences: [...currentEvidences, newEv],
      },
    });
    setSelectedPlan({
      ...selectedPlan,
      evidences: [...currentEvidences, newEv],
    });
    setEvidenceFile('');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Planos de Ação Corretivos</Typography>
          <p className="text-xs text-[#737373]">
            Gestão de medidas corretivas, tarefas operacionais e validação de resolutividade
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            title="Planos de Ação Corretivos"
            subtitle="Gestão de medidas corretivas e tarefas operacionais"
            filename="planos_de_acao"
            headers={exportHeaders}
            rows={exportRows}
          />
          <PermissionGate permission={AdminPermissionEnum.CREATE_ACTION_PLAN}>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
              Novo Plano de Ação
            </Button>
          </PermissionGate>
        </div>
      </div>


      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Surface variant="card" className="space-y-1">
          <span className="text-[11px] font-medium text-[#737373]">Total de Planos</span>
          <p className="text-xl font-bold font-heading text-[#0A0A0A]">{totalCount}</p>
        </Surface>
        <Surface variant="card" className="space-y-1">
          <span className="text-[11px] font-medium text-[#737373]">Em Andamento</span>
          <p className="text-xl font-bold font-heading text-[#004B87]">{inProgressCount}</p>
        </Surface>
        <Surface variant="card" className="space-y-1">
          <span className="text-[11px] font-medium text-[#737373]">Concluídos / Validados</span>
          <p className="text-xl font-bold font-heading text-[#107C41]">{completedCount}</p>
        </Surface>
        <Surface variant="card" className="space-y-1">
          <span className="text-[11px] font-medium text-[#737373]">Prazos Atrasados</span>
          <p className="text-xl font-bold font-heading text-[#A80000]">{overdueCount}</p>
        </Surface>
      </div>

      {/* Barra de Filtros + Seletor de Modo de Exibição */}
      <Surface variant="card" className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-3 items-center flex-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737373]" />
            <input
              type="text"
              placeholder="Buscar por título, protocolo ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#737373] shrink-0" />
            <span className="text-xs text-[#737373] shrink-0">Filtrar por Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-2.5 py-1 focus:outline-none focus:border-[#004B87]"
            >
              <option value="ALL">Todos os Status</option>
              <option value="NOT_STARTED">Não Iniciado</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="OVERDUE">Atrasados</option>
            </select>
          </div>
        </div>

        {/* Botões do Modo de Visualização (Cards | Lista) */}
        <div className="flex items-center bg-[#F5F5F5] p-1 rounded-lg border border-[#E5E5E5] self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-[#171717] shadow-sm font-bold'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('lista')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'lista'
                ? 'bg-white text-[#171717] shadow-sm font-bold'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Lista</span>
          </button>
        </div>
      </Surface>

      {/* Exibição de Planos de Ação (Cards ou Lista) */}
      {isLoading ? (
        <Surface variant="card" className="p-8 text-center text-xs text-[#737373]">
          Carregando planos de ação...
        </Surface>
      ) : plans.length === 0 ? (
        <Surface variant="card" className="p-8 text-center space-y-2">
          <CheckSquare className="w-8 h-8 mx-auto text-[#A3A3A3]" />
          <p className="text-xs font-bold text-[#171717]">Nenhum plano de ação encontrado</p>
          <p className="text-xs text-[#737373]">Ajuste os filtros de busca ou cadastre um novo plano de ação.</p>
        </Surface>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isOverdue = plan.daysOverdue && plan.daysOverdue > 0 && plan.status !== 'COMPLETED';
            return (
              <Surface
                key={plan.id}
                variant="card"
                className="space-y-4 border border-[#E5E5E5] hover:border-[#FDC503] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#F5F5F5] pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold bg-[#F5F5F5] border border-[#E5E5E5] px-2 py-0.5 rounded text-[#004B87]">
                        {plan.reportProtocol || 'Sem protocolo'}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#FDE8E8] text-[#A80000] font-bold px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Atrasado ({plan.daysOverdue}d)
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs text-[#0A0A0A] line-clamp-1">{plan.title}</h4>
                  </div>
                  <Badge
                    variant={
                      plan.status === 'COMPLETED'
                        ? 'success'
                        : plan.status === 'IN_PROGRESS'
                        ? 'info'
                        : plan.status === 'CANCELLED'
                        ? 'danger'
                        : 'secondary'
                    }
                    size="sm"
                  >
                    {plan.status === 'COMPLETED'
                      ? 'Concluído'
                      : plan.status === 'IN_PROGRESS'
                      ? 'Em Andamento'
                      : plan.status === 'CANCELLED'
                      ? 'Cancelado'
                      : 'Não Iniciado'}
                  </Badge>
                </div>

                <p className="text-xs text-[#525252] line-clamp-2">{plan.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#737373] bg-[#FAFAFA] p-2.5 rounded">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#004B87]" />
                    <span className="truncate">{plan.responsibleName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#737373]" />
                    <span>Prazo: {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString('pt-BR') : 'N/D'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#737373]">
                    <span>Progresso de Execução</span>
                    <span className="font-bold text-[#0A0A0A]">{plan.progressPercentage}%</span>
                  </div>
                  <Progress
                    value={plan.progressPercentage}
                    variant={plan.status === 'COMPLETED' ? 'success' : isOverdue ? 'danger' : 'yellow'}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F5F5F5]">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    Detalhes
                  </Button>
                  <PermissionGate permission={AdminPermissionEnum.CREATE_ACTION_PLAN}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEdit(plan)}
                    >
                      Editar
                    </Button>
                    {plan.status !== 'COMPLETED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenValidate(plan)}
                      >
                        Validar
                      </Button>
                    )}
                  </PermissionGate>
                </div>
              </Surface>
            );
          })}
        </div>
      ) : (
        /* Visualização em Lista / Tabela */
        <Surface variant="card" className="p-0 overflow-hidden border border-[#E5E5E5]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-[#737373] font-semibold">
                  <th className="py-3 px-4">Protocolo</th>
                  <th className="py-3 px-4">Título do Plano</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 min-w-[140px]">Progresso</th>
                  <th className="py-3 px-4">Prazo</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {plans.map((plan) => {
                  const isOverdue = plan.daysOverdue && plan.daysOverdue > 0 && plan.status !== 'COMPLETED';
                  return (
                    <tr key={plan.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] font-bold bg-[#F5F5F5] border border-[#E5E5E5] px-2 py-0.5 rounded text-[#004B87]">
                          {plan.reportProtocol || 'Sem protocolo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0A0A0A] line-clamp-1">{plan.title}</div>
                        <div className="text-[11px] text-[#737373] line-clamp-1">{plan.description}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[#262626]">
                        {plan.responsibleName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              plan.status === 'COMPLETED'
                                ? 'success'
                                : plan.status === 'IN_PROGRESS'
                                ? 'info'
                                : plan.status === 'CANCELLED'
                                ? 'danger'
                                : 'secondary'
                            }
                            size="sm"
                          >
                            {plan.status === 'COMPLETED'
                              ? 'Concluído'
                              : plan.status === 'IN_PROGRESS'
                              ? 'Em Andamento'
                              : plan.status === 'CANCELLED'
                              ? 'Cancelado'
                              : 'Não Iniciado'}
                          </Badge>
                          {isOverdue && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#FDE8E8] text-[#A80000] font-bold px-1.5 py-0.5 rounded" title={`Atrasado há ${plan.daysOverdue} dias`}>
                              <AlertTriangle className="w-3 h-3" /> {plan.daysOverdue}d
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="w-full max-w-[120px] space-y-1">
                          <div className="flex justify-between text-[10px] text-[#737373]">
                            <span>{plan.progressPercentage}%</span>
                          </div>
                          <Progress
                            value={plan.progressPercentage}
                            variant={plan.status === 'COMPLETED' ? 'success' : isOverdue ? 'danger' : 'yellow'}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-[#525252]">
                        {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString('pt-BR') : 'N/D'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto text-[11px]"
                            leftIcon={<Eye className="w-3 h-3" />}
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            Detalhes
                          </Button>
                          <PermissionGate permission={AdminPermissionEnum.CREATE_ACTION_PLAN}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2 py-1 h-auto text-[11px]"
                              leftIcon={<Edit2 className="w-3 h-3" />}
                              onClick={() => handleOpenEdit(plan)}
                            >
                              Editar
                            </Button>
                            {plan.status !== 'COMPLETED' && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="px-2 py-1 h-auto text-[11px]"
                                leftIcon={<CheckCircle2 className="w-3 h-3" />}
                                onClick={() => handleOpenValidate(plan)}
                              >
                                Validar
                              </Button>
                            )}
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Surface>
      )}

      {/* Modal: Criar Plano de Ação */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Novo Plano de Ação Corretivo</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormField>
                <FormLabel>Vincular a uma Manifestação</FormLabel>
                <select
                  value={createForm.reportId}
                  onChange={(e) => setCreateForm({ ...createForm, reportId: e.target.value })}
                  className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                >
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.protocol}] {r.title}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField>
                <FormLabel>Título do Plano de Ação</FormLabel>
                <Input
                  required
                  placeholder="Ex: Treinamento de reciclagem da equipe noturna"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Descrição Detalhada das Medidas</FormLabel>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva as etapas, recursos necessários e objetivos operacionais..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>Responsável pela Execução</FormLabel>
                  <select
                    value={createForm.responsibleId}
                    onChange={(e) => setCreateForm({ ...createForm, responsibleId: e.target.value })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.roleName})
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField>
                  <FormLabel>Data Limite (Prazo)</FormLabel>
                  <Input
                    type="date"
                    required
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                  />
                </FormField>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Cadastrar Plano
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}

      {/* Modal: Editar Plano de Ação */}
      {isEditModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Editar Plano de Ação</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <FormField>
                <FormLabel>Título do Plano</FormLabel>
                <Input
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel>Descrição</FormLabel>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>Status de Andamento</FormLabel>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    <option value="NOT_STARTED">Não Iniciado</option>
                    <option value="IN_PROGRESS">Em Andamento</option>
                    <option value="COMPLETED">Concluído</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </FormField>

                <FormField>
                  <FormLabel>Progresso de Execução (%)</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.progressPercentage}
                    onChange={(e) => setEditForm({ ...editForm, progressPercentage: Number(e.target.value) })}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField>
                  <FormLabel>Responsável</FormLabel>
                  <select
                    value={editForm.responsibleId}
                    onChange={(e) => setEditForm({ ...editForm, responsibleId: e.target.value })}
                    className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField>
                  <FormLabel>Novo Prazo</FormLabel>
                  <Input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  />
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

      {/* Modal: Validar Plano de Ação */}
      {isValidateModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">Validação de Plano de Ação</h3>
              <button
                onClick={() => setIsValidateModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleValidateSubmit} className="space-y-4">
              <p className="text-xs text-[#525252]">
                Plano: <strong>{selectedPlan.title}</strong>
              </p>

              <FormField>
                <FormLabel>Resultado da Validação</FormLabel>
                <select
                  value={validationForm.status}
                  onChange={(e) => setValidationForm({ ...validationForm, status: e.target.value as any })}
                  className="w-full text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 focus:outline-none focus:border-[#004B87]"
                >
                  <option value="COMPLETED">Aprovar e Marcar como Concluído</option>
                  <option value="CANCELLED">Rejeitar e Cancelar Plano</option>
                </select>
              </FormField>

              <FormField>
                <FormLabel>Parecer / Justificativa de Validação (Obrigatório)</FormLabel>
                <textarea
                  required
                  rows={3}
                  placeholder="Informe os critérios de conferência das evidências e eficácia da medida..."
                  value={validationForm.validationNotes}
                  onChange={(e) => setValidationForm({ ...validationForm, validationNotes: e.target.value })}
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsValidateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirmar Validação
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      )}

      {/* Modal: Detalhes do Plano */}
      {isDetailModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Surface variant="card" className="w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#004B87]">
                  {selectedPlan.reportProtocol || 'Geral'}
                </span>
                <h3 className="font-heading font-bold text-sm text-[#0A0A0A]">{selectedPlan.title}</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-[#737373] hover:text-[#0A0A0A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-[#737373]">Descrição das Medidas:</span>
                <p className="mt-1 text-[#262626] bg-[#FAFAFA] p-2.5 rounded border border-[#F5F5F5]">
                  {selectedPlan.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[#525252]">
                <div>
                  <strong>Responsável:</strong> {selectedPlan.responsibleName}
                </div>
                <div>
                  <strong>Prazo:</strong>{' '}
                  {selectedPlan.dueDate ? new Date(selectedPlan.dueDate).toLocaleDateString('pt-BR') : 'N/D'}
                </div>
              </div>

              <div>
                <strong>Progresso de Execução:</strong> {selectedPlan.progressPercentage}%
                <Progress value={selectedPlan.progressPercentage} variant="yellow" className="mt-1" />
              </div>

              {(selectedPlan as any).validationNotes && (
                <div className="bg-[#F0FDF4] p-3 rounded border border-[#DCFCE7] text-[#166534]">
                  <strong>Parecer de Validação:</strong>
                  <p className="mt-1 text-[11px]">{(selectedPlan as any).validationNotes}</p>
                </div>
              )}

              {/* Seção de Evidências Anexadas */}
              <div className="border-t border-[#E5E5E5] pt-3 space-y-2">
                <h4 className="font-bold text-[#0A0A0A] text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#004B87]" /> Evidências e Comprovantes de Execução
                </h4>

                {selectedPlan.evidences && selectedPlan.evidences.length > 0 ? (
                  <div className="space-y-1">
                    {selectedPlan.evidences.map((ev, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#FAFAFA] p-2 rounded text-[11px]">
                        <span className="font-medium text-[#171717]">{ev.name}</span>
                        <span className="text-[#737373]">{new Date(ev.uploadedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#737373] italic">Nenhuma evidência anexada até o momento.</p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Nome do arquivo de evidência (ex: relatorio_treinamento.pdf)"
                    value={evidenceFile}
                    onChange={(e) => setEvidenceFile(e.target.value)}
                    className="text-xs"
                  />
                  <Button variant="outline" size="sm" leftIcon={<Upload className="w-3.5 h-3.5" />} onClick={handleAddEvidence}>
                    Anexar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E5E5E5]">
              <Button variant="ghost" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </Surface>
        </div>
      )}
    </div>
  );
}
