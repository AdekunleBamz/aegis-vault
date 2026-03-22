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
  AlertCircle,
  CheckCircle2,
  Lock,
  TrendingUp,
  Activity,
  LayoutGrid,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles
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

  const formatAmount = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) {
      return '';
    }

    return value.toFixed(2).replace(/\.00$/, '');
  };

  const setSuggestedAmount = (value: number) => {
    setAmount(formatAmount(Math.min(value, balanceSTX)));
    setValidationError(null);
  };

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
  const quickAmounts = [
    { label: '25%', value: balanceSTX * 0.25 },
    { label: '50%', value: balanceSTX * 0.5 },
    { label: '75%', value: balanceSTX * 0.75 },
    { label: 'Max', value: balanceSTX }
  ].filter((preset) => preset.value > 0);
  const canSubmit = Boolean(amount) && !hasError && !isLoading;

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
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-amber-500/80">
                    <span className="font-bold uppercase tracking-widest break-all">Risk Warning:</span> Smart contract staking involves inherent risks. Please ensure you understand the protocol mechanism before proceeding.
                  </p>
                </div>
              <div className="grid gap-4 rounded-[32px] border border-border/30 bg-muted/15 p-5 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Available Balance
                  </p>
                  <p className="mt-2 text-2xl font-black tabular-nums">
                    {balanceSTX.toLocaleString(undefined, { maximumFractionDigits: 2 })} STX
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use quick-fill controls below to prefill a sensible deposit size.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Suggested Reserve
                  </p>
                  <p className="mt-2 text-2xl font-black tabular-nums">1 STX</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Keep a small balance free for transaction fees and future position changes.
                  </p>
                </div>
              </div>

              {/* Input Area */}
              <div className="rounded-[36px] border border-border/40 bg-background/40 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="px-2">
                    <label htmlFor="stake-amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                      Deposit Amount
                    </label>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enter how much STX you want to lock into the vault. Rewards update instantly as you type.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuggestedAmount(balanceSTX)}
                    className="self-start rounded-full border border-aegis-blue/30 bg-aegis-blue/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-aegis-blue transition-colors hover:text-aegis-cyan"
                  >
                    Use Max Balance
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
                      "mt-4 w-full bg-muted/20 border-2 rounded-[32px] px-8 py-7 text-4xl font-black focus:outline-none transition-all duration-500 placeholder:text-muted-foreground/20",
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

                {quickAmounts.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 px-1">
                    {quickAmounts.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setSuggestedAmount(preset.value)}
                        aria-label={`Set stake amount to ${preset.label} of balance`}
                        className="rounded-full border border-border/50 bg-background/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground transition-all hover:border-aegis-blue/40 hover:text-foreground"
                      >
                        {preset.label}
                      </button>
                    ))}
                    {nextTier && nextTierMin > 0 && (
                      <button
                        type="button"
                        onClick={() => setSuggestedAmount(nextTierMin)}
                        aria-label={`Set stake amount to reach ${nextTier.name} tier`}
                        className="rounded-full border border-aegis-blue/30 bg-aegis-blue/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-aegis-blue transition-all hover:border-aegis-cyan/40 hover:text-aegis-cyan"
                      >
                        Reach {nextTier.name}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-5 grid gap-3 rounded-[28px] border border-border/30 bg-muted/10 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Vault entry
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {numAmount > 0 ? `${numAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} STX queued` : 'Waiting for amount'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Submission state
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {canSubmit ? 'Ready to confirm' : hasError ? 'Needs adjustment' : 'Enter amount first'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Best next action
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {nextTier && numAmount > 0 ? `Add ${Math.max(0, nextTierMin - numAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })} STX for ${nextTier.name}` : 'Preview your reward tier'}
                    </p>
                  </div>
                </div>
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
                    <p className="mt-3 text-sm text-muted-foreground">
                      {numAmount > 0
                        ? `${yearlyAGS.toLocaleString(undefined, { maximumFractionDigits: 2 })} AGS projected over a year at the current tier.`
                        : 'Enter an amount to preview monthly and annual AGS rewards.'}
                    </p>
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
                    <p className="mt-3 text-sm text-muted-foreground">
                      {nextTier
                        ? `${Math.max(0, nextTierMin - numAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })} STX away from ${nextTier.name}.`
                        : 'You are already in the highest available reward tier.'}
                    </p>
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
              <div className="rounded-[32px] border border-border/40 bg-background/30 p-4">
                <div className="mb-4 flex items-start gap-3 rounded-[24px] bg-muted/20 p-4">
                  <div className="rounded-2xl bg-aegis-blue/10 p-2.5 text-aegis-blue">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Review before signing
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Confirm your amount, wallet reserve, and reward tier before opening the Stacks wallet prompt.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
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
              </div>

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
