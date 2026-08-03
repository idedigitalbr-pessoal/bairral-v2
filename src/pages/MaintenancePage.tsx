import { Link } from 'react-router-dom';
import { Wrench, Mail, Phone, RefreshCw, ShieldCheck } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { BrandLogo } from '../components/ui/BrandLogo';

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#171717] text-white flex flex-col justify-between p-4 relative overflow-hidden">
      {/* Abstract Background Geometric Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FDC503_1px,transparent_1px)] [background-size:24px_24px]" />

      <header className="py-6 px-4 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-[#262626] relative z-10">
        <BrandLogo theme="dark" size="md" />
        <div className="flex items-center gap-2 text-[11px] text-[#FDC503] font-semibold bg-[#262626] px-3 py-1 rounded border border-[#333333]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Servidores Protegidos</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <Container size="sm">
          <Surface variant="card" className="bg-[#262626] border-[#333333] text-white text-center space-y-6 p-8 shadow-2xl">
            <div className="w-16 h-16 bg-[#171717] text-[#FDC503] rounded-lg flex items-center justify-center mx-auto border border-[#333333]">
              <Wrench className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-[#171717] text-[#FDC503] border border-[#333333] font-bold text-xs rounded-full">
                Manutenção Programada &bull; Canal de Ética
              </span>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Serviço Temporariamente Indisponível
              </h1>
              <p className="text-xs text-[#D4D4D4] max-w-md mx-auto leading-relaxed">
                Estamos realizando atualizações técnicas de segurança na plataforma. Nossos sistemas de análise e apuração continuam ativos internamente.
              </p>
            </div>

            <div className="p-4 bg-[#171717] border border-[#333333] rounded text-left space-y-2 text-xs">
              <h4 className="font-heading font-bold text-[#FDC503] text-xs uppercase tracking-wider">
                Canais Alternativos Durante a Manutenção:
              </h4>
              <div className="flex items-center gap-2 text-[#D4D4D4]">
                <Mail className="w-4 h-4 text-[#FDC503] shrink-0" />
                <span>E-mail: <strong>ouvidoria@grupobairral.com.br</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#D4D4D4]">
                <Phone className="w-4 h-4 text-[#FDC503] shrink-0" />
                <span>Telefone: <strong>(19) 3863-9400</strong> (Seg-Sex 08h-17h)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={() => window.location.reload()}
                className="font-bold"
              >
                Tentar Recarregar
              </Button>
            </div>
          </Surface>
        </Container>
      </main>

      <footer className="py-4 text-center text-[11px] text-[#737373] border-t border-[#262626] relative z-10">
        Grupo Bairral de Psiquiatria &copy; {new Date().getFullYear()}. Todos os direitos reservados.
      </footer>
    </div>
  );
}
