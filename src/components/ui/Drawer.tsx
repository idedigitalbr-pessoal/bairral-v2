import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  position?: 'left' | 'right';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-md bg-white border-[#E5E5E5] shadow-2xl flex flex-col h-full motion-reduce:animate-none',
          position === 'right' ? 'ml-auto border-l' : 'mr-auto border-r'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F5F5F5]">
          <h2 className="font-heading text-base font-bold text-[#0A0A0A]">{title}</h2>
          <IconButton icon={X} ariaLabel="Fechar gaveta" variant="ghost" size="sm" onClick={onClose} />
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto text-xs text-[#262626]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
