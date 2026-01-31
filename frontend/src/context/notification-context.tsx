'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHide?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  clearOld: (maxAge?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// =============================================================================
// NOTIFICATION PROVIDER
// =============================================================================

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  persistKey?: string;
}

export function NotificationProvider({
  children,
  maxNotifications = 50,
  defaultDuration = 5000,
  persistKey = 'aegis_notifications',
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Notification[];
        setNotifications(parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) })));
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  }, [persistKey]);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(persistKey, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }, [notifications, persistKey]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): string => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Limit max notifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-hide if enabled
    if (notification.autoHide !== false) {
      const duration = notification.duration || defaultDuration;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, [maxNotifications, defaultDuration]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearOld = useCallback((maxAge: number = 24 * 60 * 60 * 1000) => {
    const cutoff = Date.now() - maxAge;
    setNotifications(prev => 
      prev.filter(n => n.timestamp.getTime() > cutoff)
    );
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearOld,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function createNotifyHelpers(addNotification: NotificationContextType['addNotification']) {
  return {
    info: (title: string, message?: string) => 
      addNotification({ type: 'info', title, message }),
    
    success: (title: string, message?: string) => 
      addNotification({ type: 'success', title, message }),
    
    warning: (title: string, message?: string) => 
      addNotification({ type: 'warning', title, message }),
    
    error: (title: string, message?: string) => 
      addNotification({ type: 'error', title, message, autoHide: false }),
    
    txSubmitted: (txHash: string) =>
      addNotification({
        type: 'info',
        title: 'Transaction Submitted',
        message: `Transaction ${txHash.slice(0, 8)}... is being processed`,
      }),
    
    txConfirmed: (txHash: string) =>
      addNotification({
        type: 'success',
        title: 'Transaction Confirmed',
        message: `Transaction ${txHash.slice(0, 8)}... was successful`,
      }),
    
    txFailed: (error?: string) =>
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: error || 'Please try again',
        autoHide: false,
      }),
    
    stakeCreated: (amount: string) =>
      addNotification({
        type: 'success',
        title: 'Stake Created',
        message: `Successfully staked ${amount} tokens`,
      }),
    
    rewardsClaimed: (amount: string) =>
      addNotification({
        type: 'success',
        title: 'Rewards Claimed',
        message: `Successfully claimed ${amount} rewards`,
      }),
    
    withdrawalComplete: (amount: string) =>
      addNotification({
        type: 'success',
        title: 'Withdrawal Complete',
        message: `Successfully withdrew ${amount} tokens`,
      }),
  };
}
