import React, { useState } from 'react';
import { Lock, AlertTriangle, ArrowRight, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Surface } from '../ui/Surface';
import { Typography } from '../ui/Typography';
import { FormField, FormLabel } from '../forms/FormField';
import { Input } from '../forms/Input';
import { Button } from '../ui/Button';

export function SessionExpiredDialog() {
  const { isSessionExpired, user, login, logout, clearSessionExpired } = useAuth();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSessionExpired) return null;

  const handleReauthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Informe sua senha corporativa para prosseguir.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login({ email: user?.email || 'admin@grupobairral.com.br', password });
      setPassword('');
      clearSessionExpired();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Senha incorreta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutClick = async () => {
    clearSessionExpired();
    await logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
      <Surface variant="card" className="w-full max-w-md bg-white p-6 space-y-5 border-t-4 border-[#DC2626] shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-[#FEF2F2] rounded-full text-[#DC2626] shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <Typography variant="h3" className="text-base font-bold text-[#171717]">
              Sessão Expirada por Inatividade
            </Typography>
            <p className="text-xs text-[#525252]">
              Por medidas de segurança da comissão do Grupo Bairral, sua sessão foi pausada.
            </p>
          </div>
        </div>

        {user && (
          <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#171717] text-[#FDC503] font-bold flex items-center justify-center shrink-0 text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="font-bold text-[#171717] truncate">{user.name}</p>
              <p className="text-[11px] text-[#737373] truncate">{user.email}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleReauthenticate} className="space-y-4">
          <FormField>
            <FormLabel required>Digite sua Senha para Reautenticar</FormLabel>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
              autoFocus
            />
          </FormField>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogoutClick}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-xs text-[#525252]"
            >
              Sair da Conta
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              Continuar Sessão
            </Button>
          </div>
        </form>
      </Surface>
    </div>
  );
}
