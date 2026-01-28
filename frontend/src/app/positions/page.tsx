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
            <h1 className="text-4xl font-bold mb-4">Your Positions</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view positions</p>
            <button
              onClick={connect}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
            >
              Connect Wallet
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tier = position?.tier || 0;
  const apy = calculateAPY(position?.amountStaked || BigInt(0), tier);
  const stakeDuration = blockHeight - (position?.stakeStartBlock || blockHeight);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Your Positions</h1>
          <p className="text-gray-400 mb-8">Manage your staking positions</p>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : !position || position.amountStaked <= BigInt(0) ? (
            <Card className="text-center py-12">
              <p className="text-gray-400 mb-4">You have no active positions</p>
              <a
                href="/stake"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
              >
                Start Staking
              </a>
            </Card>
          ) : (
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Active Stake</h2>
                  <p className="text-gray-400">Started at block {formatBlockHeight(position.stakeStartBlock)}</p>
                </div>
                <Badge 
                  style={{ backgroundColor: `${TIERS[tier]?.color}20`, color: TIERS[tier]?.color }}
                >
                  {TIERS[tier]?.name} Tier
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Staked Amount</p>
                  <p className="text-xl font-bold text-white">{formatSTX(position.amountStaked)} STX</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Pending Rewards</p>
                  <p className="text-xl font-bold text-green-400">{formatAGS(position.pendingRewards)} AGS</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Current APY</p>
                  <p className="text-xl font-bold text-purple-400">{apy}%</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Stake Duration</p>
                  <p className="text-xl font-bold text-white">{blocksToTime(stakeDuration)}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress to next tier</span>
                  <span className="text-white">
                    {tier < TIERS.length - 1 
                      ? `${formatSTX(position.amountStaked)} / ${TIERS[tier + 1].minStake} STX`
                      : 'Max tier reached'
                    }
                  </span>
                </div>
                <Progress 
                  value={Number(position.amountStaked) / 1e6} 
                  max={tier < TIERS.length - 1 ? TIERS[tier + 1].minStake : TIERS[tier].minStake}
                  color="purple"
                />
              </div>

              <div className="flex gap-4">
                <a
                  href="/stake"
                  className="flex-1 py-3 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Stake More
                </a>
                <a
                  href="/claim"
                  className="flex-1 py-3 bg-green-600 text-white text-center rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Claim Rewards
                </a>
                <a
                  href="/withdraw"
                  className="flex-1 py-3 bg-gray-700 text-white text-center rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Withdraw
                </a>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
