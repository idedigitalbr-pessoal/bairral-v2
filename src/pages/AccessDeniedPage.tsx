import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, UserCheck, Lock } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS, AdminRole } from '../types/auth';

export function AccessDeniedPage() {
  const navigate = useNavigate();
  const { user, switchSimulatedUser } = useAuth();

  return (
    <Container size="sm" className="py-16 space-y-6">
      <Surface variant="card" className="p-8 text-center space-y-6 border border-[#E5E5E5] bg-white shadow-xl">
        <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#FCA5A5]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Typography variant="h2" className="text-xl font-extrabold text-[#171717]">
            Acesso Negado (403)
          </Typography>
          <p className="text-xs text-[#525252] max-w-md mx-auto leading-relaxed">
            Seu perfil corporativo atual não possui privilégios de acesso para visualizar este recurso ou realizar esta operação no Painel do Grupo Bairral.
          </p>
        </div>

        {user && (
          <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md text-left text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#737373]">Usuário Conectado:</span>
              <span className="font-bold text-[#171717]">{user.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#737373]">Perfil Atual:</span>
              <span className="font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                {user.roleName} ({user.role})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#737373]">Permissões Ativas:</span>
              <span className="font-semibold text-[#171717]">
                {user.permissions.length} de 15 concedidas
              </span>
            </div>
          </div>
        )}

        {/* Nota de Arquitetura NestJS */}
        <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded text-xs text-[#1E40AF] text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-4 h-4 text-[#2563EB]" />
            <span>Nota de Arquitetura Backend:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Em ambiente de produção, esta restrição é aplicada de forma estrita pelos Guards de autorização do NestJS (Reflector & Guard RBAC) e pelo JWT Middleware.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs"
          >
            Voltar à Página Anterior
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin')}
            leftIcon={<Home className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs font-bold"
          >
            Ir ao Dashboard Admin
          </Button>
        </div>

        {/* Teste alternativo de perfil na simulação */}
        <div className="pt-4 border-t border-[#E5E5E5] text-left space-y-2">
          <p className="text-[11px] font-bold text-[#171717]">
            Deseja testar com outro perfil que tenha esta permissão? (Modo Homologação)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(['SUPER_ADMIN', 'ETHICS_MANAGER', 'AUDITOR'] as AdminRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  switchSimulatedUser(r);
                  navigate('/admin');
                }}
                className="text-[10px] bg-[#FAFAFA] border border-[#D4D4D4] hover:bg-[#F4F4F5] px-2.5 py-1 rounded text-[#171717] font-semibold transition-colors"
              >
                Alternar para {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>
      </Surface>
    </Container>
  );
}
