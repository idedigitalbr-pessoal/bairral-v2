import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Surface } from '../components/ui/Surface';

export function TermsPage() {
  return (
    <Container size="md" className="py-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
        <Link to="/" className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Typography variant="h2">Termos de Uso do Portal</Typography>
          <p className="text-xs text-[#737373]">Regras, diretrizes e responsabilidades no uso do Canal de Ética</p>
        </div>
      </div>

      <Surface variant="card" className="space-y-6 text-xs text-[#262626] leading-relaxed">
        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">1</span>
            Aceitação dos Termos
          </h3>
          <p>
            Ao utilizar o Canal de Ética e Integridade do Grupo Bairral para registrar qualquer tipo de relato, o usuário declara ter lido, compreendido e aceito expressamente as regras destes Termos de Uso e da Política de Privacidade.
          </p>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">2</span>
            Dever de Boa-Fé e Veracidade das Informações
          </h3>
          <p>
            O portal deve ser utilizado com estrita responsabilidade ética e boa-fé. O usuário compromete-se a fornecer informações verdadeiras e fundamentadas dentro do seu melhor conhecimento.
          </p>
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded text-[#991B1B] font-medium flex items-start gap-2 mt-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
            <span>
              <strong>Alerta de Calúnia e Difamação:</strong> O uso do canal para imputação sabidamente falsa de crimes, difamação ou perseguição pessoal é expressamente vedado e constitui infração sujeita às medidas disciplinares e legais cabíveis nos termos dos arts. 138, 139 e 140 do Código Penal Brasileiro.
            </span>
          </div>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">3</span>
            Guarda e Sigilo do Número de Protocolo e Chave
          </h3>
          <p>
            Nas manifestações anônimas, a guarda do número de protocolo e da chave de acesso é de responsabilidade exclusiva e inalienável do manifestante. Como o sistema não armazena vinculos de identificação com tais credenciais, a perda das chaves impedirá a visualização da resposta sem que o sistema possa recuperá-la.
          </p>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">4</span>
            Compromisso de Proteção e Não Retaliação
          </h3>
          <p>
            O Grupo Bairral garante que nenhum colaborador, paciente ou parceiro comercial que registrar uma manifestação de boa-fé sofrerá qualquer forma de retaliação, punição, rebaixamento, perda de benefícios ou discriminação interna.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">5</span>
            Legislação Aplicável e Foro
          </h3>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas relativas ao uso deste portal serão submetidas ao Foro da Comarca de Barcarena, Estado do Pará.
          </p>
        </div>
      </Surface>
    </Container>
  );
}

