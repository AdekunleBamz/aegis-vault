'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
}

interface UseToastReturn {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        if (toast.duration !== 0) {
            const delay = typeof toast.duration === 'number' && toast.duration > 0 ? toast.duration : 5000;
            setTimeout(() => {
                removeToast(id);
            }, delay);
        }

        return id;
    }, [removeToast]);

    return {
        toasts,
        addToast,
        removeToast,
    };
}
