import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export function SkipLink({ targetId = 'main-content', label = 'Pular para o conteúdo principal' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#FDC503] focus:text-[#0A0A0A] focus:font-extrabold focus:text-xs focus:rounded-md focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
    >
      {label}
    </a>
  );
}
