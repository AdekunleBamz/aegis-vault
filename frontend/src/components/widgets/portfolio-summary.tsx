'use client';

import React, { useMemo } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { usePositions } from '@/hooks/use-positions';
import { formatSTX, formatAGS } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSkeleton } from '@/components/ui/loading';
import { calculateAPY, determineTier } from '@/lib/staking';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PortfolioSummary() {
  const { address, isConnected, connect } = useWallet();
  const { stxBalance, agsBalance, isLoading: balancesLoading } = useBalances(address || '');
  const { position, isLoading: positionLoading } = usePositions(address || '');

  const isLoading = balancesLoading || positionLoading;
  const tier = position?.tier || 0;
  const stakedAmount = position?.amountStaked || BigInt(0);
  const pendingRewards = position?.pendingRewards || BigInt(0);

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
    const apy = calculateAPY(Number(stakedAmount), tier);

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
      <Card className="overflow-hidden">
        <div className="relative p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">View Your Portfolio</h3>
            <p className="text-gray-400 text-sm mb-4">Connect your wallet to see your holdings, stakes, and rewards</p>
            <Button onClick={connect} size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Connect Wallet
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="glass-dark border border-white/5 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Your Portfolio</h3>
              <p className="text-gray-500 text-xs">
                {isLoading ? 'Fetching data...' : `Total Value: $${metrics.totalValueUsd.toLocaleString()}`}
              </p>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
            style={{ backgroundColor: `${TIERS[tier]?.color}10`, color: TIERS[tier]?.color, borderColor: `${TIERS[tier]?.color}30` }}
          >
            {TIERS[tier]?.name || 'Bronze'} Tier
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Wallet Balances */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900/40 border border-white/[0.03] rounded-2xl p-4 hover:border-white/5 group cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                <Zap className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-gray-500 text-xs font-medium">STX Balance</span>
            </div>
            {isLoading ? (
              <div className="h-7 w-20 bg-white/5 animate-pulse rounded" />
            ) : (
              <div className="tabular-nums">
                <p className="text-xl font-bold text-white leading-none">{formatSTX(stxBalance)}</p>
                <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-tight font-bold">Available</p>
              </div>
            )}
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-900/40 border border-white/[0.03] rounded-2xl p-4 hover:border-white/5 group cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-gray-500 text-xs font-medium">AGS Balance</span>
            </div>
            {isLoading ? (
              <div className="h-7 w-20 bg-white/5 animate-pulse rounded" />
            ) : (
              <div className="tabular-nums">
                <p className="text-xl font-bold text-purple-400 leading-none">{formatAGS(agsBalance)}</p>
                <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-tight font-bold">Earned</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Staking Position */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-blue-500/5 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-white text-sm font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              Staking Position
            </h4>
            {!isLoading && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-md">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-green-400 text-[10px] font-bold uppercase">{metrics.apy}% APY</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Staked Amount</p>
              {isLoading ? (
                <div className="h-6 w-24 bg-white/5 animate-pulse rounded" />
              ) : (
                <p className="text-white font-bold text-lg tabular-nums">{formatSTX(stakedAmount)} STX</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Pending Rewards</p>
              {isLoading ? (
                <div className="h-6 w-24 bg-white/5 animate-pulse rounded" />
              ) : (
                <p className="text-green-400 font-bold text-lg tabular-nums">{formatAGS(pendingRewards)} AGS</p>
              )}
            </div>
          </div>
      </div>

      {/* Next Tier Progress */}
      {metrics.nextTier && !isLoading && (
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Progress to Next Tier</span>
              <span className="text-white text-xs font-bold">{metrics.nextTier.name} Level</span>
            </div>
            <span className="text-blue-400 text-xs font-bold tabular-nums">
              {metrics.amountToNext.toLocaleString()} STX to go
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.progressToNext}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 pt-2">
        <Button as="a" href="/stake" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3">
          Stake More
        </Button>
        <Button as="a" href="/claim" variant="secondary" className="flex-1 border-white/10 hover:bg-white/5 font-bold py-3 text-gray-300">
          Claim Rewards
        </Button>
      </div>
    </div>
    </div >
  );
}
