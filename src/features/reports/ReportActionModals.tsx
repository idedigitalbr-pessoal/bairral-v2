import React, { useState } from 'react';
import { Dialog } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Report, ReportTypeEnum, ReportStatusEnum, RiskLevelEnum, PriorityLevelEnum } from '../../types';
import { ActionType } from './ReportHeader';
import { mockUsers, mockCategories, mockUnits, mockDepartments } from '../../mocks/data';
import {
  useUpdateReport,
  useAddPublicMessage,
  useAddInternalComment,
  useAddActionPlan,
  useDeclareConflict,
} from '../../hooks/useReports';

interface ReportActionModalsProps {
  report: Report;
  activeAction: ActionType | null;
  onClose: () => void;
  onShowToast: (title: string, message?: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

export function ReportActionModals({
  report,
  activeAction,
  onClose,
  onShowToast,
}: ReportActionModalsProps) {
  const updateReportMutation = useUpdateReport();
  const addPublicMessageMutation = useAddPublicMessage();
  const addInternalCommentMutation = useAddInternalComment();
  const addActionPlanMutation = useAddActionPlan();
  const declareConflictMutation = useDeclareConflict();

  // State variables for form fields
  const [categoryId, setCategoryId] = useState(report.categoryId);
  const [reportType, setReportType] = useState<ReportTypeEnum>(report.type);
  const [assigneeId, setAssigneeId] = useState(
    report.assignments?.[report.assignments.length - 1]?.assigneeId || mockUsers[0]?.id || ''
  );
  const [assignmentNote, setAssignmentNote] = useState('');
  const [unitId, setUnitId] = useState(report.unitId);
  const [departmentId, setDepartmentId] = useState(report.departmentId || mockDepartments[0]?.id || '');
  const [transferReason, setTransferReason] = useState('');
  const [status, setStatus] = useState<ReportStatusEnum>(report.status);
  const [statusReason, setStatusReason] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevelEnum>(report.riskLevel);
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevelEnum>(report.priorityLevel);
  const [infoRequestText, setInfoRequestText] = useState('');
  const [investigationPlanText, setInvestigationPlanText] = useState('');
  const [internalCommentText, setInternalCommentText] = useState('');
  const [publicMessageText, setPublicMessageText] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planResponsibleId, setPlanResponsibleId] = useState(mockUsers[0]?.id || '');
  const [planDueDate, setPlanDueDate] = useState('');
  const [conclusionReason, setConclusionReason] = useState('');
  const [archiveReason, setArchiveReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [restrictReason, setRestrictReason] = useState('');
  const [conflictReason, setConflictReason] = useState('');

  if (!activeAction) return null;

  const isLoading =
    updateReportMutation.isPending ||
    addPublicMessageMutation.isPending ||
    addInternalCommentMutation.isPending ||
    addActionPlanMutation.isPending ||
    declareConflictMutation.isPending;

  // Handlers for each action
  const handleClassificar = async () => {
    const selectedCat = mockCategories.find((c) => c.id === categoryId);
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        categoryId,
        categoryName: selectedCat ? selectedCat.name : report.categoryName,
        type: reportType,
      },
    });
    onShowToast('Classificação atualizada', 'A categoria e o tipo do protocolo foram reclassificados.', 'success');
    onClose();
  };

  const handleAtribuir = async () => {
    const selectedUser = mockUsers.find((u) => u.id === assigneeId);
    if (!selectedUser) return;

    const newAssignment = {
      id: `asg-${Date.now()}`,
      reportId: report.id,
      assigneeId: selectedUser.id,
      assigneeName: selectedUser.name,
      assignedById: mockUsers[0].id,
      assignedByName: mockUsers[0].name,
      assignedAt: new Date().toISOString(),
      note: assignmentNote || undefined,
    };

    const updatedAssignments = [...(report.assignments || []), newAssignment];

    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        assignments: updatedAssignments,
      },
    });
    onShowToast('Responsável atribuído', `Protocolo atribuído a ${selectedUser.name}.`, 'success');
    onClose();
  };

  const handleTransferir = async () => {
    if (!transferReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Informe a justificativa da transferência.', 'warning');
      return;
    }
    const selectedUnit = mockUnits.find((u) => u.id === unitId);
    const selectedDept = mockDepartments.find((d) => d.id === departmentId);

    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        unitId,
        unitName: selectedUnit ? selectedUnit.name : report.unitName,
        departmentId,
        departmentName: selectedDept ? selectedDept.name : report.departmentName,
        reason: transferReason,
      } as any,
    });
    onShowToast('Transferência realizada', `Manifestação transferida para ${selectedUnit?.name || 'nova unidade'}.`, 'success');
    onClose();
  };

  const handleMudarStatus = async () => {
    if (!statusReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Por favor, informe a justificativa da mudança de status.', 'warning');
      return;
    }
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status,
        reason: statusReason,
      } as any,
    });
    onShowToast('Status alterado', `Status atualizado para ${status}.`, 'success');
    onClose();
  };

  const handleMudarRisco = async () => {
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: { riskLevel },
    });
    onShowToast('Nível de risco alterado', `Grau de risco atualizado para ${riskLevel}.`, 'success');
    onClose();
  };

  const handleMudarPrioridade = async () => {
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: { priorityLevel },
    });
    onShowToast('Prioridade alterada', `Nível de prioridade atualizado para ${priorityLevel}.`, 'success');
    onClose();
  };

  const handleSolicitarInformacao = async () => {
    if (!infoRequestText.trim()) {
      onShowToast('Campo obrigatório', 'Digite a mensagem de solicitação de informação ao manifestante.', 'warning');
      return;
    }
    await addPublicMessageMutation.mutateAsync({
      id: report.id,
      content: infoRequestText,
      senderType: 'COMMITTEE',
    });
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status: ReportStatusEnum.PENDING_INFO,
        reason: 'Solicitação de informações complementares enviada ao manifestante.',
      } as any,
    });
    onShowToast('Informação solicitada', 'Mensagem enviada ao manifestante e status alterado para AGUARDANDO INFORMAÇÕES.', 'success');
    onClose();
  };

  const handleIniciarInvestigacao = async () => {
    if (!investigationPlanText.trim()) {
      onShowToast('Campo obrigatório', 'Informe as diretrizes do plano de apuração/investigação.', 'warning');
      return;
    }
    await addInternalCommentMutation.mutateAsync({
      id: report.id,
      content: `[DIRETRIZES DE INVESTIGAÇÃO]: ${investigationPlanText}`,
    });
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status: ReportStatusEnum.INVESTIGATION,
        reason: 'Fase de investigação e apuração iniciada pelo comitê.',
      } as any,
    });
    onShowToast('Investigação iniciada', 'Status atualizado para EM INVESTIGAÇÃO com registro interno.', 'success');
    onClose();
  };

  const handleAdicionarComentario = async () => {
    if (!internalCommentText.trim()) {
      onShowToast('Campo obrigatório', 'Digite o conteúdo do comentário interno.', 'warning');
      return;
    }
    await addInternalCommentMutation.mutateAsync({
      id: report.id,
      content: internalCommentText,
    });
    onShowToast('Comentário adicionado', 'Nota interna gravada com sigilo absoluto.', 'success');
    onClose();
  };

  const handleEnviarMensagem = async () => {
    if (!publicMessageText.trim()) {
      onShowToast('Campo obrigatório', 'Digite o texto da mensagem pública ao manifestante.', 'warning');
      return;
    }
    await addPublicMessageMutation.mutateAsync({
      id: report.id,
      content: publicMessageText,
      senderType: 'COMMITTEE',
    });
    onShowToast('Mensagem pública enviada', 'Mensagem disponibilizada no acompanhamento do manifestante.', 'success');
    onClose();
  };

  const handleCriarPlanoAcao = async () => {
    if (!planTitle.trim() || !planDesc.trim() || !planDueDate) {
      onShowToast('Campos obrigatórios', 'Preencha o título, descrição e prazo do plano de ação.', 'warning');
      return;
    }
    const selectedResp = mockUsers.find((u) => u.id === planResponsibleId);
    await addActionPlanMutation.mutateAsync({
      id: report.id,
      actionPlan: {
        title: planTitle,
        description: planDesc,
        responsibleId: planResponsibleId,
        responsibleName: selectedResp?.name || mockUsers[0].name,
        dueDate: new Date(planDueDate).toISOString(),
        status: 'NOT_STARTED',
        progressPercentage: 0,
      },
    });
    onShowToast('Plano de ação criado', `Plano "${planTitle}" cadastrado com sucesso.`, 'success');
    onClose();
  };

  const handleConcluir = async () => {
    if (!conclusionReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Informe o parecer conclusivo do comitê.', 'warning');
      return;
    }
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status: ReportStatusEnum.RESOLVED,
        resolvedAt: new Date().toISOString(),
        reason: conclusionReason,
      } as any,
    });
    await addInternalCommentMutation.mutateAsync({
      id: report.id,
      content: `[PARECER CONCLUSIVO]: ${conclusionReason}`,
    });
    onShowToast('Manifestação concluída', 'O caso foi marcado como CONCLUÍDO / RESOLVIDO.', 'success');
    onClose();
  };

  const handleArquivar = async () => {
    if (!archiveReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Informe a justificativa técnica para o arquivamento.', 'warning');
      return;
    }
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status: ReportStatusEnum.ARCHIVED,
        reason: archiveReason,
      } as any,
    });
    await addInternalCommentMutation.mutateAsync({
      id: report.id,
      content: `[ARQUIVAMENTO]: ${archiveReason}`,
    });
    onShowToast('Caso arquivado', 'Manifestação arquivada pelo comitê de ética.', 'info');
    onClose();
  };

  const handleReabrir = async () => {
    if (!reopenReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Informe o motivo da reabertura do protocolo.', 'warning');
      return;
    }
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        status: ReportStatusEnum.REOPENED,
        resolvedAt: undefined,
        reason: reopenReason,
      } as any,
    });
    await addInternalCommentMutation.mutateAsync({
      id: report.id,
      content: `[REABERTURA]: ${reopenReason}`,
    });
    onShowToast('Protocolo reaberto', 'A manifestação foi reaberta para apuração continuada.', 'info');
    onClose();
  };

  const handleRestringirAcesso = async () => {
    if (!restrictReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Informe a justificativa da alteração de sigilo.', 'warning');
      return;
    }
    const newRestrictedState = !report.isRestricted;
    await updateReportMutation.mutateAsync({
      id: report.id,
      updates: {
        isRestricted: newRestrictedState,
        reason: restrictReason,
      } as any,
    });
    onShowToast(
      newRestrictedState ? 'Acesso restrito ativado' : 'Acesso restrito removido',
      newRestrictedState
        ? 'Visualização restrita apenas a administradores e membros do comitê.'
        : 'Restrição de acesso revogada.',
      'warning'
    );
    onClose();
  };

  const handleDeclararConflito = async () => {
    if (!conflictReason.trim()) {
      onShowToast('Justificativa obrigatória', 'Descreva detalhadamente o motivo do conflito de interesse.', 'warning');
      return;
    }
    await declareConflictMutation.mutateAsync({
      id: report.id,
      reason: conflictReason,
    });
    onShowToast('Conflito registrado', 'Declaração de suspeição gravada. O caso foi sinalizado para redistribuição.', 'danger');
    onClose();
  };

  // Render modal content dynamically based on activeAction
  const renderActionContent = () => {
    switch (activeAction) {
      case 'classificar':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Classificar Categoria e Tipo"
            description="Reclassifique o enquadramento desta manifestação."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleClassificar} isLoading={isLoading}>
                  Salvar Classificação
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Categoria Temática
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Tipo de Manifestação
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportTypeEnum)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  {Object.values(ReportTypeEnum).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Dialog>
        );

      case 'atribuir':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Atribuir Responsável ao Caso"
            description="Designe um analista de compliance ou ouvidor para conduzir a apuração."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleAtribuir} isLoading={isLoading}>
                  Atribuir Responsável
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Selecione o Responsável
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  {mockUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Nota / Instruções de Encaminhamento (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  placeholder="Ex: Priorizar levantamento de registros de prontuários..."
                  className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
                />
              </div>
            </div>
          </Dialog>
        );

      case 'transferir':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Transferir para Outra Unidade / Setor"
            description="Encaminhe a gestão do caso para outra unidade operacional ou setor do Grupo Bairral."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleTransferir} isLoading={isLoading}>
                  Confirmar Transferência
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Unidade Destino
                </label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  {mockUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Departamento / Setor
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  {mockDepartments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Justificativa da Transferência <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Informe o motivo técnico da transferência..."
                  className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
                />
              </div>
            </div>
          </Dialog>
        );

      case 'mudar_status':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Alterar Status do Protocolo"
            description="Modifique a fase de apuração deste caso no fluxo de tramitação."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleMudarStatus} isLoading={isLoading}>
                  Atualizar Status
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Novo Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReportStatusEnum)}
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                >
                  {Object.values(ReportStatusEnum).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Justificativa da Alteração <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Descreva a motivação da mudança de status..."
                  className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
                />
              </div>
            </div>
          </Dialog>
        );

      case 'mudar_risco':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Alterar Nível de Risco"
            description="Ajuste o grau de severidade e risco institucional do protocolo."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleMudarRisco} isLoading={isLoading}>
                  Atualizar Risco
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Grau de Risco
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RiskLevelEnum)}
                className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
              >
                {Object.values(RiskLevelEnum).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </Dialog>
        );

      case 'mudar_prioridade':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Alterar Prioridade de Atendimento"
            description="Defina a urgência da apuração deste protocolo."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleMudarPrioridade} isLoading={isLoading}>
                  Atualizar Prioridade
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Prioridade
              </label>
              <select
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value as PriorityLevelEnum)}
                className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
              >
                {Object.values(PriorityLevelEnum).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </Dialog>
        );

      case 'solicitar_informacao':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Solicitar Informações Complementares"
            description="O status do protocolo mudará automaticamente para 'Aguardando Informações'."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleSolicitarInformacao} isLoading={isLoading}>
                  Enviar ao Manifestante
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Mensagem ao Manifestante <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={infoRequestText}
                onChange={(e) => setInfoRequestText(e.target.value)}
                placeholder="Ex: Para prosseguirmos com a apuração, solicitamos gentilmente informar a data precisa ou o nome do setor..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'iniciar_investigacao':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Iniciar Fase de Investigação"
            description="Altera o status para 'Em Investigação' e grava o plano preliminar de apuração."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleIniciarInvestigacao} isLoading={isLoading}>
                  Iniciar Apuração
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Diretrizes e Escopo da Investigação <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={investigationPlanText}
                onChange={(e) => setInvestigationPlanText(e.target.value)}
                placeholder="Descreva as etapas planejadas: oitivas, verificação de registros de acesso, checagem de imagens..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'adicionar_comentario':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Adicionar Comentário Interno Confidential"
            description="Visível estritamente para membros da equipe de integridade. NUNCA exibido ao manifestante."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleAdicionarComentario} isLoading={isLoading}>
                  Salvar Nota Interna
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Nota Interna <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={internalCommentText}
                onChange={(e) => setInternalCommentText(e.target.value)}
                placeholder="Registre impressões, resultados de oitivas e recomendações sigilosas..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'enviar_mensagem':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Enviar Mensagem Pública ao Manifestante"
            description="Esta resposta ficará visível na área de acompanhamento do protocolo do usuário."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleEnviarMensagem} isLoading={isLoading}>
                  Enviar Resposta
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Conteúdo da Mensagem <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={publicMessageText}
                onChange={(e) => setPublicMessageText(e.target.value)}
                placeholder="Agradecemos seu contato. Informamos que a demanda foi recebida..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'criar_plano_acao':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Criar Plano de Ação Medidativo / Corretivo"
            description="Cadastre uma medida com prazo de execução e responsável atribuído."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleCriarPlanoAcao} isLoading={isLoading}>
                  Cadastrar Plano
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Título do Plano <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="Ex: Treinamento da equipe de recepção quanto ao acolhimento"
                  className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Descrição Detalhada <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  placeholder="Descreva as entregas esperadas e diretrizes de acompanhamento..."
                  className="w-full bg-white border border-[#D4D4D4] rounded-md p-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Responsável
                  </label>
                  <select
                    value={planResponsibleId}
                    onChange={(e) => setPlanResponsibleId(e.target.value)}
                    className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                  >
                    {mockUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Prazo Limite <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="date"
                    value={planDueDate}
                    onChange={(e) => setPlanDueDate(e.target.value)}
                    className="w-full bg-white border border-[#D4D4D4] rounded-md px-3 py-2 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none"
                  />
                </div>
              </div>
            </div>
          </Dialog>
        );

      case 'concluir':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Concluir Manifestação"
            description="Encerre a apuração do caso registrando o parecer final conclusivo."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleConcluir} isLoading={isLoading} className="bg-[#166534] hover:bg-[#14532D]">
                  Concluir e Finalizar
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Parecer Conclusivo do Comitê de Ética <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={conclusionReason}
                onChange={(e) => setConclusionReason(e.target.value)}
                placeholder="Descreva a fundamentação técnica do encerramento e os encaminhamentos realizados..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'arquivar':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Arquivar Manifestação"
            description="Esta ação encerrará a tramitação por falta de elementos ou duplicidade."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" onClick={handleArquivar} isLoading={isLoading}>
                  Confirmar Arquivamento
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Justificativa do Arquivamento <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="Ex: Manifestação em duplicidade ao protocolo #GB-2025-000 ou ausência de elementos mínimos para apuração..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'reabrir':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Reabrir Manifestação"
            description="Reinicie a apuração do caso previamente encerrado/arquivado."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleReabrir} isLoading={isLoading}>
                  Confirmar Reabertura
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Motivação da Reabertura <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Ex: Apresentação de novos fatos relevantes pelo relator..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'restringir_acesso':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title={report.isRestricted ? 'Remover Restrição de Acesso' : 'Restringir Acesso ao Protocolo'}
            description="Exige nível máximo de privilégios para leitura e modificação."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  variant={report.isRestricted ? 'primary' : 'danger'}
                  size="sm"
                  onClick={handleRestringirAcesso}
                  isLoading={isLoading}
                >
                  {report.isRestricted ? 'Remover Sigilo Especial' : 'Ativar Sigilo Restrito'}
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Justificativa da Alteração de Sigilo <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={restrictReason}
                onChange={(e) => setRestrictReason(e.target.value)}
                placeholder="Informe o motivo para restrição de visibilidade deste processo..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      case 'declarar_conflito':
        return (
          <Dialog
            isOpen={true}
            onClose={onClose}
            title="Declarar Conflito de Interesse / Suspeição"
            description="Registre seu impedimento legal ou ético para atuar na condução deste protocolo."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeclararConflito} isLoading={isLoading}>
                  Registrar Impeditivo
                </Button>
              </>
            }
          >
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Descrição do Conflito / Motivo de Impeditivo <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={4}
                value={conflictReason}
                onChange={(e) => setConflictReason(e.target.value)}
                placeholder="Ex: Relação de amizade/parentesco ou envolvimento direto com os citados na manifestação..."
                className="w-full bg-white border border-[#D4D4D4] rounded-md p-2.5 text-xs text-[#0A0A0A] focus:ring-2 focus:ring-[#171717] outline-none resize-none"
              />
            </div>
          </Dialog>
        );

      default:
        return null;
    }
  };

  return renderActionContent();
}
