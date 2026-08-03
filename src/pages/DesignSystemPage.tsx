import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Lock,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Folder,
  Layers,
  Activity,
  FileText,
  Users,
  ShieldAlert,
  Info,
  SlidersHorizontal,
  Bell,
  Eye,
  Calendar as CalendarIcon,
} from 'lucide-react';

// Estrutura & Marca
import { Container } from '../components/ui/Container';
import { Stack } from '../components/ui/Stack';
import { Grid } from '../components/ui/Grid';
import { Surface } from '../components/ui/Surface';
import { Divider } from '../components/ui/Divider';
import { Typography } from '../components/ui/Typography';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Icon } from '../components/ui/Icon';

// Ações
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { LinkButton } from '../components/ui/LinkButton';
import { ButtonGroup } from '../components/ui/ButtonGroup';

// Overlays & Modais
import { Dialog } from '../components/ui/Dialog';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Drawer } from '../components/ui/Drawer';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { Popover } from '../components/ui/Popover';
import { Tooltip } from '../components/data-display/Tooltip';

// Navegação
import { Tabs } from '../components/ui/Tabs';
import { Accordion } from '../components/ui/Accordion';
import { Breadcrumb } from '../components/navigation/Breadcrumb';
import { Pagination } from '../components/navigation/Pagination';
import { Steps } from '../components/navigation/Steps';
import { MobileNavigation } from '../components/navigation/MobileNavigation';
import { UserMenu } from '../components/navigation/UserMenu';

// Formulários
import { FormField, FormLabel, FormDescription, FormMessage } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PasswordInput } from '../components/forms/PasswordInput';
import { SearchInput } from '../components/forms/SearchInput';
import { Textarea } from '../components/forms/Textarea';
import { Checkbox } from '../components/forms/Checkbox';
import { RadioGroup } from '../components/forms/RadioGroup';
import { Switch } from '../components/forms/Switch';
import { Select } from '../components/forms/Select';
import { Combobox } from '../components/forms/Combobox';
import { MultiSelect } from '../components/forms/MultiSelect';
import { FileUpload } from '../components/forms/FileUpload';
import { DatePicker } from '../components/forms/DatePicker';

// Feedback & Loading
import { Alert } from '../components/feedback/Alert';
import { Spinner } from '../components/feedback/Spinner';
import { Skeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { ErrorState } from '../components/feedback/ErrorState';
import { InlineMessage } from '../components/feedback/InlineMessage';
import { Toast } from '../components/feedback/Toast';
import { Progress } from '../components/ui/Progress';

// Dados
import { Badge } from '../components/data-display/Badge';
import { StatusBadge, ReportStatus } from '../components/data-display/StatusBadge';
import { RiskBadge, RiskLevel } from '../components/data-display/RiskBadge';
import { PriorityBadge, PriorityLevel } from '../components/data-display/PriorityBadge';
import { Card, CardHeader, CardContent, CardFooter } from '../components/data-display/Card';
import { MetricCard } from '../components/data-display/MetricCard';
import { Timeline } from '../components/data-display/Timeline';
import { DescriptionList } from '../components/data-display/DescriptionList';
import { DataTable, DataTableRow } from '../components/data-display/DataTable';

export function DesignSystemPage() {
  // Estados interativos da página de documentação
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(true);

  const [searchValue, setSearchValue] = useState('');
  const [comboboxVal, setComboboxVal] = useState('1');
  const [multiSelectVal, setMultiSelectVal] = useState(['1', '3']);
  const [currentPage, setCurrentPage] = useState(1);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [radioValue, setRadioValue] = useState('1');

  // Dados de teste para Status, Risco, Prioridade
  const statuses: ReportStatus[] = [
    'Recebida',
    'Em triagem',
    'Aguardando informações',
    'Em análise',
    'Em investigação',
    'Encaminhada',
    'Plano de ação',
    'Resolvida',
    'Concluída',
    'Arquivada',
    'Reaberta',
  ];
  const risks: RiskLevel[] = ['baixo', 'médio', 'alto', 'crítico'];
  const priorities: PriorityLevel[] = ['baixa', 'normal', 'alta', 'urgente'];

  // Dados Locais de Demonstração para DataTable
  const sampleTableData: DataTableRow[] = [
    {
      id: '1',
      protocol: 'REL-2026-001',
      title: 'Ausência de EPI no setor de manutenção da fábrica',
      status: 'Em triagem',
      risk: 'alto',
      priority: 'urgente',
      createdAt: '01/08/2026 14:20',
    },
    {
      id: '2',
      protocol: 'REL-2026-002',
      title: 'Ruído excessivo em equipamento da lavanderia central',
      status: 'Em análise',
      risk: 'médio',
      priority: 'normal',
      createdAt: '01/08/2026 11:05',
    },
    {
      id: '3',
      protocol: 'REL-2026-003',
      title: 'Vazamento de água identificado no pavilhão B',
      status: 'Resolvida',
      risk: 'baixo',
      priority: 'baixa',
      createdAt: '31/07/2026 16:45',
    },
    {
      id: '4',
      protocol: 'REL-2026-004',
      title: 'Atraso na entrega do lote de insumos do almoxarifado',
      status: 'Aguardando informações',
      risk: 'crítico',
      priority: 'alta',
      createdAt: '31/07/2026 09:30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] pb-16">
      {/* Mobile Nav */}
      <MobileNavigation />

      <Container size="xl" className="space-y-12 pt-6">
        {/* Header Principal */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors"
              title="Voltar ao início"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <BrandLogo size="md" />
          </div>

          <div className="flex items-center gap-4">
            <UserMenu />
            <span className="bg-[#FDC503] text-[#0A0A0A] font-heading font-extrabold text-xs px-3 py-1.5 rounded shadow-xs">
              Design System — FASE 4
            </span>
          </div>
        </header>

        {/* Breadcrumb da documentação */}
        <Breadcrumb
          items={[
            { label: 'Visão Geral', href: '/' },
            { label: 'Design System & Guia de Estilos' },
          ]}
        />

        {/* SEÇÃO 0: Paleta de Cores & Tipografia Básica */}
        <section className="space-y-4">
          <Typography variant="h2">0. Guia de Estilo (Cores & Tipografia)</Typography>
          <Grid cols={3} gap="4">
            <Surface variant="card" className="space-y-3">
              <Typography variant="h4">Cor Primária da Marca</Typography>
              <div className="p-4 bg-[#FDC503] rounded-md text-[#0A0A0A] font-bold font-mono text-xs flex justify-between items-center shadow-xs">
                <span>Amarelo Grupo Bairral</span>
                <span>#FDC503</span>
              </div>
              <p className="text-xs text-[#737373]">
                Utilizada prioritariamente para o Botão Principal e elementos de destaque primário.
              </p>
            </Surface>

            <Surface variant="card" className="space-y-3">
              <Typography variant="h4">Neutros & Superfícies</Typography>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 bg-[#0A0A0A] text-white rounded">#0A0A0A</div>
                <div className="p-2 bg-[#171717] text-white rounded">#171717</div>
                <div className="p-2 bg-[#737373] text-white rounded">#737373</div>
                <div className="p-2 bg-[#E5E5E5] text-[#171717] rounded">#E5E5E5</div>
              </div>
            </Surface>

            <Surface variant="card" className="space-y-3">
              <Typography variant="h4">Escala Tipográfica</Typography>
              <div className="space-y-1">
                <Typography variant="h3">Título H3 (20px)</Typography>
                <Typography variant="h4">Subtítulo H4 (18px)</Typography>
                <Typography variant="body">Corpo de texto (14px)</Typography>
                <Typography variant="caption">Legendas e Captions (11px)</Typography>
              </div>
            </Surface>
          </Grid>
        </section>

        <Divider />

        {/* SEÇÃO 1: Estrutura & Marca */}
        <section className="space-y-4">
          <Typography variant="h2">1. Estrutura e Marca</Typography>
          <Grid cols={3} gap="4">
            <Surface variant="card">
              <Typography variant="h4" className="mb-3">BrandLogo</Typography>
              <Stack spacing="3">
                <BrandLogo size="sm" />
                <BrandLogo size="md" />
                <BrandLogo size="lg" />
              </Stack>
            </Surface>

            <Surface variant="dark">
              <Typography variant="h4" className="mb-3 text-white">BrandLogo (Modo Escuro)</Typography>
              <Stack spacing="3">
                <BrandLogo size="md" theme="dark" />
                <BrandLogo size="sm" variant="symbol" theme="dark" />
              </Stack>
            </Surface>

            <Surface variant="panel">
              <Typography variant="h4" className="mb-3">Icons & Typography</Typography>
              <Stack spacing="2">
                <Typography variant="metric">48.290</Typography>
                <div className="flex items-center gap-3">
                  <Icon icon={Activity} size="sm" className="text-[#FDC503]" />
                  <Icon icon={Layers} size="md" className="text-[#171717]" />
                  <Icon icon={ShieldAlert} size="lg" className="text-[#DC2626]" />
                </div>
              </Stack>
            </Surface>
          </Grid>
        </section>

        <Divider />

        {/* SEÇÃO 2: Botões e Controles de Ação */}
        <section className="space-y-4">
          <Typography variant="h2">2. Botões e Ações</Typography>
          <Surface variant="card" className="space-y-6">
            <div>
              <Typography variant="h4" className="mb-3">Variantes do Botão</Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary (#FDC503)</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" disabled>Desabilitado</Button>
                <Button variant="primary" isLoading>Carregando</Button>
              </div>
            </div>

            <Divider spacing="sm" />

            <div>
              <Typography variant="h4" className="mb-3">Ícones Solitários, Grupos e Links</Typography>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Novo Chamado
                </Button>
                <IconButton icon={Search} ariaLabel="Pesquisar" variant="outline" />
                <IconButton icon={Trash2} ariaLabel="Excluir" variant="danger" />

                <ButtonGroup>
                  <Button variant="outline" size="sm">Hoje</Button>
                  <Button variant="outline" size="sm">Semana</Button>
                  <Button variant="outline" size="sm">Mês</Button>
                </ButtonGroup>

                <LinkButton to="/" variant="ghost" size="sm">
                  Página Inicial
                </LinkButton>
              </div>
            </div>
          </Surface>
        </section>

        <Divider />

        {/* SEÇÃO 3: Formulários e Entradas Avançadas */}
        <section className="space-y-4">
          <Typography variant="h2">3. Campos de Entrada e Formulários Avançados</Typography>
          <Grid cols={2} gap="6">
            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Entradas de Texto & Busca</Typography>
              <FormField>
                <FormLabel required>Campo de Busca (SearchInput)</FormLabel>
                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue('')}
                  placeholder="Pesquisar por código, título ou palavra-chave..."
                />
              </FormField>

              <FormField>
                <FormLabel required>Senha com Visibilidade (PasswordInput)</FormLabel>
                <PasswordInput placeholder="Sua senha secreta..." leftIcon={<Lock className="w-4 h-4" />} />
              </FormField>

              <FormField>
                <FormLabel>Data de Ocorrência (DatePicker)</FormLabel>
                <DatePicker />
              </FormField>

              <FormField>
                <FormLabel error>Campo com Erro de Validação</FormLabel>
                <Input placeholder="Valor incorreto" error defaultValue="Texto com falha" />
                <FormMessage error="O campo preenchido não atende aos requisitos de validação." />
              </FormField>
            </Surface>

            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Seletores & Anexo de Arquivo</Typography>
              <FormField>
                <FormLabel>Seletor Busca Simples (Combobox)</FormLabel>
                <Combobox
                  options={[
                    { label: 'Sede Barcarena', value: '1' },
                    { label: 'Prédio Administrativo Central', value: '2' },
                    { label: 'Centro de Logística e Almoxarifado', value: '3' },
                  ]}
                  value={comboboxVal}
                  onChange={setComboboxVal}
                />
              </FormField>

              <FormField>
                <FormLabel>Múltipla Seleção (MultiSelect)</FormLabel>
                <MultiSelect
                  options={[
                    { label: 'Setor Enfermagem', value: '1' },
                    { label: 'Setor Manutenção', value: '2' },
                    { label: 'Setor Farmácia', value: '3' },
                    { label: 'Setor Recepção', value: '4' },
                  ]}
                  value={multiSelectVal}
                  onChange={setMultiSelectVal}
                />
              </FormField>

              <FileUpload label="Upload de Anexo (FileUpload)" />

              <div className="flex items-center gap-6 pt-2">
                <Checkbox
                  label="Receber notificações por e-mail"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                />
                <Switch
                  label="Notificações push"
                  checked={switchChecked}
                  onChange={setSwitchChecked}
                />
              </div>
            </Surface>
          </Grid>
        </section>

        <Divider />

        {/* SEÇÃO 4: Modais, Overlays & Dialogs */}
        <section className="space-y-4">
          <Typography variant="h2">4. Modais, Gavetas e Popovers</Typography>
          <Surface variant="card" className="space-y-4">
            <Typography variant="h4">Demonstração Interativa de Overlays</Typography>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Abrir Modal (Dialog)
              </Button>

              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Abrir Confirmação (ConfirmDialog)
              </Button>

              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Abrir Gaveta Lateral (Drawer)
              </Button>

              <DropdownMenu
                trigger={
                  <Button variant="outline" rightIcon={<SlidersHorizontal className="w-4 h-4" />}>
                    Menu suspenso (Dropdown)
                  </Button>
                }
                items={[
                  { label: 'Editar Registro', icon: <FileText className="w-4 h-4 text-[#737373]" /> },
                  { label: 'Visualizar Histórico', icon: <Eye className="w-4 h-4 text-[#737373]" /> },
                  { label: 'Excluir Item', icon: <Trash2 className="w-4 h-4" />, isDanger: true },
                ]}
              />

              <Popover
                trigger={
                  <Button variant="ghost" leftIcon={<Info className="w-4 h-4" />}>
                    Popover Informativo
                  </Button>
                }
              >
                <div className="space-y-2 max-w-xs">
                  <h4 className="font-bold text-[#0A0A0A]">Informações de Ajuda</h4>
                  <p className="text-xs text-[#525252]">
                    Este popover exibe detalhes contextuais adicionais sem interromper a navegação principal.
                  </p>
                </div>
              </Popover>

              <Tooltip content="Dica flutuante explicativa">
                <Button variant="ghost">Hover Tooltip</Button>
              </Tooltip>
            </div>
          </Surface>

          {/* Dialog Modal */}
          <Dialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title="Formulário de Cadastro Rápido"
            description="Preencha os campos abaixo para registrar a solicitação no sistema."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(false)}>
                  Salvar Registro
                </Button>
              </>
            }
          >
            <div className="space-y-3">
              <FormField>
                <FormLabel required>Título do Registro</FormLabel>
                <Input placeholder="Ex: Inspeção de rotina" />
              </FormField>
              <FormField>
                <FormLabel>Descrição detalhada</FormLabel>
                <Textarea placeholder="Detalhes operacionais..." rows={3} />
              </FormField>
            </div>
          </Dialog>

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              alert('Ação confirmada!');
              setIsConfirmOpen(false);
            }}
            title="Excluir Relatório Selecionado"
            description="Esta ação é irreversível e removerá todos os anexos associados do banco de dados."
            confirmLabel="Sim, Excluir"
            isDanger
          />

          {/* Drawer Lateral */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Painel de Filtros Avançados"
            footer={
              <Button variant="primary" size="sm" className="w-full" onClick={() => setIsDrawerOpen(false)}>
                Aplicar Filtros
              </Button>
            }
          >
            <div className="space-y-4">
              <FormField>
                <FormLabel>Período de Início</FormLabel>
                <DatePicker />
              </FormField>
              <FormField>
                <FormLabel>Status do Registro</FormLabel>
                <Select
                  options={[
                    { label: 'Todos os Status', value: 'all' },
                    { label: 'Em triagem', value: 'triagem' },
                    { label: 'Resolvida', value: 'resolvida' },
                  ]}
                />
              </FormField>
              <FormField>
                <FormLabel>Nível de Risco</FormLabel>
                <RadioGroup
                  name="drawer-risk"
                  options={[
                    { label: 'Todos', value: 'all' },
                    { label: 'Apenas Crítico / Alto', value: 'high' },
                  ]}
                  value="all"
                />
              </FormField>
            </div>
          </Drawer>
        </section>

        <Divider />

        {/* SEÇÃO 5: Navegação, Estrutura & Abas */}
        <section className="space-y-4">
          <Typography variant="h2">5. Componentes de Navegação & Abas</Typography>
          <Grid cols={2} gap="6">
            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Navegação por Abas (Tabs)</Typography>
              <Tabs
                tabs={[
                  {
                    id: 'tab1',
                    label: 'Geral',
                    icon: <FileText className="w-3.5 h-3.5" />,
                    content: <p className="text-xs leading-relaxed text-[#525252]">Conteúdo da aba Geral informando diretrizes do sistema.</p>,
                  },
                  {
                    id: 'tab2',
                    label: 'Histórico',
                    badge: <Badge variant="yellow" size="sm">12</Badge>,
                    content: <p className="text-xs leading-relaxed text-[#525252]">Histórico de modificações e logs de auditoria.</p>,
                  },
                  {
                    id: 'tab3',
                    label: 'Configurações',
                    content: <p className="text-xs leading-relaxed text-[#525252]">Preferências avançadas de notificação.</p>,
                  },
                ]}
              />
            </Surface>

            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Módulos Sanfonados (Accordion)</Typography>
              <Accordion
                items={[
                  {
                    id: 'acc1',
                    title: 'Como funciona o processo de triagem?',
                    content: 'Após o envio do formulário, a equipe de segurança realiza a classificação inicial de risco em até 24 horas.',
                  },
                  {
                    id: 'acc2',
                    title: 'Quem tem acesso às ocorrências registradas?',
                    content: 'Somente os analistas responsáveis e gestores da unidade correspondente possuem permissão de leitura.',
                  },
                ]}
              />
            </Surface>
          </Grid>

          <Grid cols={2} gap="6" className="mt-4">
            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Indicador de Etapas (Steps)</Typography>
              <Steps
                currentStep={1}
                steps={[
                  { title: 'Identificação', description: 'Dados básicos' },
                  { title: 'Análise Risco', description: 'Classificação' },
                  { title: 'Conclusão', description: 'Plano de Ação' },
                ]}
              />
            </Surface>

            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Paginação (Pagination)</Typography>
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </Surface>
          </Grid>
        </section>

        <Divider />

        {/* SEÇÃO 6: Feedback, Skeletons & Notificações */}
        <section className="space-y-4">
          <Typography variant="h2">6. Feedback, Notificações e Progresso</Typography>
          <Grid cols={2} gap="6">
            <Stack spacing="3">
              <Typography variant="h4">Notificações Flutuantes (Toast)</Typography>
              {showToast && (
                <Toast
                  variant="success"
                  title="Operação executada com sucesso"
                  message="Os dados foram persistidos no servidor e validados."
                  onClose={() => setShowToast(false)}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToast(true)}
                leftIcon={<Bell className="w-3.5 h-3.5" />}
              >
                Restaurar Toast demonstrativo
              </Button>
            </Stack>

            <Surface variant="card" className="space-y-4">
              <Typography variant="h4">Barra de Progresso (Progress)</Typography>
              <div className="space-y-3">
                <Progress value={35} showValue variant="yellow" />
                <Progress value={75} showValue variant="success" />
                <Progress value={90} showValue variant="danger" />
              </div>
            </Surface>
          </Grid>

          <Grid cols={2} gap="6" className="mt-4">
            <EmptyState
              icon={<Folder className="w-6 h-6 text-[#737373]" />}
              title="Sem registros encontrados"
              description="Nenhum item corresponde aos critérios do filtro selecionado."
              action={<Button variant="primary" size="sm">Limpar Filtros</Button>}
            />
            <ErrorState
              title="Falha na Sincronização"
              message="Erro temporário ao conectar com a API do Grupo Bairral."
              onRetry={() => alert('Tentando reconectar...')}
            />
          </Grid>
        </section>

        <Divider />

        {/* SEÇÃO 7: Visualização de Dados (Badges, Listas, Tabela Estrutural) */}
        <section className="space-y-6">
          <Typography variant="h2">7. Exibição de Dados, Timeline e Tabela Estrutural</Typography>

          {/* Badges */}
          <Surface variant="card" className="space-y-4">
            <Typography variant="h4">Badges Oficiais de Status (11 Variantes)</Typography>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => (
                <StatusBadge key={st} status={st} />
              ))}
            </div>

            <Divider spacing="sm" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body-sm" className="font-bold mb-2">Níveis de Risco (RiskBadge)</Typography>
                <div className="flex flex-wrap gap-2">
                  {risks.map((r) => (
                    <RiskBadge key={r} level={r} />
                  ))}
                </div>
              </div>
              <div>
                <Typography variant="body-sm" className="font-bold mb-2">Níveis de Prioridade (PriorityBadge)</Typography>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((p) => (
                    <PriorityBadge key={p} level={p} />
                  ))}
                </div>
              </div>
            </div>
          </Surface>

          {/* MetricCards */}
          <Grid cols={4} gap="4">
            <MetricCard
              title="Total de Registros"
              value="2.840"
              icon={FileText}
              highlightColor="yellow"
              trend={{ value: '+14%', isPositive: true }}
              subtitle="vs. mês passado"
            />
            <MetricCard
              title="Ações Críticas"
              value="12"
              icon={AlertTriangle}
              highlightColor="danger"
              trend={{ value: '-2%', isPositive: true }}
              subtitle="Em andamento"
            />
            <MetricCard
              title="Usuários Ativos"
              value="380"
              icon={Users}
              highlightColor="info"
              trend={{ value: 'Normal', isPositive: false }}
              subtitle="Sistemas ativos"
            />
            <MetricCard
              title="Resolução 24h"
              value="96.8%"
              icon={Check}
              highlightColor="success"
              trend={{ value: '+3%', isPositive: true }}
              subtitle="Índice de conformidade"
            />
          </Grid>

          {/* DescriptionList & Timeline */}
          <Grid cols={2} gap="6">
            <Surface variant="card" className="space-y-3">
              <Typography variant="h4">Lista de Descrição (DescriptionList)</Typography>
              <DescriptionList
                cols={2}
                items={[
                  { label: 'Unidade Operacional', value: 'Sede Grupo Bairral - Barcarena/PA' },
                  { label: 'Setor Interno', value: 'Almoxarifado Farmacêutico' },
                  { label: 'Responsável Técnico', value: 'Dr. Roberto Santos' },
                  { label: 'Data de Aprovação', value: '01/08/2026' },
                ]}
              />
            </Surface>

            <Surface variant="card" className="space-y-3">
              <Typography variant="h4">Linha do Tempo (Timeline)</Typography>
              <Timeline
                items={[
                  {
                    id: '1',
                    title: 'Relatório Criado',
                    description: 'Ocorrência registrada no sistema.',
                    date: '01/08/2026 10:00',
                    author: 'Mariana Lima',
                    badge: <StatusBadge status="Recebida" size="sm" />,
                  },
                  {
                    id: '2',
                    title: 'Triagem Realizada',
                    description: 'Risco classificado como Alto pela equipe.',
                    date: '01/08/2026 11:30',
                    author: 'Carlos Eduardo',
                    badge: <StatusBadge status="Em triagem" size="sm" />,
                  },
                ]}
              />
            </Surface>
          </Grid>

          {/* DataTable Estrutural */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3">Tabela Estrutural de Dados (DataTable)</Typography>
                <p className="text-xs text-[#737373]">
                  Exibição de dados locais de demonstração com status, risco e ações integradas.
                </p>
              </div>
              <Button variant="outline" size="sm" leftIcon={<CalendarIcon className="w-3.5 h-3.5" />}>
                Exportar Dados
              </Button>
            </div>

            <DataTable data={sampleTableData} />
            <Pagination
              currentPage={1}
              totalPages={3}
              onPageChange={() => {}}
            />
          </div>
        </section>
      </Container>
    </div>
  );
}
