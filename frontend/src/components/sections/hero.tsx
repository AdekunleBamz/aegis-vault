'use client';

import React from 'react';
import { useWallet } from '@/context/wallet-context';

export function Hero() {
  const { isConnected, connect } = useWallet();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Stake STX
          </span>
          <br />
          <span className="text-white">Earn AGS Rewards</span>
        </h1>

        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Aegis Vault is a decentralized staking protocol on Stacks. Stake your
          STX tokens and earn AGS rewards with competitive APY rates.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isConnected ? (
            <a
              href="/stake"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Start Staking
            </a>
          ) : (
            <button
              onClick={connect}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Connect Wallet
            </button>
          )}
          <a
            href="/docs"
            className="px-8 py-4 border border-gray-700 text-white rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors"
          >
            Learn More
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">12%</div>
            <div className="text-gray-400 text-sm">Base APY</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">24%</div>
            <div className="text-gray-400 text-sm">Max APY</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">144</div>
            <div className="text-gray-400 text-sm">Blocks Lockup</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">4</div>
            <div className="text-gray-400 text-sm">Tiers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
