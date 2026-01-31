'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'STX';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
export type GasPreference = 'slow' | 'normal' | 'fast';

export interface AppSettings {
  // Display
  theme: 'light' | 'dark' | 'system';
  currency: Currency;
  language: Language;
  compactNumbers: boolean;
  showUsdValues: boolean;
  
  // Transaction
  slippage: number;
  gasPreference: GasPreference;
  autoCompound: boolean;
  
  // Notifications
  notifyTransactions: boolean;
  notifyRewards: boolean;
  notifyPriceAlerts: boolean;
  soundEnabled: boolean;
  
  // Privacy
  hideBalances: boolean;
  anonymousAnalytics: boolean;
  
  // Advanced
  expertMode: boolean;
  showTestnets: boolean;
  customRpcUrl?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  currency: 'USD',
  language: 'en',
  compactNumbers: false,
  showUsdValues: true,
  slippage: 0.5,
  gasPreference: 'normal',
  autoCompound: false,
  notifyTransactions: true,
  notifyRewards: true,
  notifyPriceAlerts: false,
  soundEnabled: true,
  hideBalances: false,
  anonymousAnalytics: true,
  expertMode: false,
  showTestnets: false,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

// =============================================================================
// SETTINGS PROVIDER
// =============================================================================

interface SettingsProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

export function SettingsProvider({ children, storageKey = 'aegis_settings' }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings, storageKey, isLoaded]);

  // Apply theme
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;
    
    const applyTheme = (theme: 'light' | 'dark') => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    };

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(settings.theme);
    }
  }, [settings.theme, isLoaded]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((json: string): boolean => {
    try {
      const imported = JSON.parse(json);
      // Validate and merge with defaults
      const validated: AppSettings = { ...DEFAULT_SETTINGS };
      for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[]) {
        if (key in imported && typeof imported[key] === typeof DEFAULT_SETTINGS[key]) {
          (validated as Record<string, unknown>)[key] = imported[key];
        }
      }
      setSettings(validated);
      return true;
    } catch (e) {
      console.error('Failed to import settings:', e);
      return false;
    }
  }, []);

  const value: SettingsContextType = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

export function useTheme() {
  const { settings, updateSetting } = useSettings();
  
  return {
    theme: settings.theme,
    setTheme: (theme: AppSettings['theme']) => updateSetting('theme', theme),
    isDark: settings.theme === 'dark' || 
      (settings.theme === 'system' && typeof window !== 'undefined' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
}

export function useCurrency() {
  const { settings, updateSetting } = useSettings();
  
  const formatCurrency = useCallback((amount: number): string => {
    const symbols: Record<Currency, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      BTC: '₿',
      STX: 'STX ',
    };
    
    if (settings.currency === 'BTC' || settings.currency === 'STX') {
      return `${symbols[settings.currency]}${amount.toFixed(settings.currency === 'BTC' ? 8 : 2)}`;
    }
    
    return `${symbols[settings.currency]}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [settings.currency]);
  
  return {
    currency: settings.currency,
    setCurrency: (currency: Currency) => updateSetting('currency', currency),
    formatCurrency,
    showUsdValues: settings.showUsdValues,
  };
}

export function useTransactionSettings() {
  const { settings, updateSetting } = useSettings();
  
  return {
    slippage: settings.slippage,
    setSlippage: (slippage: number) => updateSetting('slippage', slippage),
    gasPreference: settings.gasPreference,
    setGasPreference: (pref: GasPreference) => updateSetting('gasPreference', pref),
    autoCompound: settings.autoCompound,
    setAutoCompound: (auto: boolean) => updateSetting('autoCompound', auto),
    expertMode: settings.expertMode,
    setExpertMode: (expert: boolean) => updateSetting('expertMode', expert),
  };
}

export function usePrivacySettings() {
  const { settings, updateSetting } = useSettings();
  
  return {
    hideBalances: settings.hideBalances,
    setHideBalances: (hide: boolean) => updateSetting('hideBalances', hide),
    anonymousAnalytics: settings.anonymousAnalytics,
    setAnonymousAnalytics: (anon: boolean) => updateSetting('anonymousAnalytics', anon),
  };
}
