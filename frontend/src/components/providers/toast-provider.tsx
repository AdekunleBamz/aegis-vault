'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast, Toast, ToastType } from '@/hooks/use-toast';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastContextType {
    toast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const { toasts, addToast, removeToast } = useToast();

    return (
        <ToastContext.Provider value={{ toast: addToast, removeToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t: any) => (
                        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const icons: Record<ToastType, any> = {
        success: CheckCircle2,
        error: AlertCircle,
        info: Info,
        warning: Zap,
    };

    const Icon = icons[toast.type];

    const colors: Record<ToastType, string> = {
        success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        error: 'text-destructive bg-destructive/10 border-destructive/20',
        info: 'text-aegis-blue bg-aegis-blue/10 border-aegis-blue/20',
        warning: 'text-aegis-purple bg-aegis-purple/10 border-aegis-purple/20',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto min-w-[320px] max-w-sm rounded-[24px] border p-4 backdrop-blur-3xl shadow-2xl flex items-start gap-3",
                colors[toast.type],
                "bg-background/80"
            )}
        >
            <div className="mt-0.5">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h5 className="text-sm font-black tracking-tight">{toast.message}</h5>
                {toast.description && (
                    <p className="text-xs font-bold opacity-70 mt-1 leading-relaxed">
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={onRemove}
                className="mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
}
