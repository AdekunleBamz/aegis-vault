'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Shape of a single toast notification. */
export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
}

/**
 * Return type for the `useToast` hook.
 * Exposes the active toasts list and helpers to add, remove, or clear them.
 */
interface UseToastReturn {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    clearAll: () => void;
    toastSuccess: (message: string, description?: string) => string;
    toastError: (message: string, description?: string) => string;
    toastWarning: (message: string, description?: string) => string;
}

/**
 * Manages transient toast notifications and convenience helpers for common types.
 */
export function useToast(): UseToastReturn {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const getToastId = useCallback(
        () =>
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        []
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = getToastId();
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        if (toast.duration !== 0) {
            const delay = typeof toast.duration === 'number' && toast.duration > 0 ? toast.duration : 5000;
            setTimeout(() => {
                removeToast(id);
            }, delay);
        }

        return id;
    }, [getToastId, removeToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const toastSuccess = useCallback(
        (message: string, description?: string) =>
            addToast({ type: 'success', message, description }),
        [addToast]
    );

    const toastError = useCallback(
        (message: string, description?: string) =>
            addToast({ type: 'error', message, description }),
        [addToast]
    );

    const toastInfo = useCallback(
        (message: string, description?: string) =>
            addToast({ type: 'info', message, description }),
        [addToast]
    );

    const toastWarning = useCallback(
        (message: string, description?: string) =>
            addToast({ type: 'warning', message, description }),
        [addToast]
    );

    return {
        toasts,
        addToast,
        removeToast,
        clearAll,
        toastSuccess,
        toastError,
        toastInfo,
        toastWarning,
        toastCount: toasts.length,
        hasToasts: toasts.length > 0,
    };
}
