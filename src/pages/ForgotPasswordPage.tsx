import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FormField, FormLabel } from '../components/forms/FormField';
import { Surface } from '../components/ui/Surface';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Informe um e-mail corporativo válido.');
      return;
    }

    try {
      const msg = await forgotPassword(email);
      setSuccessMsg(msg);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao solicitar redefinição de senha.');
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
            <h1 className="font-heading text-lg font-bold text-white">Esqueci Minha Senha</h1>
            <p className="text-xs text-[#A3A3A3]">Recuperação de acesso corporativo seguro</p>
          </div>
        </div>

        <Surface variant="card" className="space-y-5 bg-white shadow-2xl border-none p-6">
          {successMsg ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#171717]">Solicitação Enviada!</h3>
                <p className="text-xs text-[#525252] leading-relaxed">{successMsg}</p>
              </div>
              <Link to="/redefinir-senha?token=mock-reset-token-bairral">
                <Button variant="outline" className="w-full justify-center text-xs mt-2 font-semibold">
                  Simular Clique no Link do E-mail (Redefinir Agora)
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded text-xs text-[#525252]">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Informe seu e-mail corporativo cadastrado para receber as instruções.</span>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-xs text-[#991B1B] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errorMsg}</span>
                </div>
              )}

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

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center font-bold text-sm h-11"
                isLoading={isLoading}
              >
                Enviar Instruções de Redefinição
              </Button>
            </form>
          )}

          <div className="text-center text-[11px] text-[#737373] pt-2 border-t border-[#E5E5E5]">
            Dúvidas? Entre em contato com a TI ou Segurança da Informação do Grupo Bairral.
          </div>
        </Surface>
      </div>
    </div>
  );
}
