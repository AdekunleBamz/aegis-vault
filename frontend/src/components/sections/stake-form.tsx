'use client';

import React, { useState, useMemo } from 'react';
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
  const [validationError, setValidationError] = useState<string | null>(null);

  // PR #1: Real-time form validation feedback
  const numAmount = parseFloat(amount) || 0;
  const hasError = useMemo(() => {
    if (!amount) return null;
    if (numAmount <= 0) return 'Amount must be greater than 0';
    if (numAmount > Number(stxBalance) / 1e6) return 'Insufficient balance';
    if (numAmount < 0.000001) return 'Amount is too small';
    return null;
  }, [amount, numAmount, stxBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setValidationError(null);
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setValidationError(null);

    if (hasError) {
      setValidationError(hasError);
      return;
    }

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setValidationError(null);

    if (hasError) {
      setValidationError(hasError);
      return;
    }

    try {
      const result = await stake(numAmount);
      setSuccess(`Transaction submitted: ${result.txId}`);
      setAmount('');
    } catch (err) {
      // Error is handled by the hook
    }
  };

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
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    min="0"
                    step="0.000001"
                    className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white text-lg focus:outline-none transition-colors ${
                      hasError 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-gray-700 focus:border-blue-500'
                    }`}
                    aria-invalid={!!hasError}
                    aria-describedby={hasError ? 'amount-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAmount((Number(stxBalance) / 1e6).toString())
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                {hasError && (
                  <div id="amount-error" className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {hasError}
                  </div>
                )}
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
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>{error}</div>
                </div>
              )}

              {validationError && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4 text-orange-400 text-sm flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>{validationError}</div>
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
