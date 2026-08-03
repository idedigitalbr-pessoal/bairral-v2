import { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Clock,
  FileText,
  MessageSquare,
  Shield,
  Phone,
  Bell,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { PermissionGate } from '../components/auth/PermissionGate';
import { AdminPermissionEnum } from '../types/auth';
import { useSettings } from '../hooks/useSettings';
import { SystemSettings } from '../services/settingsService';

export function SettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [activeTab, setActiveTab] = useState<'institutional' | 'sla' | 'policies' | 'templates' | 'retention' | 'channels' | 'notifications'>('institutional');

  const [form, setForm] = useState<SystemSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  if (isLoading || !form) {
    return (
      <Surface variant="card" className="p-8 text-center text-xs text-[#737373]">
        Carregando parâmetros de configuração do sistema...
      </Surface>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    await updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-4">
        <div>
          <Typography variant="h2">Configurações e Parâmetros do Sistema</Typography>
          <p className="text-xs text-[#737373]">
            Parâmetros institucionais, regimento de SLA, templates institucionais e diretrizes de conformidade LGPD
          </p>
        </div>
        <PermissionGate permission={AdminPermissionEnum.MANAGE_SETTINGS}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={saveSuccess ? <CheckCircle className="w-4 h-4 text-[#107C41]" /> : <Save className="w-4 h-4" />}
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? 'Salvando...' : saveSuccess ? 'Configurações Salvas!' : 'Salvar Alterações'}
          </Button>
        </PermissionGate>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-1 border-b border-[#E5E5E5] overflow-x-auto pb-1 text-xs">
        {[
          { id: 'institutional', label: 'Institucional & DPO', icon: Building },
          { id: 'sla', label: 'Regimento de Prazos (SLA)', icon: Clock },
          { id: 'policies', label: 'Políticas & Termos', icon: FileText },
          { id: 'templates', label: 'Templates de Mensagem', icon: MessageSquare },
          { id: 'retention', label: 'Retenção & Expurgo (LGPD)', icon: Shield },
          { id: 'channels', label: 'Canais Alternativos', icon: Phone },
          { id: 'notifications', label: 'Notificações & Digest', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 font-medium shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#004B87] text-[#004B87] font-bold bg-[#EFF6FF]/50'
                  : 'border-transparent text-[#737373] hover:text-[#0A0A0A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo das Abas */}
      <form onSubmit={handleSave}>
        {/* Aba 1: Institucional */}
        {activeTab === 'institutional' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Informações Institucionais e Encarregado de Dados (DPO)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <FormField>
                <FormLabel>Razão Social da Instituição</FormLabel>
                <Input
                  value={form.institutional.organizationName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      institutional: { ...form.institutional, organizationName: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>CNPJ da Entidade</FormLabel>
                <Input
                  value={form.institutional.cnpj}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      institutional: { ...form.institutional, cnpj: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField className="md:col-span-2">
                <FormLabel>Endereço da Sede Administrativa</FormLabel>
                <Input
                  value={form.institutional.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      institutional: { ...form.institutional, address: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>E-mail Oficial do Canal de Ética</FormLabel>
                <Input
                  type="email"
                  value={form.institutional.ethicsEmail}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      institutional: { ...form.institutional, ethicsEmail: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>Nome do DPO (Data Protection Officer)</FormLabel>
                <Input
                  value={form.institutional.dpoName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      institutional: { ...form.institutional, dpoName: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField className="md:col-span-2">
                <FormLabel>E-mail do Encarregado de Dados (DPO)</FormLabel>
                <Input
                  type="email"
                  value={form.institutional.dpoEmail}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      institutional: { ...form.institutional, dpoEmail: e.target.value },
                    })
                  }
                />
              </FormField>
            </div>
          </Surface>
        )}

        {/* Aba 2: Regimento de Prazos (SLA) */}
        {activeTab === 'sla' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Prazos Regulamentares de Atendimento (SLA)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <FormField>
                <FormLabel>Prazo para Triagem Inicial de Casos Críticos (Dias Úteis)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={form.slaDefaults.criticalTriageDays}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slaDefaults: { ...form.slaDefaults, criticalTriageDays: Number(e.target.value) },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>Prazo para Triagem de Casos Normais (Dias Úteis)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={form.slaDefaults.normalTriageDays}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slaDefaults: { ...form.slaDefaults, normalTriageDays: Number(e.target.value) },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>Prazo Limite para Conclusão da Investigação (Dias Úteis)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={form.slaDefaults.finalResolutionDays}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slaDefaults: { ...form.slaDefaults, finalResolutionDays: Number(e.target.value) },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>Limite Máximo de Prorrogação de Prazo (Dias Úteis)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={form.slaDefaults.maxExtensionDays}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slaDefaults: { ...form.slaDefaults, maxExtensionDays: Number(e.target.value) },
                    })
                  }
                />
              </FormField>
            </div>
          </Surface>
        )}

        {/* Aba 3: Políticas & Termos */}
        {activeTab === 'policies' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Políticas Públicas e Termos Legais
            </h3>

            <div className="space-y-4 text-xs">
              <FormField>
                <FormLabel>Diretrizes da Política de Privacidade (LGPD)</FormLabel>
                <textarea
                  rows={4}
                  value={form.policies.privacyTerms}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      policies: { ...form.policies, privacyTerms: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <FormField>
                <FormLabel>Política de Não Retaliação ao Manifestante</FormLabel>
                <textarea
                  rows={4}
                  value={form.policies.antiRetaliationPolicy}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      policies: { ...form.policies, antiRetaliationPolicy: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <FormField>
                <FormLabel>Garantias de Anonimato e Sigilo de IP</FormLabel>
                <textarea
                  rows={3}
                  value={form.policies.anonymityGuidelines}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      policies: { ...form.policies, anonymityGuidelines: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>
            </div>
          </Surface>
        )}

        {/* Aba 4: Templates de Mensagem */}
        {activeTab === 'templates' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Templates de Mensagens Automáticas
            </h3>

            <div className="space-y-4 text-xs">
              <FormField>
                <FormLabel>Confirmação de Recebimento de Manifestação</FormLabel>
                <textarea
                  rows={3}
                  value={form.messageTemplates.receiptConfirmation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      messageTemplates: { ...form.messageTemplates, receiptConfirmation: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <FormField>
                <FormLabel>Solicitação de Informações / Evidências Complementares</FormLabel>
                <textarea
                  rows={3}
                  value={form.messageTemplates.infoRequest}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      messageTemplates: { ...form.messageTemplates, infoRequest: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <FormField>
                <FormLabel>Notificação de Prorrogação de Prazo</FormLabel>
                <textarea
                  rows={3}
                  value={form.messageTemplates.extensionNotice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      messageTemplates: { ...form.messageTemplates, extensionNotice: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>

              <FormField>
                <FormLabel>Notificação de Conclusão / Parecer Final</FormLabel>
                <textarea
                  rows={3}
                  value={form.messageTemplates.closureNotice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      messageTemplates: { ...form.messageTemplates, closureNotice: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none focus:border-[#004B87]"
                />
              </FormField>
            </div>
          </Surface>
        )}

        {/* Aba 5: Retenção & Expurgo (LGPD) */}
        {activeTab === 'retention' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Política de Retenção de Dados e Guarda Legal (LGPD)
            </h3>

            <div className="space-y-4 text-xs">
              <FormField>
                <FormLabel>Tempo de Retenção de Manifestações Concluídas (Anos)</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={form.retention.retentionYears}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      retention: { ...form.retention, retentionYears: Number(e.target.value) },
                    })
                  }
                />
              </FormField>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.retention.autoPurgeSensitiveEvidence}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      retention: { ...form.retention, autoPurgeSensitiveEvidence: e.target.checked },
                    })
                  }
                  className="rounded border-[#D4D4D4] text-[#004B87] focus:ring-[#004B87]"
                />
                <span className="font-semibold text-[#0A0A0A]">
                  Expurgo automático de evidências sensíveis após encerramento do prazo prescricional
                </span>
              </label>
            </div>
          </Surface>
        )}

        {/* Aba 6: Canais Alternativos */}
        {activeTab === 'channels' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Divulgação de Canais Alternativos de Atendimento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <FormField>
                <FormLabel>Número Telefônico Gratuito (0800)</FormLabel>
                <Input
                  value={form.alternativeChannels.phone0800}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alternativeChannels: { ...form.alternativeChannels, phone0800: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField>
                <FormLabel>Número WhatsApp Institucional</FormLabel>
                <Input
                  value={form.alternativeChannels.whatsappNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alternativeChannels: { ...form.alternativeChannels, whatsappNumber: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField className="md:col-span-2">
                <FormLabel>Localização das Urnas Físicas de Coleta</FormLabel>
                <Input
                  value={form.alternativeChannels.physicalBoxLocations}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alternativeChannels: { ...form.alternativeChannels, physicalBoxLocations: e.target.value },
                    })
                  }
                />
              </FormField>
            </div>
          </Surface>
        )}

        {/* Aba 7: Notificações */}
        {activeTab === 'notifications' && (
          <Surface variant="card" className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0A0A0A] border-b border-[#F5F5F5] pb-2">
              Preferências de Alertas e Notificações do Comitê
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-[#FAFAFA] border border-[#F5F5F5]">
                <input
                  type="checkbox"
                  checked={form.notifications.notifyCriticalCasesImmediately}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notifications: { ...form.notifications, notifyCriticalCasesImmediately: e.target.checked },
                    })
                  }
                  className="rounded border-[#D4D4D4] text-[#004B87] focus:ring-[#004B87]"
                />
                <div>
                  <span className="font-bold text-[#0A0A0A] block">Notificar Casos Críticos Imediatamente</span>
                  <span className="text-[11px] text-[#737373]">
                    Dispara alerta imediato por e-mail a todos os membros do Comitê de Ética
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-[#FAFAFA] border border-[#F5F5F5]">
                <input
                  type="checkbox"
                  checked={form.notifications.notifySlaWarning24h}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notifications: { ...form.notifications, notifySlaWarning24h: e.target.checked },
                    })
                  }
                  className="rounded border-[#D4D4D4] text-[#004B87] focus:ring-[#004B87]"
                />
                <div>
                  <span className="font-bold text-[#0A0A0A] block">Alerta de Vencimento de SLA (24h de antecedência)</span>
                  <span className="text-[11px] text-[#737373]">
                    Alerta o relator e responsável pela investigação quando o prazo estiver próximo do encerramento
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded bg-[#FAFAFA] border border-[#F5F5F5]">
                <input
                  type="checkbox"
                  checked={form.notifications.weeklyCommitteeDigest}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notifications: { ...form.notifications, weeklyCommitteeDigest: e.target.checked },
                    })
                  }
                  className="rounded border-[#D4D4D4] text-[#004B87] focus:ring-[#004B87]"
                />
                <div>
                  <span className="font-bold text-[#0A0A0A] block">Relatório Semanal Sintético (Committee Digest)</span>
                  <span className="text-[11px] text-[#737373]">
                    Envia resumo consolidado com estatísticas de manifestações toda segunda-feira às 08:00
                  </span>
                </div>
              </label>
            </div>
          </Surface>
        )}
      </form>
    </div>
  );
}
