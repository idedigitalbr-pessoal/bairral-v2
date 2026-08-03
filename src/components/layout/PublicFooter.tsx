import { Link } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { ShieldCheck, Lock, Building, ExternalLink } from 'lucide-react';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#171717] border-t border-[#262626] text-[#A3A3A3] text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Grupo Bairral Identity */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" theme="dark" />
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Canal institucional seguro e confidencial para registros de relatos, denúncias e manifestações do Grupo Bairral.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#FDC503] font-semibold bg-[#262626] px-3 py-1.5 rounded w-fit border border-[#333333]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Garantia de Anonimato e Criptografia</span>
            </div>
          </div>

          {/* Col 2: Atendimento e Manifestações */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Canal de Manifestações
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/registrar" className="hover:text-[#FDC503] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FDC503]"></span>
                  Registrar Nova Manifestação
                </Link>
              </li>
              <li>
                <Link to="/acompanhar" className="hover:text-[#FDC503] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]"></span>
                  Acompanhar por Protocolo
                </Link>
              </li>
              <li>
                <Link to="/perguntas-frequentes" className="hover:text-[#FDC503] transition-colors">
                  Perguntas Frequentes (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/anonimato" className="hover:text-[#FDC503] transition-colors">
                  Como funciona o Anonimato
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparência & Governança */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Conformidade & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacidade" className="hover:text-white transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#737373]" />
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white transition-colors">
                  Termos de Uso do Portal
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-white transition-colors">
                  Guia do Design System (FASE 4)
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-[#FDC503] hover:underline flex items-center gap-1 font-semibold">
                  <Building className="w-3 h-3" />
                  Acesso Restrito / Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Unidade Corporativa */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Sede Grupo Bairral
            </h4>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Rua Antônio Manoel Menineia, S/N — Burajuba<br />
              Barcarena / PA — CEP 68447-000<br />
              Tel: (91) 99141-7722
            </p>
            <div className="pt-1">
              <a
                href="https://grupobairral.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#D4D4D4] hover:text-[#FDC503] underline font-medium"
              >
                grupobairral.com.br <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#262626] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#737373]">
          <p>
            Grupo Bairral &copy; {currentYear}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="hover:text-[#A3A3A3]">Privacidade</Link>
            <span>•</span>
            <Link to="/termos" className="hover:text-[#A3A3A3]">Termos</Link>
            <span>•</span>
            <Link to="/anonimato" className="hover:text-[#A3A3A3]">Proteção ao Relator</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
