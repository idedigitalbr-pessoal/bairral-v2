import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, AlertCircle, CheckCircle2, FilePlus, Key, ShieldAlert } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Typography } from '../components/ui/Typography';
import { Surface } from '../components/ui/Surface';
import { Grid } from '../components/ui/Grid';
import { Button } from '../components/ui/Button';

export function AnonymityPage() {
  return (
    <Container size="lg" className="py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
        <Link to="/" className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Typography variant="h2">Garantia de Anonimato e Proteção ao Relator</Typography>
          <p className="text-xs text-[#737373]">Compromisso ético, tecnológico e institucional do Grupo Bairral de Psiquiatria</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#171717] text-white p-6 rounded border border-[#262626] space-y-3">
        <div className="flex items-center gap-2 text-[#FDC503] font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" /> Sigilo Absoluto e Não Retaliação
        </div>
        <h3 className="font-heading text-xl font-bold text-white">
          Sua identidade permanece 100% protegida ao optar pelo relato anônimo.
        </h3>
        <p className="text-xs text-[#D4D4D4] leading-relaxed max-w-3xl">
          A infraestrutura tecnológica do canal foi especificamente desenvolvida para impossibilitar a correlação entre sua identidade de rede, navegador ou dispositivo e a manifestação registrada.
        </p>
      </div>

      {/* Technical Safeguards */}
      <div className="space-y-4">
        <Typography variant="h3">Mecanismos Técnicos de Proteção</Typography>
        <Grid cols={3} gap="6">
          <Surface variant="card" className="space-y-3">
            <div className="w-10 h-10 bg-[#FFF4C2] text-[#806300] rounded flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <Typography variant="h4">Desvinculação de IP e Navegador</Typography>
            <p className="text-xs text-[#525252] leading-relaxed">
              O sistema descarta automaticamente endereços IP, cookies e cabeçalhos User-Agent no momento da gravação da manifestação no banco de dados.
            </p>
          </Surface>

          <Surface variant="card" className="space-y-3">
            <div className="w-10 h-10 bg-[#F5F5F5] text-[#171717] rounded flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <Typography variant="h4">Chave Hash Criptográfica</Typography>
            <p className="text-xs text-[#525252] leading-relaxed">
              O acesso de retorno ao relato ocorre única e exclusivamente via protocolo e chave hash gerados no ato do registro, sem armazenamento de senhas pessoais.
            </p>
          </Surface>

          <Surface variant="card" className="space-y-3">
            <div className="w-10 h-10 bg-[#F5F5F5] text-[#171717] rounded flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <Typography variant="h4">Servidores e Redes Isolados</Typography>
            <p className="text-xs text-[#525252] leading-relaxed">
              A base de dados do Canal de Ética é hospedada em ambiente isolado e de alta segurança da rede corporativa do Grupo Bairral.
            </p>
          </Surface>
        </Grid>
      </div>

      {/* Guidelines for Safe Reporting */}
      <Surface variant="card" className="space-y-4 border-l-4 border-l-[#FDC503]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A]">
          <ShieldAlert className="w-4 h-4 text-[#FDC503]" />
          <span>Recomendações para Manter seu Próprio Anonimato</span>
        </div>

        <p className="text-xs text-[#525252] leading-relaxed">
          Para assegurar que nenhum detalhe indireto revele sua identidade durante a investigação:
        </p>

        <ul className="space-y-2 text-xs text-[#262626]">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <span>Evite incluir detalhes de rotinas exclusivas ou conversas particulares das quais apenas você fez parte.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <span>Ao enviar fotos ou documentos anexos, verifique se o arquivo não possui seu nome nos metadados ou propriedades da imagem.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <span>Guarde seu número de protocolo e chave de acesso em local pessoal e seguro (por exemplo, anotado manualmente).</span>
          </li>
        </ul>
      </Surface>

      {/* CTA Button */}
      <div className="flex items-center justify-between p-6 bg-[#F5F5F5] border border-[#E5E5E5] rounded">
        <div>
          <h4 className="font-heading font-bold text-sm text-[#0A0A0A]">Pronto para enviar sua manifestação com total segurança?</h4>
          <p className="text-xs text-[#525252]">Escolha entre a modalidade anônima ou identificada a qualquer momento.</p>
        </div>
        <Link to="/registrar">
          <Button variant="primary" leftIcon={<FilePlus className="w-4 h-4" />}>
            Iniciar Manifestação
          </Button>
        </Link>
      </div>
    </Container>
  );
}

