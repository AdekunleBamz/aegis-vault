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
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
              <Button
                onClick={connect}
                fullWidth
                size="lg"
              >
                Connect Wallet
              </Button>
            </div>
          ) : (
            <form onSubmit={handleStake} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Amount to Stake
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
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
                </motion.div>
                <AnimatePresence>
                  {hasError && (
                    <motion.div
                      id="amount-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-[10px] font-medium mt-2 flex items-center gap-1.5 overflow-hidden"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {hasError}
                    </motion.div>
                  )}
                </AnimatePresence>
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

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs flex items-start gap-3"
                  >
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{error}</div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-green-400 text-xs flex items-start gap-3"
                  >
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{success}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isLoading || !amount || numAmount <= 0}
                isLoading={isLoading}
                fullWidth
                size="lg"
              >
                Securely Stake STX
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
