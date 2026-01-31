'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useWallet } from '@/context/wallet-context';
import { usePositions } from '@/hooks/use-positions';
import { useNetwork } from '@/hooks/use-network';
import { formatSTX, formatAGS, formatBlockHeight, blocksToTime } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { calculateAPY } from '@/lib/staking';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function PositionsPage() {
  const { address, isConnected, connect } = useWallet();
  const { position, isLoading } = usePositions(address || '');
  const { blockHeight } = useNetwork();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-md text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Positions</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view and manage your staking positions</p>
            <Button onClick={connect} size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Connect Wallet
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tier = position?.tier || 0;
  const apy = calculateAPY(position?.amountStaked || BigInt(0), tier);
  const stakeDuration = blockHeight - (position?.stakeStartBlock || blockHeight);
  const stakedAmount = Number(position?.amountStaked || 0) / 1e6;
  const pendingRewards = Number(position?.pendingRewards || 0) / 1e6;
  
  // Calculate progress to next tier
  const nextTier = tier < TIERS.length - 1 ? TIERS[tier + 1] : null;
  const currentTierMin = TIERS[tier]?.minStake || 0;
  const nextTierMin = nextTier?.minStake || 0;
  const progressToNext = nextTier 
    ? Math.min(100, ((stakedAmount - currentTierMin) / (nextTierMin - currentTierMin)) * 100)
    : 100;
  const amountToNext = nextTier ? nextTierMin - stakedAmount : 0;

  // Mock USD rates
  const stxUsdRate = 0.65;
  const agsUsdRate = 0.042;
  const totalValue = (stakedAmount * stxUsdRate) + (pendingRewards * agsUsdRate);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Positions</h1>
              <p className="text-gray-400">Manage your staking positions and track rewards</p>
            </div>
            {position && position.amountStaked > BigInt(0) && (
              <div className="hidden md:block text-right">
                <p className="text-gray-400 text-sm">Total Position Value</p>
                <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
              </div>
            )}
          </div>

          {isLoading ? (
            <Card className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-400">Loading your positions...</p>
            </Card>
          ) : !position || position.amountStaked <= BigInt(0) ? (
            <Card className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Active Positions</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                You haven't staked any STX yet. Start staking to earn AGS rewards and unlock tier benefits.
              </p>
              <div className="flex gap-4 justify-center">
                <Button as="a" href="/stake" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Start Staking
                </Button>
                <Button as="a" href="/tiers" variant="secondary" size="lg">
                  View Tiers
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Main Position Card */}
              <Card>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${TIERS[tier]?.color}15` }}
                    >
                      <svg className="w-7 h-7" style={{ color: TIERS[tier]?.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Active Position</h2>
                      <p className="text-gray-400 text-sm">Started {blocksToTime(stakeDuration)} ago · Block {formatBlockHeight(position.stakeStartBlock)}</p>
                    </div>
                  </div>
                  <Badge 
                    size="lg"
                    style={{ backgroundColor: `${TIERS[tier]?.color}20`, color: TIERS[tier]?.color }}
                  >
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: TIERS[tier]?.color }} />
                    {TIERS[tier]?.name} Tier
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-400 text-sm">Staked</span>
                    </div>
                    <p className="text-xl font-bold text-white">{formatSTX(position.amountStaked)}</p>
                    <p className="text-gray-500 text-xs mt-1">≈ ${(stakedAmount * stxUsdRate).toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-400 text-sm">Rewards</span>
                    </div>
                    <p className="text-xl font-bold text-green-400">{formatAGS(position.pendingRewards)}</p>
                    <p className="text-gray-500 text-xs mt-1">≈ ${(pendingRewards * agsUsdRate).toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-gray-400 text-sm">APY</span>
                    </div>
                    <p className="text-xl font-bold text-purple-400">{apy}%</p>
                    <p className="text-gray-500 text-xs mt-1">Current rate</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-400 text-sm">Duration</span>
                    </div>
                    <p className="text-xl font-bold text-white">{blocksToTime(stakeDuration)}</p>
                    <p className="text-gray-500 text-xs mt-1">{stakeDuration.toLocaleString()} blocks</p>
                  </div>
                </div>

                {/* Tier Progress */}
                <div className="bg-gray-900/30 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">
                      {nextTier ? `Progress to ${nextTier.name}` : 'Maximum Tier Achieved'}
                    </span>
                    {nextTier && (
                      <span className="text-gray-400 text-sm">{amountToNext.toLocaleString()} STX more</span>
                    )}
                  </div>
                  <Progress 
                    value={progressToNext} 
                    color={nextTier ? 'purple' : 'green'}
                    size="md"
                  />
                  {nextTier && (
                    <p className="text-xs text-gray-500 mt-2">
                      Upgrade to {nextTier.name} tier for {calculateAPY(nextTier.minStake * 1e6, tier + 1)}% APY
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button as="a" href="/stake" className="flex-1" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Stake More
                  </Button>
                  <Button as="a" href="/claim" variant="success" className="flex-1" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Claim Rewards
                  </Button>
                  <Button as="a" href="/withdraw" variant="secondary" className="flex-1" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Withdraw
                  </Button>
                </div>
              </Card>

              {/* Tier Benefits Info */}
              <Card>
                <CardHeader 
                  title="Your Tier Benefits"
                  subtitle={`As a ${TIERS[tier]?.name} member, you enjoy these perks`}
                  icon={
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${TIERS[tier]?.color}15` }}
                    >
                      <svg className="w-5 h-5" style={{ color: TIERS[tier]?.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{apy}% APY</p>
                      <p className="text-gray-500 text-sm">Current reward rate</p>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Priority Support</p>
                      <p className="text-gray-500 text-sm">Discord access</p>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Governance</p>
                      <p className="text-gray-500 text-sm">Voting power</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
