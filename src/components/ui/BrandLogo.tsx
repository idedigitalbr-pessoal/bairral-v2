import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'horizontal';
  theme?: 'light' | 'dark' | 'yellow';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Ícone Símbolo Oficial do Grupo Bairral (Fita/Onda Amarela)
 */
export const BairralSymbolIcon: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = 'h-8 w-auto', color = '#FDC503' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 8 82 L 8 60 C 8 46 18 34 32 26 L 64 10 C 74 5 80 -2 80 -12 L 98 -12 L 98 26 C 98 40 88 52 74 60 L 42 76 C 32 81 26 88 26 98 L 26 108 L 8 108 Z"
        fill={color}
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { height: 'h-6', text: 'text-sm', subtext: 'text-[9px]' },
    md: { height: 'h-8', text: 'text-base sm:text-lg', subtext: 'text-[10px]' },
    lg: { height: 'h-10', text: 'text-xl', subtext: 'text-xs' },
    xl: { height: 'h-14', text: 'text-2xl sm:text-3xl', subtext: 'text-sm' },
  };

  const { height, text, subtext } = sizeMap[size];

  // Configuração de cores por tema
  const textPrimary =
    theme === 'dark'
      ? 'text-white'
      : theme === 'yellow'
      ? 'text-[#0A0A0A]'
      : 'text-neutral-900';

  const textSecondary =
    theme === 'dark'
      ? 'text-neutral-400'
      : theme === 'yellow'
      ? 'text-neutral-800'
      : 'text-neutral-600';

  const symbolColor = theme === 'yellow' ? '#171717' : '#FDC503';

  return (
    <div
      className={`flex items-center gap-3 font-heading select-none ${className}`}
    >
      {/* Símbolo Oficial do Grupo Bairral */}
      <BairralSymbolIcon className={`${height} w-auto`} color={symbolColor} />

      {variant !== 'symbol' && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-extrabold tracking-tight ${text}`}
            style={{ fontFamily: 'var(--font-heading, Montserrat, sans-serif)' }}
          >
            GRUPO BAIRRAL
          </span>
          <span
            className={`font-semibold tracking-wider uppercase mt-1 ${subtext} ${textSecondary}`}
          >
            Canal de Ética
          </span>
        </div>
      )}
    </div>
  );
};
