import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus,
  Search,
  ShieldCheck,
  Lock,
  Building,
  HelpCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Surface } from '../components/ui/Surface';
import { Badge } from '../components/data-display/Badge';
import { Container } from '../components/ui/Container';
import { Grid } from '../components/ui/Grid';
import { Typography } from '../components/ui/Typography';
import { Accordion } from '../components/ui/Accordion';

export function PublicPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'denuncia' | 'elogio' | 'sugestao' | 'reclamacao' | 'duvida'>('all');

  const mainFaqs = [
    {
      id: 'faq-1',
      title: 'Como posso garantir que meu relato será 100% anônimo?',
      content:
        'Ao selecionar a opção anônima, nosso sistema desvincula totalmente seu endereço IP, navegador e dados de dispositivo. É gerado apenas um número de protocolo e uma chave hash criptografada aleatória para acompanhamento.',
    },
    {
      id: 'faq-2',
      title: 'O que acontece após eu registrar minha manifestação?',
      content:
        'A manifestação entra imediatamente na etapa de triagem e classificação. O Comitê de Ética do Grupo Bairral avalia o teor em até 48 horas úteis para definir o nível de prioridade e iniciar a apuração imparcial.',
    },
    {
      id: 'faq-3',
      title: 'Existe algum risco de retaliação se eu me identificar ou fizer um relato?',
      content:
        'Não. O Grupo Bairral possui uma política rígida de Tolerância Zero contra qualquer tipo de retaliação, sanção ou penalização a relatores que agem de boa-fé. A proteção ao manifestante é um pilar absoluto.',
    },
    {
      id: 'faq-4',
      title: 'O que devo fazer se eu perder meu protocolo e chave de acesso?',
      content:
        'Por razões estritas de segurança da informação e garantia de anonimato, o sistema não recupera chaves perdidas. Caso perca seus dados, recomendamos registrar um novo comunicado referente ao mesmo assunto.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-[#171717] text-white py-16 px-4 border-b border-[#262626] relative overflow-hidden">
        {/* Geometric Background Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FDC503_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDC503]/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="lg" className="relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#262626] border border-[#333333] rounded-full text-[#FDC503] font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#FDC503]" />
            <span>Grupo Bairral &bull; Canal Seguro e Criptografado</span>
          </div>

          <Typography variant="h1" className="text-white max-w-4xl mx-auto leading-tight tracking-tight">
            Canal de Ética e Integridade
          </Typography>

          <p className="text-[#D4D4D4] text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Espaço institucional seguro e independente do Grupo Bairral para que colaboradores, pacientes, familiares, fornecedores e a comunidade possam registrar relatos, denúncias, elogios, sugestões ou dúvidas com absoluta garantia de sigilo e não retaliação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/registrar" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<FilePlus className="w-5 h-5" />}
                className="w-full sm:w-auto font-bold shadow-lg"
              >
                Registrar Manifestação
              </Button>
            </Link>

            <Link to="/acompanhar" className="w-full sm:w-auto">
              <Button
                variant="dark-outline"
                size="lg"
                leftIcon={<Search className="w-5 h-5 text-[#FDC503]" />}
                className="w-full sm:w-auto font-medium shadow-sm"
              >
                Acompanhar Manifestação
              </Button>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto border-t border-[#262626] text-left">
            <div className="p-3 bg-[#262626]/60 border border-[#333333] rounded">
              <div className="text-[#FDC503] font-bold text-lg font-heading">100%</div>
              <div className="text-[11px] text-[#A3A3A3]">Criptografado &amp; Sigiloso</div>
            </div>
            <div className="p-3 bg-[#262626]/60 border border-[#333333]">
              <div className="text-[#FDC503] font-bold text-lg font-heading">Até 48h</div>
              <div className="text-[11px] text-[#A3A3A3]">Triagem Inicial da Comissão</div>
            </div>
            <div className="p-3 bg-[#262626]/60 border border-[#333333]">
              <div className="text-[#FDC503] font-bold text-lg font-heading">LGPD</div>
              <div className="text-[11px] text-[#A3A3A3]">Proteção de Dados Pessoais</div>
            </div>
            <div className="p-3 bg-[#262626]/60 border border-[#333333]">
              <div className="text-[#FDC503] font-bold text-lg font-heading">24 / 7</div>
              <div className="text-[11px] text-[#A3A3A3]">Disponibilidade para Envio</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pillars Section: Anonimato, Confidencialidade e Não Retaliação */}
      <Container size="lg" className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="yellow" size="sm" className="font-bold">Garantias Fundamentais</Badge>
          <Typography variant="h2">Compromisso com a Proteção ao Relator</Typography>
          <p className="text-xs text-[#525252] leading-relaxed">
            O Grupo Bairral assegura a aplicação dos mais altos padrões de segurança tecnológica e suporte institucional.
          </p>
        </div>

        <Grid cols={3} gap="6">
          <Surface variant="card" className="space-y-4 hover:border-[#171717] transition-all group">
            <div className="w-12 h-12 bg-[#FFF4C2] text-[#806300] rounded flex items-center justify-center group-hover:bg-[#FDC503] group-hover:text-[#0A0A0A] transition-colors">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <Typography variant="h3">Garantia de Anonimato</Typography>
              <p className="text-xs text-[#525252] leading-relaxed">
                Você tem a opção de registrar sua manifestação sem revelar seu nome. Nosso sistema elimina logs de endereço IP e metadados de navegação.
              </p>
            </div>
            <Link to="/anonimato" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A] hover:underline pt-2">
              Detalhes técnicos de anonimato <ChevronRight className="w-4 h-4 text-[#FDC503]" />
            </Link>
          </Surface>

          <Surface variant="card" className="space-y-4 hover:border-[#171717] transition-all group">
            <div className="w-12 h-12 bg-[#F5F5F5] text-[#171717] rounded flex items-center justify-center group-hover:bg-[#171717] group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <Typography variant="h3">Confidencialidade Absoluta</Typography>
              <p className="text-xs text-[#525252] leading-relaxed">
                Todas as informações recebidas são tratadas de forma restrita e sigilosa por membros credenciados da Comissão de Ética e Ouvidoria.
              </p>
            </div>
            <Link to="/privacidade" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A] hover:underline pt-2">
              Conheça a política de sigilo <ChevronRight className="w-4 h-4 text-[#FDC503]" />
            </Link>
          </Surface>

          <Surface variant="card" className="space-y-4 hover:border-[#171717] transition-all group">
            <div className="w-12 h-12 bg-[#F5F5F5] text-[#171717] rounded flex items-center justify-center group-hover:bg-[#171717] group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div className="space-y-2">
              <Typography variant="h3">Política de Não Retaliação</Typography>
              <p className="text-xs text-[#525252] leading-relaxed">
                É estritamente vedada qualquer sanção, perseguição ou desvantagem profissional contra qualquer pessoa que relate um fato de boa-fé.
              </p>
            </div>
            <Link to="/termos" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A] hover:underline pt-2">
              Consulte os termos de uso <ChevronRight className="w-4 h-4 text-[#FDC503]" />
            </Link>
          </Surface>
        </Grid>
      </Container>

      {/* Types of Manifestations Section */}
      <section className="bg-[#F5F5F5] py-12 border-y border-[#E5E5E5]">
        <Container size="lg" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="neutral" size="sm" className="font-bold">Classificação das Ocorrências</Badge>
              <Typography variant="h2">Tipos de Manifestação Aceitos</Typography>
              <p className="text-xs text-[#525252]">
                Escolha a modalidade adequada para o correto direcionamento da sua demanda.
              </p>
            </div>
            <Link to="/registrar">
              <Button variant="primary" size="sm" leftIcon={<FilePlus className="w-4 h-4" />}>
                Registrar Agora
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-white border border-[#E5E5E5] rounded space-y-3 hover:border-[#171717] transition-all">
              <div className="w-10 h-10 bg-[#FEF2F2] text-[#DC2626] rounded flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">Denúncia</h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Relatos de descumprimento de normas, assédio, má conduta, inconsistências financeiras ou fraudes.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded space-y-3 hover:border-[#171717] transition-all">
              <div className="w-10 h-10 bg-[#F0FDF4] text-[#16A34A] rounded flex items-center justify-center font-bold">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">Elogio</h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Reconhecimento pelo bom atendimento, dedicação, acolhimento ou eficiência de colaboradores e equipes.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded space-y-3 hover:border-[#171717] transition-all">
              <div className="w-10 h-10 bg-[#FEFCE8] text-[#CA8A04] rounded flex items-center justify-center font-bold">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">Sugestão</h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Ideias de melhorias em processos, instalações, rotinas de atendimento ou novas iniciativas.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded space-y-3 hover:border-[#171717] transition-all">
              <div className="w-10 h-10 bg-[#FFF7ED] text-[#EA580C] rounded flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">Reclamação</h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Manifestação de insatisfação quanto a prazos, procedimentos, serviços prestados ou infraestrutura.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E5E5E5] rounded space-y-3 hover:border-[#171717] transition-all">
              <div className="w-10 h-10 bg-[#EFF6FF] text-[#2563EB] rounded flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">Dúvida</h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Pedidos de esclarecimento sobre regimentos internos, normas de ética, direitos e deveres.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Steps / Process Section */}
      <Container size="lg" className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="neutral" size="sm" className="font-bold">Transparência no Processo</Badge>
          <Typography variant="h2">Etapas do Atendimento</Typography>
          <p className="text-xs text-[#525252]">
            Acompanhe o percurso que sua manifestação realiza desde o envio até o parecer final.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 bg-white border border-[#E5E5E5] rounded space-y-2 relative">
            <div className="w-7 h-7 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">
              1
            </div>
            <h4 className="font-heading font-bold text-xs text-[#0A0A0A]">Registro &amp; Protocolo</h4>
            <p className="text-[11px] text-[#525252] leading-relaxed">
              Você preenche a manifestação e o sistema gera o número de protocolo e a chave de acesso.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-white border border-[#E5E5E5] rounded space-y-2 relative">
            <div className="w-7 h-7 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">
              2
            </div>
            <h4 className="font-heading font-bold text-xs text-[#0A0A0A]">Triagem &amp; Classificação</h4>
            <p className="text-[11px] text-[#525252] leading-relaxed">
              O comitê avalia a admissibilidade e direciona o caso para o departamento responsável em 48h.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-white border border-[#E5E5E5] rounded space-y-2 relative">
            <div className="w-7 h-7 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">
              3
            </div>
            <h4 className="font-heading font-bold text-xs text-[#0A0A0A]">Análise &amp; Apuração</h4>
            <p className="text-[11px] text-[#525252] leading-relaxed">
              Investigação técnica e sigilosa das informações apresentadas e verificação de evidências.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-white border border-[#E5E5E5] rounded space-y-2 relative">
            <div className="w-7 h-7 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">
              4
            </div>
            <h4 className="font-heading font-bold text-xs text-[#0A0A0A]">Plano de Ação</h4>
            <p className="text-[11px] text-[#525252] leading-relaxed">
              Definição de providências corretivas, administrativas ou operacionais para resolução.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 bg-white border border-[#E5E5E5] rounded space-y-2 relative">
            <div className="w-7 h-7 bg-[#16A34A] text-white font-bold text-xs rounded-full flex items-center justify-center">
              5
            </div>
            <h4 className="font-heading font-bold text-xs text-[#0A0A0A]">Resposta &amp; Conclusão</h4>
            <p className="text-[11px] text-[#525252] leading-relaxed">
              Envio do parecer conclusivo ao manifesto pelo canal de consulta de protocolo.
            </p>
          </div>
        </div>
      </Container>

      {/* FAQ Block Preview */}
      <Container size="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
          <div>
            <Typography variant="h2">Perguntas Frequentes</Typography>
            <p className="text-xs text-[#737373]">Esclareça as dúvidas mais recorrentes sobre a utilização do portal</p>
          </div>
          <Link to="/perguntas-frequentes">
            <Button variant="outline" size="sm" className="text-xs">
              Ver FAQ Completo <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#FDC503]" />
            </Button>
          </Link>
        </div>

        <Surface variant="card">
          <Accordion items={mainFaqs} allowMultiple />
        </Surface>
      </Container>

      {/* Privacy / LGPD Block */}
      <Container size="lg">
        <div className="bg-[#171717] text-white p-8 rounded border border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[#FDC503] font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" /> Governança de Dados &amp; LGPD
            </div>
            <h3 className="font-heading text-lg font-bold text-white">
              Tratamento ético e legal de dados pessoais nas operações do Grupo Bairral
            </h3>
            <p className="text-xs text-[#A3A3A3] max-w-2xl leading-relaxed">
              O Grupo Bairral atua sob rigoroso cumprimento da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), assegurando a guarda protegida de relatórios e a inviolabilidade da privacidade.
            </p>
          </div>
          <Link to="/privacidade" className="shrink-0">
            <Button variant="primary" size="md" className="font-bold">
              Ler Política de Privacidade
            </Button>
          </Link>
        </div>
      </Container>

      {/* Alternative Channels Section */}
      <Container size="lg" className="space-y-6">
        <div className="text-center space-y-1">
          <Typography variant="h3">Canais Alternativos de Atendimento</Typography>
          <p className="text-xs text-[#525252]">
            Caso prefira, você também pode entrar em contato com a Ouvidoria e Ética do Grupo Bairral através dos canais institucionais diretos:
          </p>
        </div>

        <Grid cols={3} gap="4">
          <div className="p-4 bg-white border border-[#E5E5E5] rounded flex items-start gap-3">
            <div className="p-2.5 bg-[#F5F5F5] text-[#171717] rounded shrink-0">
              <MapPin className="w-5 h-5 text-[#FDC503]" />
            </div>
            <div>
              <h5 className="font-heading font-bold text-xs text-[#0A0A0A]">Atendimento Presencial / Sede</h5>
              <p className="text-xs text-[#525252] mt-0.5">
                Sede Grupo Bairral<br />
                Rua Antônio Manoel Menineia, S/N — Burajuba, Barcarena/PA
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded flex items-start gap-3">
            <div className="p-2.5 bg-[#F5F5F5] text-[#171717] rounded shrink-0">
              <Mail className="w-5 h-5 text-[#FDC503]" />
            </div>
            <div>
              <h5 className="font-heading font-bold text-xs text-[#0A0A0A]">E-mail de Ética &amp; Ouvidoria</h5>
              <p className="text-xs text-[#525252] mt-0.5">
                ouvidoria@grupobairral.com.br<br />
                comissao.etica@grupobairral.com.br
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded flex items-start gap-3">
            <div className="p-2.5 bg-[#F5F5F5] text-[#171717] rounded shrink-0">
              <Phone className="w-5 h-5 text-[#FDC503]" />
            </div>
            <div>
              <h5 className="font-heading font-bold text-xs text-[#0A0A0A]">Telefone &amp; WhatsApp</h5>
              <p className="text-xs text-[#525252] mt-0.5">
                (91) 99141-7722<br />
                Segunda a Sexta, das 08h às 18h
              </p>
            </div>
          </div>
        </Grid>
      </Container>
    </div>
  );
}
