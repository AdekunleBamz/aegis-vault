'use client';

import React, { useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { usePositions } from '@/hooks/use-positions';
import { formatSTX, formatAGS } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { calculateAPY, determineTier } from '@/lib/staking';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ChevronRight,
  TrendingUp,
  Coins,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Plus,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function PortfolioSummary() {
  const { address, isConnected, connect } = useWallet();
  const { stxBalance, agsBalance, isLoading: balancesLoading } = useBalances(address || '');
  const { position, isLoading: positionLoading } = usePositions(address || '');

  const isLoading = balancesLoading || positionLoading;
  const stakedAmount = position?.amountStaked ?? 0n;
  const tier = determineTier(stakedAmount);
  const pendingRewards = position?.pendingRewards ?? 0n;

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    const stxNum = Number(stxBalance) / 1e6;
    const agsNum = Number(agsBalance) / 1e6;
    const stakedNum = Number(stakedAmount) / 1e6;
    const rewardsNum = Number(pendingRewards) / 1e6;

    // Mock USD rates
    const stxUsdRate = 0.65;
    const agsUsdRate = 0.042;

    const totalValueUsd = (stxNum * stxUsdRate) + (agsNum * agsUsdRate) + (stakedNum * stxUsdRate) + (rewardsNum * agsUsdRate);
    const apy = calculateAPY(stakedAmount, tier);

    // Next tier progress
    const nextTier = tier < TIERS.length - 1 ? TIERS[tier + 1] : null;
    const currentTierMin = TIERS[tier]?.minStake || 0;
    const nextTierMin = nextTier?.minStake || 0;
    const progressToNext = nextTier
      ? Math.min(100, ((stakedNum - currentTierMin) / (nextTierMin - currentTierMin)) * 100)
      : 100;
    const amountToNext = nextTier ? nextTierMin - stakedNum : 0;

    return {
      totalValueUsd,
      apy,
      nextTier,
      progressToNext,
      amountToNext,
    };
  }, [stxBalance, agsBalance, stakedAmount, pendingRewards, tier]);

  if (!isConnected) {
    return (
      <div className="relative rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-12 overflow-hidden text-center group">
        <div className="absolute inset-0 bg-gradient-to-br from-aegis-blue/5 to-aegis-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-muted rounded-[32px] flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500">
            <Wallet className="w-10 h-10 text-muted-foreground/60" />
          </div>
          <h3 className="text-3xl font-black mb-3">Portfolio Insight</h3>
          <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">
            Connect your wallet to unlock real-time portfolio tracking and yield analytics.
          </p>
          <button
            onClick={connect}
            className="px-8 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30px_-5px_hsl(var(--foreground)/0.4)] transition-all active:scale-95"
          >
            Authenticate Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 lg:p-10 relative overflow-hidden group">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-aegis-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black tracking-tighter">Your Portfolio</h2>
              <div
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
                style={{ backgroundColor: `${TIERS[tier]?.color}20`, color: TIERS[tier]?.color, border: `1px solid ${TIERS[tier]?.color}30` }}
              >
                {TIERS[tier]?.name} Status
              </div>
            </div>
            <p className="text-muted-foreground font-bold flex items-center gap-2" aria-label={`Total combined value: ${metrics.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} dollars`}>
              <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              Total Combined Value:
              {isLoading ? (
                <span className="w-24 h-6 bg-muted animate-pulse rounded-lg" />
              ) : (
                <span className="text-foreground tracking-tight">${metrics.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              )}
            </p>
          </div>

          <Link href="/stats" className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-muted/50 hover:bg-muted rounded-full font-black text-[10px] uppercase tracking-widest transition-all">
            Detailed Analytics
            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-all" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Wallet Balances */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">Liquid Assets</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-muted/30 border border-border/50 rounded-[32px] p-6 hover:bg-muted/50 transition-all group/stat">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover/stat:rotate-12 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">STX</span>
                </div>
                {isLoading ? (
                  <div className="w-32 h-8 bg-muted animate-pulse rounded-lg" />
                ) : (
                  <div>
                    <div className="text-2xl font-black">{formatSTX(stxBalance)}</div>
                    <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Available to stake</div>
                  </div>
                )}
              </div>

              <div className="bg-muted/30 border border-border/50 rounded-[32px] p-6 hover:bg-muted/50 transition-all group/stat">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-aegis-purple/10 rounded-2xl flex items-center justify-center text-aegis-purple group-hover/stat:rotate-12 transition-transform">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">AGS</span>
                </div>
                {isLoading ? (
                  <div className="w-32 h-8 bg-muted animate-pulse rounded-lg" />
                ) : (
                  <div>
                    <div className="text-2xl font-black text-aegis-purple">{formatAGS(agsBalance)}</div>
                    <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Protocol Tokens</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Staking Summary */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">Active Staking</h4>
            <div className="h-full bg-gradient-to-br from-aegis-blue/5 to-aegis-purple/5 border border-aegis-blue/20 rounded-[40px] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-2xl flex items-center justify-center text-aegis-blue">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black tracking-tight">Vault Position</h5>
                      <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{metrics.apy}% APY</span>
                    </div>
                  </div>
                  <Link href="/positions" className="p-2 bg-background/50 rounded-full hover:bg-background transition-colors">
                    <History className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Staked</p>
                    <div className="text-xl font-black tracking-tight">
                      {isLoading ? "..." : `${formatSTX(stakedAmount)} STX`}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Pending</p>
                    <div className="text-xl font-black tracking-tight text-emerald-500">
                      {isLoading ? "..." : `${formatAGS(pendingRewards)} AGS`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress to next tier */}
              {metrics.nextTier && !isLoading && (
                <div className="mt-8">
                  <div className="flex justify-between items-end mb-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Progress to <span className="text-foreground">{metrics.nextTier.name}</span>
                    </div>
                    <div className="text-[10px] font-black text-aegis-blue">
                      {metrics.amountToNext.toLocaleString()} STX to go
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-[2px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.progressToNext}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-aegis-blue to-aegis-purple rounded-full relative"
                    >
                      <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/50">
          <Link href="/stake" className="flex-1">
            <button
              aria-label="Increase your STX stake"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--foreground)/0.3)] active:scale-95"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Increase Stake
            </button>
          </Link>
          <Link href="/claim" className="flex-1">
            <button
              aria-label="Claim your accumulated AGS rewards"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-muted/50 hover:bg-muted border border-border/50 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Claim AGS Rewards
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
