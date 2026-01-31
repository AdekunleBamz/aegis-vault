'use client';

import React from 'react';

// Theme Toggle
export interface ThemeToggleProps {
  theme: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  theme,
  onChange,
  showLabel = false,
  className = '',
}: ThemeToggleProps) {
  const themes = [
    { id: 'light', icon: '☀️', label: 'Light' },
    { id: 'dark', icon: '🌙', label: 'Dark' },
    { id: 'system', icon: '💻', label: 'System' },
  ] as const;

  return (
    <div className={`inline-flex bg-gray-800 rounded-lg p-1 ${className}`}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 rounded-md text-sm transition-all ${
            theme === t.id
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          title={t.label}
        >
          <span className="mr-1">{t.icon}</span>
          {showLabel && t.label}
        </button>
      ))}
    </div>
  );
}

// Language Selector
export interface LanguageSelectorProps {
  language: string;
  languages: { code: string; name: string; flag?: string }[];
  onChange: (code: string) => void;
  className?: string;
}

export function LanguageSelector({
  language,
  languages,
  onChange,
  className = '',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selected = languages.find((l) => l.code === language);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:border-gray-600 transition-colors"
      >
        {selected?.flag && <span>{selected.flag}</span>}
        <span className="text-sm">{selected?.name || language}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                lang.code === language
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {lang.flag && <span>{lang.flag}</span>}
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Currency Selector
export interface CurrencySelectorProps {
  currency: string;
  currencies: { code: string; symbol: string; name: string }[];
  onChange: (code: string) => void;
  className?: string;
}

export function CurrencySelector({
  currency,
  currencies,
  onChange,
  className = '',
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selected = currencies.find((c) => c.code === currency);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:border-gray-600 transition-colors"
      >
        <span className="font-medium">{selected?.symbol}</span>
        <span className="text-sm">{selected?.code || currency}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                onChange(curr.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                curr.code === currency
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium w-6">{curr.symbol}</span>
                <span>{curr.code}</span>
              </span>
              <span className="text-gray-500">{curr.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Group
export interface SettingsItemProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SettingsItem({
  icon,
  title,
  description,
  action,
  onClick,
  className = '',
}: SettingsItemProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 ${
        onClick ? 'hover:bg-gray-700/50 cursor-pointer' : ''
      } transition-colors ${className}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-2 bg-gray-700 rounded-lg text-emerald-400">
            {icon}
          </div>
        )}
        <div className="text-left">
          <p className="font-medium text-white">{title}</p>
          {description && (
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action || (
        onClick && (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )
      )}
    </Wrapper>
  );
}

export interface SettingsGroupProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsGroup({ title, children, className = '' }: SettingsGroupProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 px-4">
          {title}
        </h3>
      )}
      <div className="bg-gray-800 rounded-xl border border-gray-700 divide-y divide-gray-700 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
