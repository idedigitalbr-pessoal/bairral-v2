import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Surface } from '../components/ui/Surface';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FormField, FormLabel } from '../components/forms/FormField';
import { useAuth } from '../context/AuthContext';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, changePassword, isLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg('Informe sua senha atual.');
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      setErrorMsg('A nova senha não atende aos requisitos de segurança do Grupo Bairral.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('A confirmação de senha não confere.');
      return;
    }

    try {
      const msg = await changePassword(currentPassword, newPassword);
      setSuccessMsg(msg);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao alterar senha.');
    }
  };

  return (
    <Container size="sm" className="py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin"
          className="p-2 text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F5] rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Typography variant="h2" className="text-xl font-bold text-[#0A0A0A]">
            Alterar Senha de Acesso
          </Typography>
          <p className="text-xs text-[#737373]">
            Atualize sua credencial confidencial de usuário corporativo
          </p>
        </div>
      </div>

      <Surface variant="card" className="p-6 space-y-5 border border-[#E5E5E5]">
        {user && (
          <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded flex items-center justify-between text-xs text-[#525252]">
            <div>
              <p className="font-bold text-[#171717]">{user.name}</p>
              <p className="text-[11px] text-[#737373]">{user.email} &bull; {user.roleName}</p>
            </div>
            <span className="text-[10px] font-semibold bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded border border-[#A7F3D0]">
              Conta Ativa
            </span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-md text-xs text-[#065F46] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <FormLabel required>Senha Atual</FormLabel>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
              required
            />
          </FormField>

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

          <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded space-y-1.5 text-[11px] text-[#525252]">
            <p className="font-semibold text-[#171717]">Requisitos de Segurança:</p>
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

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="font-bold"
            >
              Atualizar Senha
            </Button>
          </div>
        </form>
      </Surface>
    </Container>
  );
}
