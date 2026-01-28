'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBalances } from '@/hooks/use-balances';
import { usePositions } from '@/hooks/use-positions';
import { useWallet } from '@/hooks/use-wallet';
import { formatSTX, formatCompact, truncateAddress } from '@/lib/format';
import Link from 'next/link';

export function PortfolioSummary() {
  const { address, isConnected } = useWallet();
  const { stx, ags, isLoading: balancesLoading } = useBalances();
  const { positions, isLoading: positionsLoading } = usePositions();

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-400 mb-4">Connect your wallet to view portfolio</p>
      </Card>
    );
  }

  const totalStaked = positions.reduce((sum, p) => sum + p.amount, 0);
  const totalRewards = positions.reduce((sum, p) => sum + p.rewards, 0);
  const totalValue = stx + totalStaked;

  const isLoading = balancesLoading || positionsLoading;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Your Portfolio</h3>
          <p className="text-sm text-gray-400 font-mono">{truncateAddress(address || '')}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4">
          {/* Total Value */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4">
            <div className="text-sm text-gray-400">Total Portfolio Value</div>
            <div className="text-3xl font-bold">{formatSTX(totalValue * 1_000_000)} STX</div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Available</div>
              <div className="text-xl font-bold">{formatCompact(stx)} STX</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Staked</div>
              <div className="text-xl font-bold text-blue-400">{formatCompact(totalStaked)} STX</div>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-400">Pending Rewards</div>
              <div className="text-xl font-bold text-green-400">{totalRewards.toFixed(4)} AGS</div>
            </div>
            {totalRewards > 0 && (
              <Link href="/claim">
                <Button size="sm">Claim</Button>
              </Link>
            )}
          </div>

          {/* AGS Balance */}
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-400">AGS Balance</div>
              <div className="text-xl font-bold text-purple-400">{formatCompact(ags)} AGS</div>
            </div>
          </div>

          {/* Active Positions Count */}
          <div className="text-center text-sm text-gray-400">
            {positions.length} active position{positions.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </Card>
  );
}
