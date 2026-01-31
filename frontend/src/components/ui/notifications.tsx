'use client';

import React from 'react';

// Notification Item
export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  time: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isRead?: boolean;
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

const typeConfig = {
  info: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  success: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  warning: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  error: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
};

export function NotificationItem({
  id,
  title,
  message,
  time,
  type = 'info',
  isRead = false,
  onRead,
  onDismiss,
  className = '',
}: NotificationItemProps) {
  const config = typeConfig[type];

  return (
    <div
      className={`relative p-4 ${!isRead ? 'bg-gray-800/50' : ''} hover:bg-gray-700/50 transition-colors ${className}`}
    >
      {!isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500" />
      )}
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-white truncate pr-4">{title}</h4>
            <span className="text-xs text-gray-500 shrink-0">{time}</span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{message}</p>
          <div className="flex items-center gap-2 mt-2">
            {!isRead && onRead && (
              <button
                onClick={() => onRead(id)}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                Mark as read
              </button>
            )}
            {onDismiss && (
              <button
                onClick={() => onDismiss(id)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Bell
export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ count = 0, onClick, className = '' }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors ${className}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

// Notification Panel
export interface NotificationPanelProps {
  notifications: NotificationItemProps[];
  onReadAll?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export function NotificationPanel({
  notifications,
  onReadAll,
  onClearAll,
  className = '',
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onReadAll && unreadCount > 0 && (
            <button
              onClick={onReadAll}
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Mark all read
            </button>
          )}
          {onClearAll && notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} {...notification} />
          ))
        )}
      </div>
    </div>
  );
}
