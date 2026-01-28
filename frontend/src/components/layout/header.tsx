'use client';

import React from 'react';
import { useWallet } from '@/context/wallet-context';
import { truncateAddress } from '@/lib/format';

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Aegis Vault
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </a>
          <a href="/stake" className="text-gray-300 hover:text-white transition-colors">
            Stake
          </a>
          <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="/stats" className="text-gray-300 hover:text-white transition-colors">
            Stats
          </a>
        </nav>

        <div>
          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {truncateAddress(address || '')}
              </span>
              <button
                onClick={disconnect}
                className="px-4 py-2 text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
