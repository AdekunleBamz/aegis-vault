'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'pills' | 'enclosed' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (tabId: string) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm py-2 px-3',
  md: 'text-sm py-3 px-4',
  lg: 'text-base py-3 px-5',
};

export function Tabs({ 
  tabs, 
  defaultTab, 
  variant = 'line',
  size = 'md',
  fullWidth = false,
  onChange,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    if (tabs.find(t => t.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Update indicator position for line variant
  useEffect(() => {
    if (variant === 'line' && tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, [activeTab, variant]);

  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    const base = `font-medium transition-all duration-200 ${sizeClasses[size]}`;
    
    if (isDisabled) {
      return `${base} text-gray-600 cursor-not-allowed`;
    }

    switch (variant) {
      case 'pills':
        return `${base} rounded-lg ${
          isActive 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }`;
      case 'enclosed':
        return `${base} border-b-2 ${
          isActive 
            ? 'border-blue-500 bg-gray-800 text-white rounded-t-lg' 
            : 'border-transparent text-gray-400 hover:text-white'
        }`;
      case 'soft':
        return `${base} rounded-lg ${
          isActive 
            ? 'bg-blue-500/15 text-blue-400' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
        }`;
      default: // line
        return `${base} ${isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`;
    }
  };

  return (
    <div className={className}>
      <div 
        ref={tabsRef}
        className={`relative flex ${fullWidth ? '' : 'inline-flex'} ${
          variant === 'line' ? 'border-b border-gray-700' : 
          variant === 'pills' ? 'bg-gray-800/50 rounded-lg p-1 gap-1' :
          variant === 'enclosed' ? 'border-b border-gray-700' :
          'gap-1'
        }`}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`${getTabStyles(activeTab === tab.id, !!tab.disabled)} 
              ${fullWidth ? 'flex-1' : ''} flex items-center justify-center gap-2`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full font-medium ${
                activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
        
        {/* Animated indicator for line variant */}
        {variant === 'line' && (
          <div
            className="absolute bottom-0 h-0.5 bg-blue-400 transition-all duration-200 ease-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        )}
      </div>
      
      {/* Tab panels */}
      <div className="py-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? 'animate-fade-in' : ''}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// Vertical Tabs variant
interface VerticalTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function VerticalTabs({ tabs, defaultTab, onChange }: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (tabs.find(t => t.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="flex gap-6">
      <div className="flex flex-col w-48 border-r border-gray-700 pr-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-blue-500/15 text-blue-400 border-l-2 border-blue-500' 
                : tab.disabled 
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
