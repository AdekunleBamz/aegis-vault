'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBalances } from '@/hooks/use-balances';
import { usePositions } from '@/hooks/use-positions';
import { useWallet } from '@/hooks/use-wallet';
import { formatSTX, formatCompact } from '@/lib/format';
import Link from 'next/link';

export default function DashboardPage() {
  const { isConnected, address } = useWallet();
  const { stx, ags, isLoading: balancesLoading } = useBalances();
  const { positions, isLoading: positionsLoading } = usePositions();

  const totalStaked = positions.reduce((sum, p) => sum + p.amount, 0);
  const totalRewards = positions.reduce((sum, p) => sum + p.rewards, 0);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your dashboard
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Section>
          {/* Portfolio Overview */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400 font-mono text-sm">{address}</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="text-gray-400 text-sm mb-1">Available STX</div>
              <div className="text-2xl font-bold">
                {balancesLoading ? '...' : formatSTX(stx * 1_000_000)}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-gray-400 text-sm mb-1">Total Staked</div>
              <div className="text-2xl font-bold text-blue-400">
                {positionsLoading ? '...' : formatSTX(totalStaked * 1_000_000)}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-gray-400 text-sm mb-1">Pending Rewards</div>
              <div className="text-2xl font-bold text-green-400">
                {positionsLoading ? '...' : `${totalRewards.toFixed(4)} AGS`}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-gray-400 text-sm mb-1">AGS Balance</div>
              <div className="text-2xl font-bold text-purple-400">
                {balancesLoading ? '...' : formatCompact(ags)}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/stake">
              <Card className="p-6 hover:border-blue-500 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Stake STX</div>
                    <div className="text-sm text-gray-400">Earn rewards</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/claim">
              <Card className="p-6 hover:border-green-500 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Claim Rewards</div>
                    <div className="text-sm text-gray-400">{totalRewards.toFixed(2)} AGS available</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/withdraw">
              <Card className="p-6 hover:border-yellow-500 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Withdraw</div>
                    <div className="text-sm text-gray-400">Unstake your STX</div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Active Positions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Active Positions</h2>
              <Link href="/positions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>

            {positionsLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No active stakes</p>
                <Link href="/stake">
                  <Button>Stake Now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.slice(0, 5).map((pos) => (
                  <div
                    key={pos.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pos.tier.color }}
                      />
                      <div>
                        <div className="font-medium">{pos.tier.name} #{pos.id}</div>
                        <div className="text-sm text-gray-400">
                          {formatSTX(pos.amount * 1_000_000)} STX
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        +{pos.rewards.toFixed(4)} AGS
                      </div>
                      <div className="text-sm text-gray-400">{pos.tier.apy}% APY</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
}
