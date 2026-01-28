'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePositions } from '@/hooks/use-positions';
import { useWallet } from '@/hooks/use-wallet';
import { useBlockCountdown } from '@/hooks/use-network';
import { formatSTX } from '@/lib/format';
import Link from 'next/link';
import type { StakingPosition } from '@/types/staking';

export default function PositionsPage() {
  const { isConnected } = useWallet();
  const { positions, isLoading, refetch } = usePositions();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400">Connect to view your positions</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activePositions = positions.filter((p) => p.status === 'active');
  const pendingPositions = positions.filter((p) => p.status === 'pending-withdraw');

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Positions</h1>
              <p className="text-gray-400">
                {positions.length} total position{positions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
              <Link href="/stake">
                <Button>New Stake</Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-gray-400">Loading positions...</div>
          ) : positions.length === 0 ? (
            <Card className="p-12 text-center">
              <h2 className="text-xl font-bold mb-2">No Positions Yet</h2>
              <p className="text-gray-400 mb-6">
                Stake STX to start earning AGS rewards
              </p>
              <Link href="/stake">
                <Button size="lg">Stake Now</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Positions */}
              {activePositions.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active ({activePositions.length})
                  </h2>
                  <div className="grid gap-4">
                    {activePositions.map((pos) => (
                      <PositionCard key={pos.id} position={pos} />
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Withdrawal */}
              {pendingPositions.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Pending Withdrawal ({pendingPositions.length})
                  </h2>
                  <div className="grid gap-4">
                    {pendingPositions.map((pos) => (
                      <PositionCard key={pos.id} position={pos} isPending />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}

function PositionCard({ position, isPending }: { position: StakingPosition; isPending?: boolean }) {
  const { timeRemaining, isReady } = useBlockCountdown(position.endBlock);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Position Info */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: position.tier.color + '30', color: position.tier.color }}
          >
            {position.tier.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{position.tier.name}</span>
              <span className="text-gray-500">#{position.id}</span>
              {isPending && (
                <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded">Pending</span>
              )}
            </div>
            <div className="text-2xl font-bold">
              {formatSTX(position.amount * 1_000_000)} STX
            </div>
          </div>
        </div>

        {/* Center: Stats */}
        <div className="flex gap-8">
          <div>
            <div className="text-gray-400 text-sm">APY</div>
            <div className="font-semibold text-green-400">{position.tier.apy}%</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Rewards</div>
            <div className="font-semibold text-green-400">
              {position.rewards.toFixed(4)} AGS
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Unlock</div>
            <div className={`font-semibold ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
              {isReady ? 'Ready' : timeRemaining}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          {position.rewards > 0 && (
            <Link href="/claim">
              <Button variant="outline" size="sm">Claim</Button>
            </Link>
          )}
          <Link href="/withdraw">
            <Button size="sm">
              {isPending ? 'Complete' : 'Withdraw'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Block {position.startBlock}</span>
          <span>Block {position.endBlock}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all"
            style={{
              width: `${Math.min(100, Math.max(0, isReady ? 100 : (1 - (position.endBlock - position.startBlock) / position.tier.lockPeriod) * 100))}%`,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
