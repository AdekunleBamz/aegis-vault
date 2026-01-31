'use client';

import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

// Generate color from string
function stringToColor(str: string): string {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500',
    'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ 
  src, 
  alt = '', 
  name = '', 
  size = 'md', 
  className = '',
  status,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !src || imgError;
  const initials = name ? getInitials(name) : '?';
  const bgColor = name ? stringToColor(name) : 'bg-gray-600';

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-medium
          ${showFallback ? bgColor : ''}
        `}
      >
        {showFallback ? (
          <span className="text-white">{initials}</span>
        ) : (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {status && (
        <span 
          className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-gray-950
            ${statusSizeClasses[size]} ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
}

// Avatar Group
export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className="ring-2 ring-gray-950"
        />
      ))}
      {remaining > 0 && (
        <div 
          className={`
            ${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center
            font-medium text-gray-300 ring-2 ring-gray-950
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

// Wallet Avatar - truncated address display
export interface WalletAvatarProps {
  address: string;
  size?: AvatarProps['size'];
  showAddress?: boolean;
  className?: string;
}

export function WalletAvatar({ 
  address, 
  size = 'md', 
  showAddress = false,
  className = '',
}: WalletAvatarProps) {
  const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar name={address} size={size} />
      {showAddress && (
        <span className="text-sm text-gray-400 font-mono">{truncated}</span>
      )}
    </div>
  );
}
