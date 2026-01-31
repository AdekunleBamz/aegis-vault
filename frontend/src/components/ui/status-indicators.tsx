'use client';

import React from 'react';

// Network Status Indicator
export interface NetworkStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  network?: string;
  blockHeight?: number;
  className?: string;
}

const statusConfig = {
  connected: {
    color: 'bg-emerald-500',
    text: 'Connected',
    textColor: 'text-emerald-400',
  },
  connecting: {
    color: 'bg-yellow-500',
    text: 'Connecting...',
    textColor: 'text-yellow-400',
  },
  disconnected: {
    color: 'bg-gray-500',
    text: 'Disconnected',
    textColor: 'text-gray-400',
  },
  error: {
    color: 'bg-red-500',
    text: 'Error',
    textColor: 'text-red-400',
  },
};

export function NetworkStatus({
  status,
  network,
  blockHeight,
  className = '',
}: NetworkStatusProps) {
  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {status === 'connecting' && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.color} animate-ping`} />
        )}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={config.textColor}>{config.text}</span>
        {network && status === 'connected' && (
          <span className="text-gray-500">• {network}</span>
        )}
        {blockHeight && status === 'connected' && (
          <span className="text-gray-500">• #{blockHeight.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}

// Transaction Status
export interface TxStatusProps {
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  confirmations?: number;
  requiredConfirmations?: number;
  txHash?: string;
  className?: string;
}

export function TxStatus({
  status,
  confirmations = 0,
  requiredConfirmations = 1,
  txHash,
  className = '',
}: TxStatusProps) {
  const statusConfig = {
    pending: {
      icon: (
        <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      ),
      text: 'Pending',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    confirming: {
      icon: (
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      ),
      text: `Confirming (${confirmations}/${requiredConfirmations})`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    confirmed: {
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Confirmed',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    failed: {
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      text: 'Failed',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1">
        <span className={`font-medium ${config.color}`}>{config.text}</span>
        {txHash && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {txHash}
          </p>
        )}
      </div>
    </div>
  );
}

// Wallet Connection Status
export interface WalletStatusProps {
  isConnected: boolean;
  address?: string;
  balance?: string | number;
  symbol?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function WalletStatus({
  isConnected,
  address,
  balance,
  symbol = 'STX',
  onConnect,
  onDisconnect,
  className = '',
}: WalletStatusProps) {
  if (!isConnected) {
    return (
      <button
        onClick={onConnect}
        className={`flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-sm text-gray-400">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
        </span>
      </div>
      {balance !== undefined && (
        <span className="text-sm font-medium text-white">
          {Number(balance).toLocaleString()} {symbol}
        </span>
      )}
      <button
        onClick={onDisconnect}
        className="p-1 text-gray-400 hover:text-white transition-colors"
        title="Disconnect"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}

// Staking Status
export interface StakingStatusProps {
  isStaking: boolean;
  stakedAmount?: number;
  rewards?: number;
  tier?: string;
  symbol?: string;
  className?: string;
}

export function StakingStatus({
  isStaking,
  stakedAmount = 0,
  rewards = 0,
  tier,
  symbol = 'AEGIS',
  className = '',
}: StakingStatusProps) {
  if (!isStaking) {
    return (
      <div className={`p-4 bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
        <p className="text-gray-400 text-center">No active stake</p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Staked</span>
        <span className="text-white font-medium">
          {stakedAmount.toLocaleString()} {symbol}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Rewards</span>
        <span className="text-emerald-400 font-medium">
          +{rewards.toLocaleString()} {symbol}
        </span>
      </div>
      {tier && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Tier</span>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-sm rounded">
            {tier}
          </span>
        </div>
      )}
    </div>
  );
}
