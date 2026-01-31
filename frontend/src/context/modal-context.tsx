'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type ModalType = 
  | 'wallet-connect'
  | 'transaction-confirm'
  | 'transaction-success'
  | 'transaction-error'
  | 'stake'
  | 'unstake'
  | 'claim-rewards'
  | 'settings'
  | 'network-switch'
  | 'custom';

export interface ModalConfig {
  type: ModalType;
  title?: string;
  description?: string;
  data?: Record<string, unknown>;
  closable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
  onConfirm?: (data?: unknown) => void | Promise<void>;
}

interface ModalContextType {
  // Current modal state
  isOpen: boolean;
  currentModal: ModalConfig | null;
  modalHistory: ModalConfig[];
  
  // Actions
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  replaceModal: (config: ModalConfig) => void;
  goBackModal: () => void;
  
  // Confirmation dialog helper
  confirm: (options: {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
  }) => Promise<boolean>;
  
  // Alert dialog helper
  alert: (options: {
    title: string;
    description?: string;
    confirmLabel?: string;
  }) => Promise<void>;
}

const ModalContext = createContext<ModalContextType | null>(null);

// =============================================================================
// MODAL PROVIDER
// =============================================================================

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalStack, setModalStack] = useState<ModalConfig[]>([]);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const currentModal = useMemo(() => 
    modalStack.length > 0 ? modalStack[modalStack.length - 1] : null,
    [modalStack]
  );

  const isOpen = modalStack.length > 0;

  const openModal = useCallback((config: ModalConfig) => {
    setModalStack(prev => [...prev, config]);
  }, []);

  const closeModal = useCallback(() => {
    setModalStack(prev => {
      if (prev.length === 0) return prev;
      const current = prev[prev.length - 1];
      current.onClose?.();
      return prev.slice(0, -1);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModalStack(prev => {
      prev.forEach(modal => modal.onClose?.());
      return [];
    });
  }, []);

  const replaceModal = useCallback((config: ModalConfig) => {
    setModalStack(prev => {
      if (prev.length === 0) return [config];
      const current = prev[prev.length - 1];
      current.onClose?.();
      return [...prev.slice(0, -1), config];
    });
  }, []);

  const goBackModal = useCallback(() => {
    setModalStack(prev => {
      if (prev.length <= 1) return prev;
      const current = prev[prev.length - 1];
      current.onClose?.();
      return prev.slice(0, -1);
    });
  }, []);

  const confirm = useCallback((options: {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      openModal({
        type: 'custom',
        title: options.title,
        description: options.description,
        data: {
          isConfirmDialog: true,
          confirmLabel: options.confirmLabel || 'Confirm',
          cancelLabel: options.cancelLabel || 'Cancel',
          variant: options.variant || 'default',
        },
        closable: true,
        size: 'sm',
        onClose: () => {
          resolve(false);
          resolveRef.current = null;
        },
        onConfirm: () => {
          resolve(true);
          resolveRef.current = null;
          closeModal();
        },
      });
    });
  }, [openModal, closeModal]);

  const alert = useCallback((options: {
    title: string;
    description?: string;
    confirmLabel?: string;
  }): Promise<void> => {
    return new Promise((resolve) => {
      openModal({
        type: 'custom',
        title: options.title,
        description: options.description,
        data: {
          isAlertDialog: true,
          confirmLabel: options.confirmLabel || 'OK',
        },
        closable: true,
        size: 'sm',
        onClose: () => resolve(),
        onConfirm: () => {
          resolve();
          closeModal();
        },
      });
    });
  }, [openModal, closeModal]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentModal?.closable !== false) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentModal, closeModal]);

  const value: ModalContextType = {
    isOpen,
    currentModal,
    modalHistory: modalStack,
    openModal,
    closeModal,
    closeAllModals,
    replaceModal,
    goBackModal,
    confirm,
    alert,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

export function useConfirm() {
  const { confirm } = useModal();
  return confirm;
}

export function useAlert() {
  const { alert } = useModal();
  return alert;
}

export function useWalletModal() {
  const { openModal, closeModal, isOpen, currentModal } = useModal();
  
  return {
    isOpen: isOpen && currentModal?.type === 'wallet-connect',
    open: () => openModal({ type: 'wallet-connect', title: 'Connect Wallet', size: 'md' }),
    close: closeModal,
  };
}

export function useTransactionModal() {
  const { openModal, closeModal, replaceModal, isOpen, currentModal } = useModal();
  
  return {
    isOpen: isOpen && currentModal?.type?.startsWith('transaction-'),
    showConfirm: (data: { type: string; amount: string; details?: Record<string, unknown> }) =>
      openModal({
        type: 'transaction-confirm',
        title: 'Confirm Transaction',
        data,
        size: 'md',
      }),
    showSuccess: (data: { txHash: string; message?: string }) =>
      replaceModal({
        type: 'transaction-success',
        title: 'Transaction Successful',
        data,
        size: 'sm',
      }),
    showError: (data: { error: string; retry?: () => void }) =>
      replaceModal({
        type: 'transaction-error',
        title: 'Transaction Failed',
        data,
        size: 'sm',
      }),
    close: closeModal,
  };
}

export function useSettingsModal() {
  const { openModal, closeModal, isOpen, currentModal } = useModal();
  
  return {
    isOpen: isOpen && currentModal?.type === 'settings',
    open: (tab?: string) => openModal({ 
      type: 'settings', 
      title: 'Settings', 
      data: { initialTab: tab },
      size: 'lg' 
    }),
    close: closeModal,
  };
}
