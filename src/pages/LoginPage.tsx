import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowLeft, Users, Key, AlertTriangle, ChevronRight } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FormField, FormLabel, FormMessage } from '../components/forms/FormField';
import { Surface } from '../components/ui/Surface';
import { useAuth } from '../context/AuthContext';
import { AdminRole, AdminRoleEnum, ROLE_LABELS } from '../types/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchSimulatedUser, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fromPath = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg('Informe seu e-mail corporativo.');
      return;
    }

    try {
      const user = await login({ email, password });
      if (user.mustChangePassword) {
        navigate('/primeiro-acesso');
      } else {
        navigate(fromPath, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha na autenticação. Verifique os dados fornecidos.');
    }
  };

  const handleSimulatedLogin = (role: AdminRole) => {
    switchSimulatedUser(role);
    navigate(fromPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FDC503]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-xs text-[#A3A3A3] hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Portal Público
      </Link>

      <div className="w-full max-w-lg space-y-6 my-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <BrandLogo size="lg" theme="dark" />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-lg font-bold text-white">Painel Administrativo & Compliance</h1>
            <p className="text-xs text-[#A3A3A3]">Canal de Integridade do Grupo Bairral de Psiquiatria</p>
          </div>
        </div>

        {/* Form Container */}
        <Surface variant="card" className="space-y-5 bg-white shadow-2xl border-none p-6">
          <div className="flex items-center gap-2 p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded text-xs text-[#525252]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>Autenticação corporativa com controle de permissões por perfil.</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField>
              <FormLabel required>E-mail Corporativo</FormLabel>
              <Input
                type="email"
                placeholder="seu.nome@grupobairral.com.br"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                leftIcon={<Mail className="w-4 h-4 text-[#737373]" />}
                required
              />
            </FormField>

            <FormField>
              <div className="flex items-center justify-between">
                <FormLabel required>Senha de Acesso</FormLabel>
                <Link to="/esqueci-senha" className="text-[11px] text-[#737373] hover:text-[#0A0A0A] underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center font-bold text-sm h-11"
              isLoading={isLoading}
            >
              Entrar no Painel Admin
            </Button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#737373] pt-2 border-t border-[#E5E5E5]">
            <Link to="/primeiro-acesso" className="hover:text-[#0A0A0A] underline flex items-center gap-1">
              <Key className="w-3 h-3 text-[#FDC503]" /> Primeiro acesso? Trocar senha inicial
            </Link>
          </div>

          {/* Seletor Rápido de Perfis Simulados para Homologação */}
          <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#171717]">
                <Users className="w-4 h-4 text-[#FDC503]" />
                <span>Simulação Rápida de Perfis (Homologação)</span>
              </div>
              <span className="text-[10px] text-[#737373] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#E5E5E5]">
                MSW Mock
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-left">
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSimulatedLogin(r)}
                  className="p-2 border border-[#E5E5E5] rounded bg-[#FAFAFA] hover:bg-[#F4F4F5] hover:border-[#A1A1AA] transition-all text-left group"
                >
                  <p className="text-[11px] font-bold text-[#171717] group-hover:text-[#0A0A0A]">
                    {ROLE_LABELS[r]}
                  </p>
                  <p className="text-[9px] text-[#737373] truncate">Entrar como {r}</p>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[#A3A3A3] text-center italic">
              NOTA: Em produção, a autenticação e verificação de tokens JWT serão realizadas no backend NestJS.
            </p>
          </div>
        </Surface>

        <p className="text-center text-[11px] text-[#737373]">
          Grupo Bairral de Psiquiatria &copy; {new Date().getFullYear()} — Uso Interno Restrito
        </p>
      </div>
    </div>
  );
}
