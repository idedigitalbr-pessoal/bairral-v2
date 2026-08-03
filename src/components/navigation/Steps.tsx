import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StepItem {
  title: string;
  description?: string;
}

export interface StepsProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function Steps({ steps, currentStep, className, onStepClick }: StepsProps & { onStepClick?: (stepIndex: number) => void }) {
  const currentItem = steps[currentStep] || steps[0];

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Mobile Compact Progress Bar */}
      <div className="md:hidden bg-white border border-[#E5E5E5] rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0A0A0A]">
            Etapa {currentStep + 1} de {steps.length}: <span className="text-[#806300]">{currentItem.title}</span>
          </span>
          <span className="text-[11px] font-semibold text-[#737373]">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#171717] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        {currentItem.description && (
          <p className="text-[11px] text-[#737373]">{currentItem.description}</p>
        )}
      </div>

      {/* Desktop / Tablet Full Step Bar */}
      <div className="hidden md:flex items-start justify-between relative w-full overflow-x-auto scrollbar-none py-1">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isClickable = onStepClick && idx <= currentStep;

          return (
            <div
              key={idx}
              className={cn(
                'flex-1 flex flex-col items-center relative text-center group min-w-[90px]',
                isClickable ? 'cursor-pointer' : 'cursor-default'
              )}
              onClick={() => isClickable && onStepClick(idx)}
            >
              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-[50%] right-[-50%] h-[2px] z-0 transition-colors',
                    idx < currentStep ? 'bg-[#0A0A0A]' : 'bg-[#E5E5E5]'
                  )}
                />
              )}

              {/* Step Circle */}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs',
                  isCompleted && 'bg-[#0A0A0A] text-white group-hover:bg-[#333333]',
                  isCurrent && 'bg-[#FDC503] text-[#0A0A0A] ring-4 ring-[#FFF4C2]',
                  !isCompleted && !isCurrent && 'bg-[#F5F5F5] text-[#A3A3A3] border border-[#D4D4D4]'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : idx + 1}
              </div>

              {/* Step Info */}
              <div className="mt-2 space-y-0.5 max-w-[110px]">
                <span
                  className={cn(
                    'block text-[11px] font-semibold leading-tight transition-colors',
                    isCurrent || isCompleted ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span
                    className={cn(
                      'block text-[10px] leading-tight truncate max-w-[100px] transition-colors mx-auto',
                      isCompleted || isCurrent
                        ? 'font-bold text-[#806300] bg-[#FFF4C2]/60 px-1 py-0.5 rounded'
                        : 'text-[#737373]'
                    )}
                    title={step.description}
                  >
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
