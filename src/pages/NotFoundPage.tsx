import { Link } from 'react-router-dom';
import { FileQuestion, Home, Search, FilePlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Surface } from '../components/ui/Surface';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <Container size="sm">
        <Surface variant="card" className="text-center space-y-6 p-8 border border-[#E5E5E5] shadow-md">
          {/* Abstract Geometric Icon Placeholder */}
          <div className="w-16 h-16 bg-[#171717] text-[#FDC503] rounded-lg flex items-center justify-center mx-auto shadow-sm">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-[#FFF4C2] text-[#806300] font-bold text-xs rounded-full">
              Erro 404 &bull; Grupo Bairral
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#0A0A0A]">Página Não Encontrada</h1>
            <p className="text-xs text-[#525252] max-w-sm mx-auto leading-relaxed">
              O endereço solicitado não existe ou pode ter sido movido. Utilize os atalhos abaixo para navegar pelo Canal de Ética.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />} className="w-full font-bold">
                Página Inicial
              </Button>
            </Link>

            <Link to="/acompanhar" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" leftIcon={<Search className="w-4 h-4 text-[#FDC503]" />} className="w-full">
                Consultar Protocolo
              </Button>
            </Link>
          </div>
        </Surface>
      </Container>
    </div>
  );
}

