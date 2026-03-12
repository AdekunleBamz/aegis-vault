'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  LayoutGrid,
  Clock,
  Plus,
  RefreshCw,
  ShieldCheck
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
  const balanceSTX = Number(stxBalance) / 1e6;

  const hasError = useMemo(() => {
    if (!amount) return null;
    if (numAmount <= 0) return 'Amount must be greater than 0';
    if (numAmount > balanceSTX) return 'Insufficient STX balance';
    if (numAmount < 0.000001) return 'Amount is too small for protocol';
    return null;
  }, [amount, numAmount, balanceSTX]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(val);
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
      setSuccess(`Vault deposit successful. TX ID: ${result.txId.substring(0, 10)}...`);
      setAmount('');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const microAmount = toMicroSTX(numAmount);
  const tier = determineTier(microAmount);
  const apy = calculateAPY(microAmount, tier);

  // Projected rewards calculation (simplified for UI)
  const yearlyAGS = numAmount * (apy / 100);
  const monthlyAGS = yearlyAGS / 12;

  const nextTier = tier < TIERS.length - 1 ? TIERS[tier + 1] : null;
  const nextTierMin = nextTier ? nextTier.minStake : 0;
  const progressToNext = nextTier
    ? Math.min(100, (numAmount / nextTierMin) * 100)
    : 100;

  return (
    <section id="stake-panel" className="py-24 px-4 relative overflow-hidden">
      {/* Dynamic background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-20 w-96 h-96 bg-aegis-blue/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-aegis-purple/20 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="container max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-background/40 backdrop-blur-3xl border border-border/50 rounded-[48px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-aegis-blue/10 border border-aegis-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest text-aegis-blue flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-aegis-blue rounded-full animate-pulse" />
                  Liquid Staking v2
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-2">
                Compound <span className="text-gradient">Yield</span>
              </h2>
              <p className="text-muted-foreground font-medium text-lg">
                Deposit STX to earn AGS governance tokens.
              </p>
            </div>
            <div className="w-16 h-16 bg-muted rounded-[28px] flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Plus className="w-8 h-8 text-aegis-blue" />
            </div>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="w-24 h-24 bg-muted/50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-border/50">
                <Wallet className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black mb-4">Wallet Connection Required</h3>
              <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
                Please connect your Stacks wallet to access the vault and manage your positions.
              </p>
              <button
                onClick={connect}
                className="px-12 py-5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-[0_0_40px_-10px_hsl(var(--foreground)/0.5)] transition-all active:scale-95"
              >
                Connect Stacks Wallet
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleStake} className="space-y-8">
              {/* Input Area */}
              <div>
                <div className="flex justify-between items-end mb-4 px-2">
                  <label htmlFor="stake-amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    Deposit Amount
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(balanceSTX.toString())}
                    className="text-[10px] font-black text-aegis-blue hover:text-aegis-cyan transition-colors"
                  >
                    MAX: {balanceSTX.toLocaleString()} STX
                  </button>
                </div>

                <div className="relative group">
                  <input
                    id="stake-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    aria-invalid={!!hasError}
                    aria-describedby={hasError ? "stake-error" : undefined}
                    className={cn(
                      "w-full bg-muted/20 border-2 rounded-[32px] px-8 py-7 text-4xl font-black focus:outline-none transition-all duration-500 placeholder:text-muted-foreground/20",
                      hasError
                        ? "border-destructive/30 focus:border-destructive text-destructive"
                        : "border-border/30 focus:border-aegis-blue focus:bg-muted/40"
                    )}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <span className="text-xl font-black text-muted-foreground/40">STX</span>
                  </div>
                </div>

                <AnimatePresence>
                  {hasError && (
                    <motion.p
                      id="stake-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-destructive text-[10px] font-black uppercase tracking-widest mt-4 px-4 flex items-center gap-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {hasError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Reward Projection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 flex flex-col justify-between group/stat hover:bg-muted/30 transition-all" aria-labelledby="yield-label">
                  <div className="flex items-center justify-between mb-4">
                    <span id="yield-label" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Yield Projection</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500 group-hover/stat:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-500" aria-label={`${numAmount > 0 ? monthlyAGS.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"} AGS tokens per month`}>
                      {numAmount > 0 ? `+${monthlyAGS.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "0.00"}
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">Est. AGS / Month</div>
                  </div>
                </div>

                <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 flex flex-col justify-between group/stat hover:bg-muted/30 transition-all" aria-labelledby="tier-label">
                  <div className="flex items-center justify-between mb-4">
                    <span id="tier-label" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Reward Tier</span>
                    <LayoutGrid className="w-4 h-4 text-aegis-blue group-hover/stat:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <div className="text-2xl font-black flex items-center gap-2" style={{ color: TIERS[tier]?.color }} aria-label={`Current Tier: ${TIERS[tier]?.name}, ${apy} percent APY`}>
                      {TIERS[tier]?.name}
                      <span className="text-xs text-muted-foreground/40 font-bold uppercase" aria-hidden="true">{apy}% APY</span>
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">Multiplier Active</div>
                  </div>
                </div>
              </div>

              {/* Progress to next tier */}
              {nextTier && numAmount > 0 && (
                <div className="px-2">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Path to <span className="text-foreground">{nextTier.name}</span>
                    </span>
                    <span className="text-[10px] font-black text-aegis-blue uppercase tracking-widest">
                      {Math.max(0, nextTierMin - numAmount).toLocaleString()} STX to upgrade
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden p-[2px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      className="h-full bg-gradient-to-r from-aegis-blue to-aegis-purple rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              <AnimatePresence>
                {(error || validationError) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black uppercase tracking-widest flex gap-3 items-center"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error || validationError}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest flex gap-3 items-center"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isLoading || !amount || !!hasError}
                aria-label={isLoading ? "Processing transaction" : "Confirm staking deposit"}
                className="group relative w-full py-6 bg-foreground text-background rounded-[32px] font-black text-xl tracking-tighter overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_40px_-10px_hsl(var(--foreground)/0.5)] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCw className="w-6 h-6" />
                      </motion.div>
                      SIGNING TRANSACTION...
                    </>
                  ) : (
                    <>
                      CONFIRM STAKING
                      <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-aegis-blue to-aegis-purple opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </button>

              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                  <Lock className="w-3 h-3" />
                  24h Lock
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                  <Activity className="w-3 h-3" />
                  Instant Rewards
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                  <ShieldCheck className="w-3 h-3" />
                  v2 Verified
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
