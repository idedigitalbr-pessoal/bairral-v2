import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Key, Lock, Mail, ShieldCheck, CheckCircle2, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Surface } from '../components/ui/Surface';
import { useAuth } from '../context/AuthContext';

export function FirstAccessPage() {
  const navigate = useNavigate();
  const { user, firstAccess, isLoading } = useAuth();

  const [email, setEmail] = useState(user?.email || 'novo.usuario@grupobairral.com.br');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      setErrorMsg('Sua nova senha deve cumprir todas as políticas de complexidade.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('A confirmação de senha não confere.');
      return;
    }

    try {
      await firstAccess(email, newPassword);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao registrar nova senha no primeiro acesso.');
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <BrandLogo size="lg" theme="dark" />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-lg font-bold text-white">Primeiro Acesso ao Painel</h1>
            <p className="text-xs text-[#A3A3A3]">Definição obrigatória de senha pessoal e intransferível</p>
          </div>
        </div>

        <Surface variant="card" className="space-y-5 bg-white shadow-2xl border-none p-6">
          <div className="p-3 bg-[#FEFCE8] border border-[#FEF08A] rounded-md text-xs text-[#856404] flex items-start gap-2">
            <Key className="w-4 h-4 shrink-0 text-[#EAB308] mt-0.5" />
            <span>
              Por exigência do protocolo de conformidade do Grupo Bairral, a senha temporária deve ser substituída antes de seu primeiro acesso ao painel.
            </span>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-[#737373]" />}
                required
              />
            </FormField>

            <FormField>
              <FormLabel required>Criar Sua Nova Senha</FormLabel>
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

            {/* Checklist de requisitos */}
            <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded space-y-1.5 text-[11px] text-[#525252]">
              <p className="font-semibold text-[#171717]">Requisitos do Primeiro Acesso:</p>
              <div className="grid grid-cols-2 gap-1">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#16A34A] font-semibold' : 'text-[#737373]'}`}>
                  <Check className={`w-3 h-3 ${hasMinLength ? 'text-[#16A34A]' : 'text-[#D4D4D4]'}`} />
                  <span>Ao menos 8 digitos</span>
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
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ativar Minha Conta e Acessar
            </Button>
          </form>
        </Surface>
      </div>
    </div>
  );
}
