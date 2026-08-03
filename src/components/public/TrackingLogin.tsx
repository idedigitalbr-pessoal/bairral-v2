import React, { useState, useEffect } from 'react';
import { Search, Key, FileText, AlertTriangle, ShieldAlert, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Typography } from '../ui/Typography';
import { FormField, FormLabel, FormMessage } from '../forms/FormField';
import { Input } from '../forms/Input';
import { Button } from '../ui/Button';

interface TrackingLoginProps {
  initialProtocol?: string;
  initialAccessKey?: string;
  onSubmit: (protocol: string, accessKey: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const MAX_ATTEMPTS = 5;

export function TrackingLogin({
  initialProtocol = '',
  initialAccessKey = '',
  onSubmit,
  isLoading,
  errorMessage,
}: TrackingLoginProps) {
  const [protocol, setProtocol] = useState(initialProtocol);
  const [accessKey, setAccessKey] = useState(initialAccessKey);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ protocol?: string; accessKey?: string }>({});

  useEffect(() => {
    if (initialProtocol) setProtocol(initialProtocol);
    if (initialAccessKey) setAccessKey(initialAccessKey);
  }, [initialProtocol, initialAccessKey]);

  useEffect(() => {
    if (errorMessage) {
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setLockCountdown(30);
        }
        return next;
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoading) return;

    const errors: { protocol?: string; accessKey?: string } = {};

    if (!protocol.trim()) {
      errors.protocol = 'Informe o número do protocolo.';
    } else if (protocol.trim().length < 5) {
      errors.protocol = 'O formato do protocolo parece inválido (ex: GB-2025-001).';
    }

    if (!accessKey.trim()) {
      errors.accessKey = 'Informe a chave de acesso.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit(protocol.trim(), accessKey.trim());
    }
  };

  return (
    <Surface variant="card" className="space-y-6 max-w-xl mx-auto shadow-sm border border-[#E5E5E5]">
      <div className="flex items-start gap-3.5 p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
        <div className="p-2.5 bg-[#FFF4C2] text-[#0A0A0A] rounded-md shrink-0 mt-0.5">
          <Key className="w-5 h-5 text-[#856404]" />
        </div>
        <div className="space-y-1">
          <Typography variant="h4" className="text-sm font-semibold text-[#171717]">
            Consulta de Manifestação
          </Typography>
          <p className="text-xs text-[#525252] leading-relaxed">
            Insira abaixo o <strong>Número de Protocolo</strong> e a <strong>Chave de Acesso</strong> recebidos no comprovante de registro do seu relato.
          </p>
        </div>
      </div>

      {/* Alerta de Tentativas Excessivas */}
      {failedAttempts >= 3 && !isLocked && (
        <div className="flex items-start gap-3 p-3.5 bg-[#FEF3C7] border border-[#F59E0B] rounded-md text-[#92400E] text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
          <div>
            <strong>Aviso de Segurança:</strong> Foram registradas {failedAttempts} tentativas malsucedidas de acesso. Restam {MAX_ATTEMPTS - failedAttempts} tentativa(s) antes do bloqueio temporário.
          </div>
        </div>
      )}

      {/* Bloqueio Temporário por Tentativas Excessivas */}
      {isLocked && (
        <div className="flex items-start gap-3 p-4 bg-[#FEE2E2] border border-[#EF4444] rounded-md text-[#991B1B] text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-[#DC2626] mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-sm">Acesso Bloqueado Temporariamente</strong>
            <p className="leading-relaxed">
              Excesso de tentativas de autenticação incorretas. Para proteger a privacidade das informações, aguarde <strong>{lockCountdown} segundos</strong> para tentar novamente.
            </p>
          </div>
        </div>
      )}

      {/* Erro de credenciais retornado pela API */}
      {errorMessage && !isLocked && (
        <div className="flex items-start gap-3 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md text-[#991B1B] text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
          <div className="space-y-0.5">
            <strong>Credenciais Incorretas:</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField>
          <FormLabel required error={!!fieldErrors.protocol}>Número do Protocolo</FormLabel>
          <Input
            value={protocol}
            onChange={(e) => {
              setProtocol(e.target.value);
              if (fieldErrors.protocol) setFieldErrors((prev) => ({ ...prev, protocol: undefined }));
            }}
            placeholder="Ex: GB-2025-001"
            disabled={isLoading || isLocked}
            leftIcon={<FileText className="w-4 h-4 text-[#737373]" />}
            autoCapitalize="characters"
          />
          <FormMessage error={fieldErrors.protocol} />
        </FormField>

        <FormField>
          <FormLabel required error={!!fieldErrors.accessKey}>Chave de Acesso / Senha Confidencial</FormLabel>
          <Input
            type="password"
            value={accessKey}
            onChange={(e) => {
              setAccessKey(e.target.value);
              if (fieldErrors.accessKey) setFieldErrors((prev) => ({ ...prev, accessKey: undefined }));
            }}
            placeholder="Ex: KEY-1234"
            disabled={isLoading || isLocked}
            leftIcon={<Lock className="w-4 h-4 text-[#737373]" />}
          />
          <FormMessage error={fieldErrors.accessKey} />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center font-semibold py-2.5 text-sm"
          disabled={isLoading || isLocked}
          leftIcon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          rightIcon={!isLoading && !isLocked ? <ArrowRight className="w-4 h-4 ml-1" /> : undefined}
        >
          {isLoading ? 'Autenticando e Carregando...' : isLocked ? `Aguarde ${lockCountdown}s` : 'Consultar Manifestação'}
        </Button>
      </form>

      <div className="pt-4 border-t border-[#E5E5E5] text-center space-y-2">
        <p className="text-xs text-[#737373] font-medium">Perdeu seu protocolo ou chave de acesso?</p>
        <p className="text-[11px] text-[#525252] leading-relaxed max-w-md mx-auto">
          Por razões de segurança e garantia absoluta de anonimato, o Grupo Bairral não armazena relacionamentos identificáveis com chaves de acesso anônimas. Caso tenha perdido suas credenciais, será necessário registrar uma nova manifestação.
        </p>
      </div>
    </Surface>
  );
}

