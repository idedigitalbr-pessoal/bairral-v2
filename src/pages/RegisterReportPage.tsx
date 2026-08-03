import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FilePlus,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  FileText,
  AlertTriangle,
  Loader2,
  Building,
  Edit3,
  User,
  UserCheck,
  Mail,
  Phone,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  Search,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Steps } from '../components/navigation/Steps';
import { FormField, FormLabel, FormDescription, FormMessage } from '../components/forms/FormField';
import { Input } from '../components/forms/Input';
import { Textarea } from '../components/forms/Textarea';
import { Select } from '../components/forms/Select';
import { RadioGroup } from '../components/forms/RadioGroup';
import { Checkbox } from '../components/forms/Checkbox';
import { FileUpload, UploadedFileItem } from '../components/forms/FileUpload';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/data-display/Badge';
import { categoriesService } from '../services/categoriesService';
import { unitsService } from '../services/unitsService';
import { publicService, RegisterPublicReportResponse } from '../services/publicService';
import { Category, Unit, ReportTypeEnum, RegistrationTypeEnum } from '../types';

// ==========================================
// ESTRUTURA E TIPOS DO FORMULÁRIO
// ==========================================

export interface PublicReportFormData {
  type: string; // DENUNCIA, RECLAMACAO, SUGESTAO, ELOGIO, DUVIDA, SOLICITACAO
  registrationType: string; // ANONYMOUS, CONFIDENTIAL, IDENTIFIED
  isBairralEmployee: string; // YES, NO
  reporterRole: string; // Cargo (se funcionário)
  categoryId: string;
  unitId: string;
  department: string;
  location: string;
  relationshipToHospital: string; // EMPLOYEE, PATIENT, FAMILY_MEMBER, SUPPLIER, COMMUNITY, OTHER
  title: string;
  description: string;
  approximateDate: string;
  approximateTime: string;
  involvedPersons: string;
  witnesses: string;
  isRecurrent: string; // YES, NO, UNSURE
  hasImmediateRisk: string; // YES, NO
  previousAttempt: string; // YES, NO
  previousAttemptDetails: string;
  attachments: UploadedFileItem[];
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  contactPreference: string; // EMAIL, PHONE, WHATSAPP
  acceptedTerms: boolean;
}

const initialFormData: PublicReportFormData = {
  type: '',
  registrationType: 'ANONYMOUS',
  isBairralEmployee: '',
  reporterRole: '',
  categoryId: '',
  unitId: '',
  department: '',
  location: '',
  relationshipToHospital: 'EMPLOYEE',
  title: '',
  description: '',
  approximateDate: '',
  approximateTime: '',
  involvedPersons: '',
  witnesses: '',
  isRecurrent: 'NO',
  hasImmediateRisk: 'NO',
  previousAttempt: 'NO',
  previousAttemptDetails: '',
  attachments: [],
  reporterName: '',
  reporterEmail: '',
  reporterPhone: '',
  contactPreference: 'EMAIL',
  acceptedTerms: false,
};

export function RegisterReportPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<PublicReportFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categorias e Unidades carregadas via API / MSW
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  // Estado de envio
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<RegisterPublicReportResponse | null>(null);

  // Estados da Tela de Confirmação
  const [showAccessKey, setShowAccessKey] = useState<boolean>(false);
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Carregar dados de categorias e unidades
  useEffect(() => {
    let isMounted = true;
    setLoadingOptions(true);
    Promise.all([
      categoriesService.getCategories().catch(() => []),
      unitsService.getUnits().catch(() => []),
    ]).then(([cats, uns]) => {
      if (isMounted) {
        if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        if (Array.isArray(uns) && uns.length > 0) setUnits(uns);
        setLoadingOptions(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentStep]);

  // Prevenção de abandono acidental com dados preenchidos
  const hasUnsavedChanges =
    formData.title.trim() !== '' ||
    formData.description.trim() !== '' ||
    formData.type !== '' ||
    formData.attachments.length > 0;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !submissionResult) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, submissionResult]);

  // Atualizar campo do formulário
  const updateField = <K extends keyof PublicReportFormData>(field: K, value: PublicReportFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ==========================================
  // VALIDAÇÕES POR ETAPA (Zod pattern / Step Validation)
  // ==========================================
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // ETAPA 1 — TIPO
      if (!formData.type) {
        newErrors.type = 'Selecione o tipo de manifestação que deseja registrar.';
      }
    } else if (step === 1) {
      // ETAPA 2 — FORMA DE REGISTRO
      if (!formData.registrationType) {
        newErrors.registrationType = 'Selecione a modalidade de registro (Anônimo, Confidencial ou Identificado).';
      } else if (formData.registrationType !== 'ANONYMOUS') {
        if (!formData.isBairralEmployee) {
          newErrors.isBairralEmployee = 'Por favor, informe se você é funcionário(a) do Grupo Bairral.';
        }
        if (!formData.reporterName || formData.reporterName.trim().length < 3) {
          newErrors.reporterName = 'Por favor, informe seu nome completo.';
        }
        if (!formData.reporterEmail || !formData.reporterEmail.includes('@')) {
          newErrors.reporterEmail = 'Informe um e-mail válido para contato.';
        }
        if (!formData.reporterPhone || formData.reporterPhone.trim().length < 8) {
          newErrors.reporterPhone = 'Informe um telefone com DDD válido.';
        }
        if (formData.isBairralEmployee === 'YES') {
          if (!formData.reporterRole) {
            newErrors.reporterRole = 'Selecione o seu cargo no Grupo Bairral.';
          }
        } else if (formData.isBairralEmployee === 'NO') {
          if (!formData.relationshipToHospital) {
            newErrors.relationshipToHospital = 'Selecione a sua relação com o Grupo Bairral.';
          }
        }
      }
    } else if (step === 2) {
      // ETAPA 3 — UNIDADE DA OCORRÊNCIA
      if (!formData.unitId) {
        newErrors.unitId = 'Selecione a unidade do Grupo Bairral.';
      }
    } else if (step === 3) {
      // ETAPA 4 — OCORRÊNCIA
      if (!formData.title || formData.title.trim().length < 5) {
        newErrors.title = 'Forneça um título claro de no mínimo 5 caracteres.';
      }
      if (!formData.description || formData.description.trim().length < 15) {
        newErrors.description = 'Descreva a ocorrência com detalhes (no mínimo 15 caracteres).';
      }
    } else if (step === 4) {
      // ETAPA 5 — EVIDÊNCIAS (Opcional)
      // Nenhuma validação bloqueante de preenchimento
    } else if (step === 5) {
      // ETAPA 6 — REVISÃO E CONFIRMAÇÃO
      if (!formData.acceptedTerms) {
        newErrors.acceptedTerms = 'É obrigatório aceitar os Termos de Uso e Política de Privacidade.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const handleJumpToStep = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  // Envio final do formulário via MSW
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        registrationType: formData.registrationType,
        categoryId: formData.categoryId,
        unitId: formData.unitId,
        reporter:
          formData.registrationType !== 'ANONYMOUS'
            ? {
                type: formData.registrationType,
                name: formData.reporterName,
                email: formData.reporterEmail,
                phone: formData.reporterPhone,
                relationshipToHospital: formData.relationshipToHospital,
              }
            : {
                type: 'ANONYMOUS',
                relationshipToHospital: formData.relationshipToHospital,
              },
        attachments: formData.attachments,
      };

      const result = await publicService.registerReport(payload);
      setSubmissionResult(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar manifestação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers para Cópia e Impressão na Tela de Sucesso
  const copyToClipboard = (text: string, type: 'protocol' | 'key' | 'all') => {
    navigator.clipboard.writeText(text);
    if (type === 'protocol') {
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 3000);
    } else if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } else if (type === 'all') {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Tem certeza que deseja abandonar o preenchimento? As informações digitadas serão perdidas.')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  // Helper labels for category and unit names in summary
  const selectedCategoryObj = categories.find((c) => c.id === formData.categoryId);
  const selectedUnitObj = units.find((u) => u.id === formData.unitId);

  // Dynamic step descriptions displayed below each step title
  const getTypeLabel = () => {
    switch (formData.type) {
      case 'DENUNCIA': return 'Denúncia';
      case 'RECLAMACAO': return 'Reclamação';
      case 'SUGESTAO': return 'Sugestão';
      case 'ELOGIO': return 'Elogio';
      case 'DUVIDA': return 'Dúvida';
      case 'SOLICITACAO': return 'Solicitação';
      default: return 'Modalidade';
    }
  };

  const getFormaLabel = () => {
    switch (formData.registrationType) {
      case 'ANONYMOUS': return '100% Anônimo';
      case 'CONFIDENTIAL': return 'Confidencial';
      case 'IDENTIFIED': return 'Identificado';
      default: return 'Anonimato';
    }
  };

  const getOrigemLabel = () => {
    if (selectedUnitObj) {
      const label = selectedUnitObj.code || selectedUnitObj.name;
      return label.length > 13 ? label.substring(0, 13) + '...' : label;
    }
    return 'Unidade';
  };

  const getFatoLabel = () => {
    if (formData.title.trim()) {
      return formData.title.length > 13
        ? formData.title.substring(0, 13) + '...'
        : formData.title;
    }
    return 'Ocorrência';
  };

  const getAnexosLabel = () => {
    if (formData.attachments.length > 0) {
      return `${formData.attachments.length} anexo(s)`;
    }
    return 'Evidências';
  };

  const getRevisaoLabel = () => {
    if (formData.acceptedTerms) {
      return 'Termos Aceitos';
    }
    return 'Confirmação';
  };

  const stepsList = [
    { title: '1. Tipo', description: getTypeLabel() },
    { title: '2. Forma', description: getFormaLabel() },
    { title: '3. Origem', description: getOrigemLabel() },
    { title: '4. Fato', description: getFatoLabel() },
    { title: '5. Anexos', description: getAnexosLabel() },
    { title: '6. Revisão', description: getRevisaoLabel() },
  ];

  // ==========================================
  // RENDEREIZAÇÃO DA TELA DE CONFIRMAÇÃO (SUCESSO)
  // ==========================================
  if (submissionResult) {
    return (
      <Container size="md" className="py-10 space-y-8">
        <Surface variant="card" className="border-2 border-[#16A34A] p-8 space-y-6 shadow-xl bg-white">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5px]" />
            </div>
            <Typography variant="h2" className="text-[#166534]">
              Manifestação Registrada com Sucesso!
            </Typography>
            <p className="text-xs text-[#525252] max-w-lg mx-auto leading-relaxed">
              Sua solicitação foi gravada com segurança e já está disponível para análise da Comissão de Ética e Ouvidoria do Grupo Bairral.
            </p>
          </div>

          {/* Protocol & Key Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-md space-y-2 text-center relative">
              <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block">
                Número de Protocolo
              </span>
              <div className="font-mono text-2xl font-bold text-[#0A0A0A] tracking-wider select-all">
                {submissionResult.protocol}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(submissionResult.protocol, 'protocol')}
                leftIcon={copiedProtocol ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                className="w-full text-xs font-semibold mt-1"
              >
                {copiedProtocol ? 'Copiado!' : 'Copiar Protocolo'}
              </Button>
            </div>

            <div className="p-4 bg-[#FFF4C2] border border-[#FDC503] rounded-md space-y-2 text-center relative">
              <span className="text-[11px] font-bold text-[#806300] uppercase tracking-wider block flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#806300]" /> Chave de Acesso Privada
              </span>
              <div className="flex items-center justify-center gap-2">
                <div className="font-mono text-2xl font-bold text-[#0A0A0A] tracking-wider">
                  {showAccessKey ? submissionResult.accessKey : '••••••••••••'}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAccessKey(!showAccessKey)}
                  className="p-1 text-[#806300] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  title={showAccessKey ? 'Ocultar Chave' : 'Revelar Chave'}
                >
                  {showAccessKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => copyToClipboard(submissionResult.accessKey, 'key')}
                leftIcon={copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                className="w-full text-xs font-bold mt-1"
              >
                {copiedKey ? 'Chave Copiada!' : 'Copiar Chave'}
              </Button>
            </div>
          </div>

          {/* Security Instruction Warning */}
          <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-md text-xs text-[#991B1B] space-y-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-[#DC2626]" /> Instrução Importante de Guarda e Segurança:
            </div>
            <p className="leading-relaxed">
              Anote ou salve seu <strong>Protocolo</strong> e sua <strong>Chave de Acesso</strong> em local seguro. Por motivos de estrito anonimato e proteção de dados (LGPD), o sistema <strong>NÃO</strong> possui mecanismos de recuperação dessas credenciais caso sejam perdidas.
            </p>
          </div>

          {/* Combined Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E5E5E5]">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `Protocolo: ${submissionResult.protocol}\nChave de Acesso: ${submissionResult.accessKey}`,
                    'all'
                  )
                }
                leftIcon={copiedAll ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
              >
                {copiedAll ? 'Tudo Copiado!' : 'Copiar Protocolo e Chave'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
              >
                Imprimir / PDF
              </Button>
            </div>

            <Link
              to={`/acompanhar?protocol=${encodeURIComponent(submissionResult.protocol)}&accessKey=${encodeURIComponent(submissionResult.accessKey)}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Search className="w-4 h-4 text-[#FDC503]" />}
                className="w-full font-bold"
              >
                Acompanhar Manifestação
              </Button>
            </Link>
          </div>
        </Surface>
      </Container>
    );
  }

  // ==========================================
  // FLUXO DO FORMULÁRIO MULTIETAPAS (ETAPAS 1 A 7)
  // ==========================================
  return (
    <Container size="lg" className="py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <Typography variant="h2">Registrar Nova Manifestação</Typography>
            <p className="text-xs text-[#737373]">Canal de Ouvidoria, Ética e Integridade — Grupo Bairral</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF4C2] border border-[#FDC503] rounded text-[11px] font-bold text-[#806300]">
          <ShieldCheck className="w-4 h-4 text-[#806300]" />
          <span>Sigilo &amp; LGPD Garantidos</span>
        </div>
      </div>

      {/* Progress Steps Component */}
      <Steps
        steps={stepsList}
        currentStep={currentStep}
        onStepClick={handleJumpToStep}
      />

      {/* Main Wizard Form Card */}
      <Surface variant="card" className="max-w-4xl mx-auto space-y-6 p-6 sm:p-8">
        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* ==========================================
              ETAPA 1 — TIPO DA MANIFESTAÇÃO
             ========================================== */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Typography variant="h3">Etapa 1: Qual o tipo da sua manifestação?</Typography>
                <p className="text-xs text-[#737373] mt-1">
                  Selecione a opção que melhor caracteriza a natureza da mensagem que você deseja enviar.
                </p>
              </div>

              {errors.type && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded text-xs text-[#991B1B] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errors.type}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    id: 'DENUNCIA',
                    title: 'Denúncia',
                    badge: 'Sigilo Prioritário',
                    desc: 'Relato de descumprimento do Código de Ética, violação de leis, desvios de conduta, assédio ou fraudes.',
                    color: 'hover:border-[#DC2626]',
                  },
                  {
                    id: 'RECLAMACAO',
                    title: 'Reclamação',
                    badge: 'Atendimento & Qualidade',
                    desc: 'Manfestação de insatisfação quanto a serviços prestados, infraestrutura, refeições ou rotinas de atendimento.',
                    color: 'hover:border-[#D97706]',
                  },
                  {
                    id: 'SUGESTAO',
                    title: 'Sugestão',
                    badge: 'Melhoria Contínua',
                    desc: 'Propostas de ideias para otimização de fluxos, melhoria de ambientes ou novas práticas operacionais e assistenciais.',
                    color: 'hover:border-[#2563EB]',
                  },
                  {
                    id: 'ELOGIO',
                    title: 'Elogio',
                    badge: 'Reconhecimento',
                    desc: 'Manifestação de agrado ou agradecimento pelo atendimento prestado por equipes, médicos ou colaboradores.',
                    color: 'hover:border-[#16A34A]',
                  },
                  {
                    id: 'DUVIDA',
                    title: 'Dúvida',
                    badge: 'Esclarecimento',
                    desc: 'Questões e pedidos de explicação sobre regimentos internos, normas de conduta ou direitos dos pacientes.',
                    color: 'hover:border-[#9333EA]',
                  },
                  {
                    id: 'SOLICITACAO',
                    title: 'Solicitação',
                    badge: 'Providências',
                    desc: 'Pedidos formais de suporte, providências operacionais ou emissão de declarações institucionais.',
                    color: 'hover:border-[#171717]',
                  },
                ].map((item) => {
                  const isSelected = formData.type === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => updateField('type', item.id)}
                      className={`p-4 rounded-md border text-left cursor-pointer transition-all space-y-2 relative ${
                        isSelected
                          ? 'bg-[#171717] text-white border-[#171717] shadow-md scale-[1.01]'
                          : `bg-white border-[#E5E5E5] text-[#0A0A0A] ${item.color}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm">{item.title}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#FDC503]" />}
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                          isSelected ? 'bg-[#333333] text-[#FDC503]' : 'bg-[#F5F5F5] text-[#525252]'
                        }`}
                      >
                        {item.badge}
                      </span>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-[#D4D4D4]' : 'text-[#737373]'}`}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              ETAPA 2 — FORMA DE REGISTRO
             ========================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Typography variant="h3">Etapa 2: Como deseja realizar seu registro?</Typography>
                <p className="text-xs text-[#737373] mt-1">
                  Escolha o nível de confidencialidade da sua manifestação. O Grupo Bairral assegura tolerância zero contra retaliações.
                </p>
              </div>

              {errors.registrationType && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded text-xs text-[#991B1B] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errors.registrationType}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'ANONYMOUS',
                    title: 'Manifestação 100% Anônima',
                    icon: <Lock className="w-5 h-5 text-[#D97706]" />,
                    tag: 'Recomendado para sigilo pleno',
                    desc: 'Sua identidade permanece totalmente preservada. O sistema descarta endereço IP, geolocalização e dados de rede. O acompanhamento é feito exclusivamente via Protocolo e Chave Privada.',
                  },
                  {
                    id: 'CONFIDENTIAL',
                    title: 'Manifestação Confidencial',
                    icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" />,
                    tag: 'Acesso restrito apenas à Ouvidoria',
                    desc: 'Seus dados de contato são informados para viabilizar retornos, porém ficam sob sigilo estrito da Comissão de Ética e NÃO são repassados aos gestores da área denunciada.',
                  },
                  {
                    id: 'IDENTIFIED',
                    title: 'Manifestação Identificada',
                    icon: <UserCheck className="w-5 h-5 text-[#16A34A]" />,
                    tag: 'Retorno direto e transparente',
                    desc: 'Seus dados de identificação poderão ser compartilhados com os responsáveis pelo departamento para esclarecimentos diretos e resoluções mais ágeis.',
                  },
                ].map((item) => {
                  const isSelected = formData.registrationType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => updateField('registrationType', item.id)}
                      className={`p-5 rounded-md border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#171717] text-white border-[#171717] shadow-md'
                          : 'bg-white border-[#E5E5E5] hover:border-[#171717]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2.5 rounded-full ${isSelected ? 'bg-[#333333]' : 'bg-[#F5F5F5]'}`}>
                            {item.icon}
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#FDC503]" />}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm leading-snug">{item.title}</h4>
                          <span
                            className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded ${
                              isSelected ? 'bg-[#333333] text-[#FDC503]' : 'bg-[#FFF4C2] text-[#806300]'
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isSelected ? 'text-[#D4D4D4]' : 'text-[#525252]'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subformulário de Identificação quando Confidencial ou Identificada */}
              {formData.registrationType !== 'ANONYMOUS' && (
                <div className="p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg space-y-4 pt-4 mt-4 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                    <User className="w-5 h-5 text-[#806300]" />
                    <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">
                      Identificação do Manifestante ({formData.registrationType === 'CONFIDENTIAL' ? 'Confidencial' : 'Identificada'})
                    </h4>
                  </div>

                  {/* Pergunta: Funcionário Bairral */}
                  <FormField>
                    <FormLabel required error={!!errors.isBairralEmployee}>
                      Você é funcionário(a) do Grupo Bairral?
                    </FormLabel>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateField('isBairralEmployee', 'YES');
                          updateField('relationshipToHospital', 'EMPLOYEE');
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-md border flex items-center gap-2 transition-all cursor-pointer ${
                          formData.isBairralEmployee === 'YES'
                            ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                            : 'bg-white text-[#0A0A0A] border-[#D4D4D4] hover:bg-[#F5F5F5]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.isBairralEmployee === 'YES' ? 'border-[#FDC503] bg-[#FDC503]' : 'border-[#A3A3A3]'}`}>
                          {formData.isBairralEmployee === 'YES' && <span className="w-1.5 h-1.5 bg-[#171717] rounded-full" />}
                        </span>
                        Sim, sou funcionário(a)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateField('isBairralEmployee', 'NO');
                          if (formData.relationshipToHospital === 'EMPLOYEE') {
                            updateField('relationshipToHospital', '');
                          }
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-md border flex items-center gap-2 transition-all cursor-pointer ${
                          formData.isBairralEmployee === 'NO'
                            ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                            : 'bg-white text-[#0A0A0A] border-[#D4D4D4] hover:bg-[#F5F5F5]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.isBairralEmployee === 'NO' ? 'border-[#FDC503] bg-[#FDC503]' : 'border-[#A3A3A3]'}`}>
                          {formData.isBairralEmployee === 'NO' && <span className="w-1.5 h-1.5 bg-[#171717] rounded-full" />}
                        </span>
                        Não sou funcionário(a)
                      </button>
                    </div>
                    <FormMessage error={errors.isBairralEmployee} />
                  </FormField>

                  {/* Formulário se Funcionário === SIM */}
                  {formData.isBairralEmployee === 'YES' && (
                    <div className="space-y-4 pt-3 border-t border-[#E5E5E5]">
                      <FormField>
                        <FormLabel required error={!!errors.reporterName}>
                          Nome Completo
                        </FormLabel>
                        <Input
                          placeholder="Digite seu nome completo..."
                          value={formData.reporterName}
                          onChange={(e) => updateField('reporterName', e.target.value)}
                        />
                        <FormMessage error={errors.reporterName} />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField>
                          <FormLabel required error={!!errors.reporterEmail}>
                            E-mail
                          </FormLabel>
                          <Input
                            type="email"
                            placeholder="seu.email@grupobairral.com.br..."
                            value={formData.reporterEmail}
                            onChange={(e) => updateField('reporterEmail', e.target.value)}
                          />
                          <FormMessage error={errors.reporterEmail} />
                        </FormField>

                        <FormField>
                          <FormLabel required error={!!errors.reporterPhone}>
                            Telefone / WhatsApp
                          </FormLabel>
                          <Input
                            placeholder="(19) 99999-9999..."
                            value={formData.reporterPhone}
                            onChange={(e) => updateField('reporterPhone', e.target.value)}
                          />
                          <FormMessage error={errors.reporterPhone} />
                        </FormField>
                      </div>

                      <FormField>
                        <FormLabel required error={!!errors.reporterRole}>
                          Cargo no Grupo Bairral
                        </FormLabel>
                        <Select
                          value={formData.reporterRole}
                          onChange={(e) => updateField('reporterRole', e.target.value)}
                          options={[
                            { label: 'Selecione seu cargo...', value: '' },
                            { label: 'Enfermeiro(a)', value: 'Enfermeiro(a)' },
                            { label: 'Técnico(a) de Enfermagem', value: 'Técnico(a) de Enfermagem' },
                            { label: 'Auxiliar de Enfermagem', value: 'Auxiliar de Enfermagem' },
                            { label: 'Médico(a) Psiquiatra / Clínico', value: 'Médico(a) Psiquiatra / Clínico' },
                            { label: 'Psicólogo(a)', value: 'Psicólogo(a)' },
                            { label: 'Assistente Social', value: 'Assistente Social' },
                            { label: 'Terapeuta Ocupacional', value: 'Terapeuta Ocupacional' },
                            { label: 'Farmacêutico(a)', value: 'Farmacêutico(a)' },
                            { label: 'Nutricionista', value: 'Nutricionista' },
                            { label: 'Administrativo / RH / Financeiro', value: 'Administrativo / RH / Financeiro' },
                            { label: 'Manutenção / Higienização / Cozinha', value: 'Manutenção / Higienização / Cozinha' },
                            { label: 'Gestor / Coordenador / Liderança', value: 'Gestor / Coordenador / Liderança' },
                            { label: 'Outro Cargo', value: 'Outro Cargo' },
                          ]}
                        />
                        <FormMessage error={errors.reporterRole} />
                      </FormField>
                    </div>
                  )}

                  {/* Formulário se Funcionário === NÃO */}
                  {formData.isBairralEmployee === 'NO' && (
                    <div className="space-y-4 pt-3 border-t border-[#E5E5E5]">
                      <FormField>
                        <FormLabel required error={!!errors.reporterName}>
                          Nome Completo
                        </FormLabel>
                        <Input
                          placeholder="Digite seu nome completo..."
                          value={formData.reporterName}
                          onChange={(e) => updateField('reporterName', e.target.value)}
                        />
                        <FormMessage error={errors.reporterName} />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField>
                          <FormLabel required error={!!errors.reporterEmail}>
                            E-mail
                          </FormLabel>
                          <Input
                            type="email"
                            placeholder="seu.email@dominio.com..."
                            value={formData.reporterEmail}
                            onChange={(e) => updateField('reporterEmail', e.target.value)}
                          />
                          <FormMessage error={errors.reporterEmail} />
                        </FormField>

                        <FormField>
                          <FormLabel required error={!!errors.reporterPhone}>
                            Telefone / WhatsApp
                          </FormLabel>
                          <Input
                            placeholder="(19) 99999-9999..."
                            value={formData.reporterPhone}
                            onChange={(e) => updateField('reporterPhone', e.target.value)}
                          />
                          <FormMessage error={errors.reporterPhone} />
                        </FormField>
                      </div>

                      <FormField>
                        <FormLabel required error={!!errors.relationshipToHospital}>
                          Sua Relação com o Grupo Bairral
                        </FormLabel>
                        <Select
                          value={formData.relationshipToHospital}
                          onChange={(e) => updateField('relationshipToHospital', e.target.value)}
                          options={[
                            { label: 'Selecione sua relação com o Grupo Bairral...', value: '' },
                            { label: 'Colaborador / Funcionário (CLT ou Terceirizado)', value: 'EMPLOYEE' },
                            { label: 'Cliente / Contratante de Serviços ou Locações', value: 'CLIENT' },
                            { label: 'Fornecedor / Prestador de Serviços', value: 'SUPPLIER' },
                            { label: 'Parceiro Comercial / Concessionária', value: 'PARTNER' },
                            { label: 'Comunidade Local / Morador da Região', value: 'COMMUNITY' },
                            { label: 'Ex-colaborador', value: 'EX_EMPLOYEE' },
                            { label: 'Outro Vínculo', value: 'OTHER' },
                          ]}
                        />
                        <FormMessage error={errors.relationshipToHospital} />
                      </FormField>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              ETAPA 3 — UNIDADE DA OCORRÊNCIA
             ========================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Typography variant="h3">Etapa 3: Unidade da Ocorrência</Typography>
                <p className="text-xs text-[#737373] mt-1">
                  Selecione a unidade do Grupo Bairral onde ocorreu o fato para direcionamento correto da demanda.
                </p>
              </div>

              <FormField>
                <FormLabel required error={!!errors.unitId}>
                  Unidade do Grupo Bairral
                </FormLabel>
                <Select
                  value={formData.unitId}
                  onChange={(e) => updateField('unitId', e.target.value)}
                  options={[
                    { label: 'Selecione a unidade do Grupo Bairral...', value: '' },
                    ...units.map((u) => ({ label: `${u.name} (${u.code})`, value: u.id })),
                  ]}
                />
                <FormMessage error={errors.unitId} />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Departamento / Setor (Opcional)</FormLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    options={[
                      { label: 'Selecione o setor envolvido (se souber)...', value: '' },
                      { label: 'Operação de Transportes & Frotas (Cargas e Pessoas)', value: 'Operação de Transportes & Frotas' },
                      { label: 'Locação de Equipamentos & Oficina Mecânica', value: 'Locação de Equipamentos & Oficina Mecânica' },
                      { label: 'Gestão de Resíduos, Meio Ambiente & SMS (HSE)', value: 'Gestão de Resíduos, Meio Ambiente & SMS' },
                      { label: 'Logística Integrada & Armazenagem', value: 'Logística Integrada & Armazenagem' },
                      { label: 'Segurança do Trabalho & Saúde Ocupacional (SST)', value: 'Segurança do Trabalho & Saúde Ocupacional' },
                      { label: 'Recursos Humanos & Gestão de Pessoas (RH)', value: 'Recursos Humanos & Gestão de Pessoas' },
                      { label: 'Financeiro, Contabilidade & Controladoria', value: 'Financeiro, Contabilidade & Controladoria' },
                      { label: 'Jurídico, Compliance & Ouvidoria (Bairral Advocacia)', value: 'Jurídico, Compliance & Ouvidoria' },
                      { label: 'Tecnologia da Informação (TI) & Sistemas', value: 'Tecnologia da Informação (TI)' },
                      { label: 'Recepção, Portaria & Atendimento', value: 'Recepção, Portaria & Atendimento' },
                      { label: 'Compras & Suprimentos', value: 'Compras & Suprimentos' },
                      { label: 'Outro Setor / Não Especificado', value: 'Outro Setor' },
                    ]}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Local Específico da Ocorrência</FormLabel>
                  <Input
                    placeholder="Ex: Galpão de Manutenção, Pátio de Veículos, Rota de Transporte, Base Operacional..."
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* ==========================================
              ETAPA 4 — OCORRÊNCIA (DETALHAMENTO)
             ========================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Typography variant="h3">Etapa 4: Detalhamento da Ocorrência</Typography>
                <p className="text-xs text-[#737373] mt-1">
                  Descreva o fato com o máximo de clareza possível para facilitar o trabalho da comissão de apuração.
                </p>
              </div>

              <FormField>
                <FormLabel required error={!!errors.title}>
                  Título do Relato
                </FormLabel>
                <Input
                  placeholder="Resuma o ocorrido em poucas palavras (ex: Falta de equipamentos no plantão da noite)..."
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
                <FormMessage error={errors.title} />
              </FormField>

              <FormField>
                <FormLabel required error={!!errors.description}>
                  Descrição Detalhada do Fato
                </FormLabel>
                <Textarea
                  rows={6}
                  placeholder="Descreva detalhadamente o que aconteceu, onde, como e quem participou da situação..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
                <FormDescription>
                  Evite termos ofensivos e atenha-se aos fatos observados de boa-fé.
                </FormDescription>
                <FormMessage error={errors.description} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Data Aproximada</FormLabel>
                  <Input
                    type="date"
                    value={formData.approximateDate}
                    onChange={(e) => updateField('approximateDate', e.target.value)}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Horário Aproximado (Opcional)</FormLabel>
                  <Input
                    type="time"
                    value={formData.approximateTime}
                    onChange={(e) => updateField('approximateTime', e.target.value)}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Pessoas Envolvidas (Nomes / Cargos)</FormLabel>
                  <Input
                    placeholder="Cite nomes ou funções das pessoas citadas (se souber)..."
                    value={formData.involvedPersons}
                    onChange={(e) => updateField('involvedPersons', e.target.value)}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Testemunhas (Opcional)</FormLabel>
                  <Input
                    placeholder="Pessoas que presenciarem a cena..."
                    value={formData.witnesses}
                    onChange={(e) => updateField('witnesses', e.target.value)}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E5E5E5]">
                <FormField>
                  <FormLabel>Fato Recorrente?</FormLabel>
                  <RadioGroup
                    name="isRecurrent"
                    options={[
                      { label: 'Não', value: 'NO' },
                      { label: 'Sim', value: 'YES' },
                      { label: 'Não sei', value: 'UNSURE' },
                    ]}
                    value={formData.isRecurrent}
                    onChange={(val) => updateField('isRecurrent', val)}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Risco Imediato à Segurança?</FormLabel>
                  <RadioGroup
                    name="hasImmediateRisk"
                    options={[
                      { label: 'Não', value: 'NO' },
                      { label: 'Sim (Urgente)', value: 'YES' },
                    ]}
                    value={formData.hasImmediateRisk}
                    onChange={(val) => updateField('hasImmediateRisk', val)}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Tentativa Anterior de Solução?</FormLabel>
                  <RadioGroup
                    name="previousAttempt"
                    options={[
                      { label: 'Não', value: 'NO' },
                      { label: 'Sim', value: 'YES' },
                    ]}
                    value={formData.previousAttempt}
                    onChange={(val) => updateField('previousAttempt', val)}
                  />
                </FormField>
              </div>

              {formData.previousAttempt === 'YES' && (
                <FormField>
                  <FormLabel>Detalhes da Tentativa Anterior</FormLabel>
                  <Input
                    placeholder="Com quem conversou ou qual providência foi solicitada anteriormente..."
                    value={formData.previousAttemptDetails}
                    onChange={(e) => updateField('previousAttemptDetails', e.target.value)}
                  />
                </FormField>
              )}
            </div>
          )}

          {/* ==========================================
              ETAPA 5 — EVIDÊNCIAS E ANEXOS
             ========================================== */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Typography variant="h3">Etapa 5: Evidências e Documentos Anexos</Typography>
                <p className="text-xs text-[#737373] mt-1">
                  Anexe fotos, documentos PDF ou relatórios que comprovem ou fundamentem o seu relato (opcional).
                </p>
              </div>

              <FileUpload
                label="Selecione ou Arraste Arquivos"
                maxSizeMB={10}
                maxFiles={5}
                files={formData.attachments}
                onChange={(files) => updateField('attachments', files)}
                showMetadataWarning={true}
              />
            </div>
          )}

          {/* ==========================================
              ETAPA 6 — REVISÃO E CONFIRMAÇÃO
             ========================================== */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Typography variant="h3">Etapa 6: Revisão Final e Consentimento</Typography>
                <p className="text-xs text-[#737373] mt-1">
                  Confira o resumo das informações antes de realizar o envio definitivo para a Ouvidoria.
                </p>
              </div>

              {/* Summary Cards with Quick Edit Buttons */}
              <div className="space-y-4">
                {/* Block 1: Tipo e Registro */}
                <div className="p-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-md space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <span className="font-heading font-bold text-xs text-[#0A0A0A] uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#FDC503]" /> 1. Tipo e Modalidade
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToStep(0)} className="h-7 text-xs">
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Editar
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#737373]">Tipo:</span>{' '}
                      <strong className="text-[#0A0A0A]">{formData.type}</strong>
                    </div>
                    <div>
                      <span className="text-[#737373]">Modalidade:</span>{' '}
                      <strong className="text-[#0A0A0A]">
                        {formData.registrationType === 'ANONYMOUS'
                          ? '100% Anônimo'
                          : formData.registrationType === 'CONFIDENTIAL'
                          ? 'Confidencial'
                          : 'Identificado'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Block 2: Unidade e Local */}
                <div className="p-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-md space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <span className="font-heading font-bold text-xs text-[#0A0A0A] uppercase tracking-wide flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#FDC503]" /> 2. Unidade e Localização
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToStep(2)} className="h-7 text-xs">
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Editar
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#737373]">Unidade:</span>{' '}
                      <strong className="text-[#0A0A0A]">{selectedUnitObj?.name || 'Não informada'}</strong>
                    </div>
                    {formData.department && (
                      <div>
                        <span className="text-[#737373]">Setor:</span>{' '}
                        <strong className="text-[#0A0A0A]">{formData.department}</strong>
                      </div>
                    )}
                    {formData.location && (
                      <div>
                        <span className="text-[#737373]">Local:</span>{' '}
                        <strong className="text-[#0A0A0A]">{formData.location}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Block 3: Fato e Evidências */}
                <div className="p-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-md space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <span className="font-heading font-bold text-xs text-[#0A0A0A] uppercase tracking-wide flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#FDC503]" /> 3. Detalhamento e Anexos
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToStep(3)} className="h-7 text-xs">
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Editar
                    </Button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[#737373]">Título:</span>{' '}
                      <strong className="text-[#0A0A0A]">{formData.title}</strong>
                    </div>
                    <div>
                      <span className="text-[#737373]">Descrição:</span>
                      <p className="p-2 bg-white border border-[#E5E5E5] rounded mt-1 text-[#262626] leading-relaxed max-h-32 overflow-y-auto">
                        {formData.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#737373]">Anexos:</span>{' '}
                      <strong className="text-[#0A0A0A]">
                        {formData.attachments.length > 0 ? `${formData.attachments.length} arquivo(s)` : 'Nenhum anexo'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Block 4: Identificação */}
                <div className="p-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-md space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                    <span className="font-heading font-bold text-xs text-[#0A0A0A] uppercase tracking-wide flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#FDC503]" /> 4. Identificação do Manifestante
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleJumpToStep(1)} className="h-7 text-xs">
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Editar
                    </Button>
                  </div>
                  <div className="text-xs">
                    {formData.registrationType === 'ANONYMOUS' ? (
                      <span className="text-[#806300] font-semibold bg-[#FFF4C2] px-2 py-0.5 rounded">
                        Manifestação Anônima — Identidade Preservada
                      </span>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-[#737373]">Nome:</span> <strong>{formData.reporterName}</strong>
                        </div>
                        <div>
                          <span className="text-[#737373]">E-mail:</span> <strong>{formData.reporterEmail}</strong>
                        </div>
                        <div>
                          <span className="text-[#737373]">Telefone:</span> <strong>{formData.reporterPhone}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Consent Checkbox */}
              <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md space-y-3">
                <Checkbox
                  id="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                  error={!!errors.acceptedTerms}
                  label="Declaro sob as penas da lei e do Código de Ética que as informações prestadas são verdadeiras e fundamentadas, e declaro ter lido e aceito os Termos de Uso e Política de Privacidade do Grupo Bairral."
                />
                <FormMessage error={errors.acceptedTerms} />
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="pt-6 border-t border-[#E5E5E5] flex items-center justify-between gap-3">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handlePrev}
                disabled={isSubmitting}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Anterior
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
            )}

            {currentStep < 5 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Próxima Etapa
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                className="font-bold bg-[#16A34A] hover:bg-[#15803D] text-white border-none"
              >
                {isSubmitting ? 'Enviando Manifestação...' : 'Confirmar e Enviar Manifestação'}
              </Button>
            )}
          </div>
        </form>
      </Surface>
    </Container>
  );
}
