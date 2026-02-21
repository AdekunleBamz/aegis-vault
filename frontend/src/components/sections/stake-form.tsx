'use client';

import React, { useState, useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { useStaking } from '@/hooks/use-staking';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { cn } from '@/lib/utils';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

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
          <div className="glass-dark border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
            {/* Subtle decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

            <h2 className="text-2xl font-bold text-white mb-2">Stake STX</h2>
            <p className="text-gray-400 text-sm mb-8">Lock your STX and earn AGS rewards.</p>

            {!isConnected ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 mb-6 max-w-[200px] mx-auto">
                  Connect your wallet to safely access the vault.
                </p>
                <button
                  onClick={connect}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <form onSubmit={handleStake} className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
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
                      className={cn(
                        "w-full bg-gray-950 border rounded-xl px-4 py-4 text-white text-lg font-bold focus:outline-none transition-all tabular-nums",
                        hasError
                          ? 'border-red-500/50 focus:border-red-500 bg-red-500/5'
                          : 'border-white/10 focus:border-blue-500/50'
                      )}
                      aria-invalid={!!hasError}
                      aria-describedby={hasError ? 'amount-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setAmount((Number(stxBalance) / 1e6).toString())}
                      className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-blue-400 text-[10px] font-bold hover:bg-white/10 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  {hasError && (
                    <div id="amount-error" className="text-red-400 text-[10px] font-medium mt-2 flex items-center gap-1.5 animate-fade-in">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {hasError}
                    </div>
                  )}
                </div>

                <div className="bg-gray-950/50 border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tier Placement</span>
                    <div
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current"
                      style={{ color: TIERS[tier]?.color }}
                    >
                      {TIERS[tier]?.name || 'Bronze'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Rewards Estimate</span>
                    <span className="text-green-400 font-bold tabular-nums">{apy}% APY</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Cooldown Period</span>
                    <span className="text-white font-medium">~24 hours</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs flex items-start gap-3 animate-fade-in">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{error}</div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-green-400 text-xs flex items-start gap-3 animate-fade-in">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{success}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !amount || numAmount <= 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:opacity-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                >
                  {isLoading ? 'Processing...' : 'Securely Stake STX'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }
