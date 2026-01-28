'use client';

import React from 'react';
import { useWallet } from '@/context/wallet-context';
import { useBalances } from '@/hooks/use-balances';
import { usePositions } from '@/hooks/use-positions';
import { formatSTX, formatAGS } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading';

export function PortfolioSummary() {
  const { address, isConnected } = useWallet();
  const { stxBalance, agsBalance, isLoading: balancesLoading } = useBalances(address || '');
  const { position, isLoading: positionLoading } = usePositions(address || '');

  const isLoading = balancesLoading || positionLoading;
  const tier = position?.tier || 0;

  if (!isConnected) {
    return (
      <Card>
        <CardHeader title="Portfolio" subtitle="Connect wallet to view" />
        <div className="text-center py-8 text-gray-500">
          <p>Connect your wallet to view your portfolio</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="Your Portfolio" 
        action={
          <Badge variant="info" style={{ backgroundColor: `${TIERS[tier]?.color}20`, color: TIERS[tier]?.color }}>
            {TIERS[tier]?.name || 'Bronze'}
          </Badge>
        }
      />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">STX Balance</p>
            {isLoading ? (
              <LoadingSkeleton className="w-20 h-7" />
            ) : (
              <p className="text-xl font-bold text-white">{formatSTX(stxBalance)}</p>
            )}
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">AGS Balance</p>
            {isLoading ? (
              <LoadingSkeleton className="w-20 h-7" />
            ) : (
              <p className="text-xl font-bold text-purple-400">{formatAGS(agsBalance)}</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Staked</span>
            {isLoading ? (
              <LoadingSkeleton className="w-24 h-6" />
            ) : (
              <span className="text-white font-medium">
                {formatSTX(position?.amountStaked || BigInt(0))} STX
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Pending Rewards</span>
            {isLoading ? (
              <LoadingSkeleton className="w-20 h-6" />
            ) : (
              <span className="text-green-400 font-medium">
                {formatAGS(position?.pendingRewards || BigInt(0))} AGS
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
