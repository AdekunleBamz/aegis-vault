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
    <Card>
      <CardHeader 
        title="Your Portfolio" 
        subtitle={isLoading ? 'Loading...' : `Total Value: $${metrics.totalValueUsd.toFixed(2)}`}
        action={
          <Badge 
            variant="info" 
            style={{ backgroundColor: `${TIERS[tier]?.color}20`, color: TIERS[tier]?.color }}
          >
            {TIERS[tier]?.name || 'Bronze'}
          </Badge>
        }
        icon={
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        }
      />
      
      <div className="space-y-5">
        {/* Wallet Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">STX Balance</span>
            </div>
            {isLoading ? (
              <LoadingSkeleton className="w-24 h-7" />
            ) : (
              <>
                <p className="text-xl font-bold text-white">{formatSTX(stxBalance)}</p>
                <p className="text-gray-500 text-xs mt-1">Available</p>
              </>
            )}
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">AGS Balance</span>
            </div>
            {isLoading ? (
              <LoadingSkeleton className="w-24 h-7" />
            ) : (
              <>
                <p className="text-xl font-bold text-purple-400">{formatAGS(agsBalance)}</p>
                <p className="text-gray-500 text-xs mt-1">Earned Tokens</p>
              </>
            )}
          </div>
        </div>

        {/* Staking Position */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Staking Position
            </h4>
            {!isLoading && (
              <span className="text-green-400 text-sm font-medium">{metrics.apy}% APY</span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Staked Amount</p>
              {isLoading ? (
                <LoadingSkeleton className="w-24 h-6" />
              ) : (
                <p className="text-white font-bold text-lg">{formatSTX(stakedAmount)} STX</p>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending Rewards</p>
              {isLoading ? (
                <LoadingSkeleton className="w-20 h-6" />
              ) : (
                <p className="text-green-400 font-bold text-lg">{formatAGS(pendingRewards)} AGS</p>
              )}
            </div>
          </div>
        </div>

        {/* Next Tier Progress */}
        {metrics.nextTier && !isLoading && (
          <div className="bg-gray-900/30 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Progress to {metrics.nextTier.name}</span>
              <span className="text-gray-400 text-sm">{metrics.amountToNext.toLocaleString()} STX more</span>
            </div>
            <Progress value={metrics.progressToNext} color="purple" size="sm" />
            <p className="text-xs text-gray-500 mt-2">
              Upgrade for higher APY: {metrics.nextTier.name} = {calculateAPY(metrics.nextTier.minStake * 1e6, tier + 1)}% APY
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button as="a" href="/stake" variant="primary" size="sm" className="flex-1">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Stake
          </Button>
          <Button as="a" href="/claim" variant="secondary" size="sm" className="flex-1">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Claim
          </Button>
        </div>
      </div>
    </Card>
  );
}
