import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { useAuth } from '../context/AuthContext';

export function SessionExpiredPage() {
  const navigate = useNavigate();
  const { logout, clearSessionExpired } = useAuth();

  const handleReLogin = async () => {
    clearSessionExpired();
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col justify-center items-center p-4 relative">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="inline-block">
          <BrandLogo size="lg" theme="dark" />
        </div>

        <Surface variant="card" className="p-8 bg-white shadow-2xl border-none space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <Typography variant="h3" className="text-lg font-bold text-[#171717]">
              Sessão Expirada por Segurança
            </Typography>
            <p className="text-xs text-[#525252] leading-relaxed">
              Sua sessão de acesso ao Painel Administrativo do Grupo Bairral expirou devido a um período de inatividade ou invalidação do token.
            </p>
          </div>

          <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded text-left text-xs text-[#737373] space-y-1">
            <div className="flex items-center gap-1.5 text-[#171717] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#FDC503]" />
              <span>Proteção de Dados do Paciente & Compliance</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Para resguardar informações sensíveis da Ouvidoria, é necessário realizar um novo login corporativo.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleReLogin}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full justify-center font-bold text-sm h-11"
          >
            Fazer Novo Login
          </Button>
        </Surface>

        <p className="text-[11px] text-[#737373]">
          Grupo Bairral de Psiquiatria &copy; {new Date().getFullYear()} — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
