import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, Database, Key, UserCheck, FileText, CheckCircle } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Surface } from '../components/ui/Surface';
import { Badge } from '../components/data-display/Badge';

export function PrivacyPage() {
  return (
    <Container size="md" className="py-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
        <Link to="/" className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Typography variant="h2">Política de Privacidade &amp; Proteção de Dados (LGPD)</Typography>
          <p className="text-xs text-[#737373]">Diretrizes de tratamento e proteção de dados — Grupo Bairral de Psiquiatria</p>
        </div>
      </div>

      <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded text-xs text-[#166534] flex items-center gap-3 font-medium">
        <ShieldCheck className="w-5 h-5 shrink-0 text-[#16A34A]" />
        <div>
          <strong className="block font-bold">Conformidade Legal Ativa:</strong>
          Este portal opera em estrito cumprimento com a Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018).
        </div>
      </div>

      <Surface variant="card" className="space-y-6 text-xs text-[#262626] leading-relaxed">
        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">1</span>
            Controlador dos Dados e Abrangência
          </h3>
          <p>
            O Controlador dos Dados Pessoais é o Grupo Bairral, com sede na Rua Antônio Manoel Menineia, S/N, Bairro Burajuba, Barcarena/PA — CEP 68447-000. Esta política se aplica a todos os relatos, documentos e interações realizados através deste Canal de Ética e Integridade.
          </p>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">2</span>
            Dados Coletados e Opção de Anonimato
          </h3>
          <p>
            O sistema disponibiliza duas modalidades distintas de envio de manifestações:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-[#525252]">
            <li>
              <strong>Manifestações Anônimas:</strong> Nenhum dado de identificação pessoal, IP, cabeçalho de dispositivo ou histórico de cookies é armazenado. Apenas o conteúdo textual do relato e os anexos voluntariamente enviados são salvos.
            </li>
            <li>
              <strong>Manifestações Identificadas:</strong> São coletados os dados informados espontaneamente (nome completo, e-mail, telefone, vínculo corporativo) com a finalidade exclusiva de prestar retornos diretos.
            </li>
          </ul>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">3</span>
            Finalidade e Base Legal do Tratamento
          </h3>
          <p>
            O tratamento das informações tem como base legal o legítimo interesse do Controlador (art. 7º, IX da LGPD) e o cumprimento de obrigações regulatórias da área de saúde e compliance ético. Os dados são utilizados unicamente para apuração de fatos, prevenção de irregularidades e aprimoramento institucional.
          </p>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">4</span>
            Segurança da Informação e Criptografia
          </h3>
          <p>
            O portal emprega padrões avançados de segurança cibernética: tráfego 100% criptografado sob protocolo HTTPS/TLS 1.3, armazenamento com criptografia em repouso e restrição estrita de acesso baseada no princípio de menor privilégio para a Comissão de Ética.
          </p>
        </div>

        <div className="space-y-2 border-b border-[#F5F5F5] pb-4">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">5</span>
            Retenção e Descarte de Registros
          </h3>
          <p>
            Os dados vinculados a manifestações encerradas serão armazenados pelo período estritamente necessário para cumprimento de obrigações legais, regulatórias ou pelo prazo prescricional de apurações contratuais, sendo eliminados de forma segura após esse período.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading font-bold text-sm text-[#0A0A0A] flex items-center gap-2">
            <span className="w-6 h-6 bg-[#171717] text-[#FDC503] font-bold text-xs rounded-full flex items-center justify-center">6</span>
            Contato da Encarregada de Proteção de Dados (DPO)
          </h3>
          <p>
            Para exercer seus direitos como titular de dados pessoais (confirmação, acesso, correção ou eliminação) ou esclarecer dúvidas sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail <strong>dpo@grupobairral.com.br</strong>.
          </p>
        </div>
      </Surface>
    </Container>
  );
}

