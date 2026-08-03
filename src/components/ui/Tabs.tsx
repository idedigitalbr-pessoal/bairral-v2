import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  variant?: 'line' | 'pills';
  className?: string;
}

export function Tabs({ tabs, defaultTabId, variant = 'line', className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className={cn('w-full', className)}>
      {/* Header / Tab list */}
      <div
        role="tablist"
        className={cn(
          'flex items-center gap-1 overflow-x-auto border-b border-[#E5E5E5]',
          variant === 'pills' && 'border-none bg-[#F5F5F5] p-1 rounded-md'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-xs',
                variant === 'line' && [
                  'border-b-2 -mb-[1px]',
                  isActive
                    ? 'border-[#FDC503] text-[#0A0A0A]'
                    : 'border-transparent text-[#737373] hover:text-[#171717]',
                ],
                variant === 'pills' && [
                  'rounded-sm',
                  isActive
                    ? 'bg-white text-[#0A0A0A] shadow-xs'
                    : 'text-[#737373] hover:text-[#171717]',
                ],
                tab.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="shrink-0">{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div role="tabpanel" className="pt-4 text-xs text-[#262626]">
        {currentTab?.content}
      </div>
    </div>
  );
}
