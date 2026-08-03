import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Surface } from '../components/ui/Surface';
import { useAuth } from '../context/AuthContext';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'mock-reset-token';

  const { resetPassword, isLoading } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Regras de validação de senha
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      setErrorMsg('A senha não atende aos requisitos mínimos de segurança do Grupo Bairral.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('A confirmação de senha não coincide com a nova senha.');
      return;
    }

    try {
      const msg = await resetPassword(token, newPassword);
      setSuccessMsg(msg);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao redefinir senha.');
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <Link
        to="/login"
        className="absolute top-6 left-6 text-xs text-[#A3A3A3] hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Login
      </Link>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <BrandLogo size="lg" theme="dark" />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-lg font-bold text-white">Redefinição de Senha</h1>
            <p className="text-xs text-[#A3A3A3]">Crie uma nova senha segura para sua conta corporativa</p>
          </div>
        </div>

        <Surface variant="card" className="space-y-5 bg-white shadow-2xl border-none p-6">
          {successMsg ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#171717]">Senha Alterada com Sucesso!</h3>
                <p className="text-xs text-[#525252] leading-relaxed">{successMsg}</p>
                <p className="text-[11px] text-[#737373]">Redirecionando para a tela de login...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <FormField>
                <FormLabel required>Nova Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel required>Confirmar Nova Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
                  required
                />
              </FormField>

              {/* Checklist de Validação */}
              <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded space-y-1.5 text-[11px] text-[#525252]">
                <p className="font-semibold text-[#171717] mb-1">Requisitos Mínimos da Senha:</p>
                <div className="grid grid-cols-2 gap-1">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#16A34A] font-semibold' : 'text-[#737373]'}`}>
                    <Check className={`w-3 h-3 ${hasMinLength ? 'text-[#16A34A]' : 'text-[#D4D4D4]'}`} />
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-[#16A34A] font-semibold' : 'text-[#737373]'}`}>
                    <Check className={`w-3 h-3 ${hasUpper ? 'text-[#16A34A]' : 'text-[#D4D4D4]'}`} />
                    <span>Letra Maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-[#16A34A] font-semibold' : 'text-[#737373]'}`}>
                    <Check className={`w-3 h-3 ${hasLower ? 'text-[#16A34A]' : 'text-[#D4D4D4]'}`} />
                    <span>Letra Minúscula</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-[#16A34A] font-semibold' : 'text-[#737373]'}`}>
                    <Check className={`w-3 h-3 ${hasNumber ? 'text-[#16A34A]' : 'text-[#D4D4D4]'}`} />
                    <span>Número</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center font-bold text-sm h-11"
                isLoading={isLoading}
              >
                Salvar Nova Senha
              </Button>
            </form>
          )}
        </Surface>
      </div>
    </div>
  );
}
