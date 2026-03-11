'use client';

import React, { useState, useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { useStaking } from '@/hooks/use-staking';
import { formatSTX, toMicroSTX } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import {
  Wallet,
  ArrowUpRight,
  Info,
  AlertCircle,
  CheckCircle2,
  Lock,
  Coins,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function StakeForm() {
  const { address, isConnected, connect } = useWallet();
  const { stxBalance } = useBalances(address || '');
  const { stake, isLoading, error } = useStaking(address || '');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const hasError = useMemo(() => {
    if (!amount) return null;
    if (numAmount <= 0) return 'Amount must be greater than 0';
    if (numAmount > Number(stxBalance) / 1e6) return 'Insufficient balance';
    if (numAmount < 0.000001) return 'Amount is too small';
    return null;
  }, [amount, numAmount, stxBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/[^0-9.]/g, ''));
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
    <section className="py-24 px-4 relative">
      <div className="container max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] border border-border bg-background/60 backdrop-blur-2xl p-8 md:p-10 shadow-2xl overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-aegis-blue/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-aegis-purple/5 rounded-full blur-3xl translate-y-1/2 -translateX-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-1">Stake <span className="text-gradient">STX</span></h2>
                <p className="text-sm font-medium text-muted-foreground">Secure the network and earn rewards</p>
              </div>
              <div className="p-3 bg-muted rounded-2xl">
                <Coins className="w-6 h-6 text-aegis-blue" />
              </div>
            </div>

            {!isConnected ? (
              <div className="text-center py-12 px-6 rounded-3xl bg-muted/40 border border-border/50">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Sign in with your Stacks wallet to begin staking and earning rewards.
                </p>
                <button
                  onClick={connect}
                  className="w-full py-4 bg-foreground text-background rounded-2xl font-bold hover:shadow-[0_0_20px_-5px_hsl(var(--foreground)/0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              </div>
            ) : (
              <form onSubmit={handleStake} className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-3 px-1">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Staking Amount
                    </label>
                    <span className="text-xs font-bold text-muted-foreground/60">
                      Balance: <span className="text-foreground">{formatSTX(stxBalance)} STX</span>
                    </span>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className={cn(
                        "w-full bg-muted/50 border-2 rounded-[24px] px-6 py-5 text-2xl font-black focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30",
                        hasError
                          ? "border-destructive/30 focus:border-destructive text-destructive"
                          : "border-border/50 focus:border-aegis-blue focus:bg-muted/80"
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm font-black text-muted-foreground px-3">STX</span>
                      <button
                        type="button"
                        onClick={() => setAmount((Number(stxBalance) / 1e6).toString())}
                        className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {hasError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-destructive text-xs font-bold mt-3 px-2 flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {hasError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Staking Summary Card */}
                <div className="p-6 rounded-[28px] bg-muted/30 border border-border/40 space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Current APY
                    </div>
                    <span className="text-emerald-500 font-black text-lg">{apy}%</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LayoutGrid className="w-4 h-4" />
                      Reward Tier
                    </div>
                    <div className="flex items-center gap-1.5 font-bold" style={{ color: TIERS[tier]?.color || 'currentColor' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TIERS[tier]?.color || 'currentColor' }} />
                      {TIERS[tier]?.name || 'Bronze'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Cooldown
                    </div>
                    <span className="text-foreground font-bold">24 Hours</span>
                  </div>
                </div>

                <AnimatePresence>
                  {(error || validationError) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex gap-3"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error || validationError}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold flex gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading || !amount || numAmount <= 0}
                  className="group relative w-full py-5 bg-foreground text-background rounded-[24px] font-black text-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-blue)/0.4)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Activity className="w-6 h-6" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        STAKE STX
                        <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-aegis-blue to-aegis-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>

                <p className="text-[10px] text-center uppercase tracking-widest font-bold text-muted-foreground/40 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Secured by Stacks Smart Contracts
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
