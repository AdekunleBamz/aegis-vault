'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { useStaking } from '@/hooks/use-staking';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';

export function StakeForm() {
  const { address, isConnected, connect } = useWallet();
  const { stxBalance } = useBalances(address || '');
  const { stake, isLoading, error } = useStaking(address || '');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    try {
      const result = await stake(numAmount);
      setSuccess(`Transaction submitted: ${result.txId}`);
      setAmount('');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const microAmount = toMicroSTX(numAmount);
  const tier = determineTier(microAmount);
  const apy = calculateAPY(microAmount, tier);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Stake STX</h2>

          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                Connect your wallet to start staking
              </p>
              <button
                onClick={connect}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <form onSubmit={handleStake}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Amount to Stake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.000001"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAmount((Number(stxBalance) / 1e6).toString())
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm hover:text-blue-300"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Balance: {formatSTX(stxBalance)} STX
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Tier</span>
                  <span
                    className="font-medium"
                    style={{ color: TIERS[tier]?.color }}
                  >
                    {TIERS[tier]?.name || 'Bronze'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">APY</span>
                  <span className="text-green-400 font-medium">{apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cooldown</span>
                  <span className="text-white">~24 hours</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 text-green-400 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !amount || numAmount <= 0}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Staking...' : 'Stake STX'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
