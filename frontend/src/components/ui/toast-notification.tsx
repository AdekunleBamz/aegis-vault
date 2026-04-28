'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastNotificationProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
  error: 'bg-red-500/10 border-red-500/30 text-red-500',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
};

/**
 * Individual toast notification component.
 */
export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm',
        styles[toast.type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-black/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
