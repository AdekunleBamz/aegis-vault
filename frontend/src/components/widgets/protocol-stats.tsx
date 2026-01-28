'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useTotalStaked, useTreasuryBalance } from '@/hooks/use-contract-read';
import { useNetworkStats } from '@/hooks/use-network';
import { formatCompact } from '@/lib/format';

export function ProtocolStats() {
  const { data: totalStakedData, isLoading: stakingLoading } = useTotalStaked();
  const { data: treasuryData, isLoading: treasuryLoading } = useTreasuryBalance();
  const { currentBlock } = useNetworkStats();

  const totalStaked = totalStakedData?.value 
    ? parseInt(totalStakedData.value) / 1_000_000 
    : 0;
  
  const treasuryBalance = treasuryData?.value 
    ? parseInt(treasuryData.value) / 1_000_000 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 text-center">
        <div className="text-gray-400 text-xs mb-1">Total Staked</div>
        <div className="text-xl font-bold text-blue-400">
          {stakingLoading ? '...' : `${formatCompact(totalStaked)} STX`}
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-gray-400 text-xs mb-1">Treasury</div>
        <div className="text-xl font-bold text-green-400">
          {treasuryLoading ? '...' : `${formatCompact(treasuryBalance)} STX`}
        </div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-gray-400 text-xs mb-1">Max APY</div>
        <div className="text-xl font-bold text-yellow-400">25%</div>
      </Card>

      <Card className="p-4 text-center">
        <div className="text-gray-400 text-xs mb-1">Block Height</div>
        <div className="text-xl font-bold text-purple-400">
          {currentBlock ? currentBlock.toLocaleString() : '...'}
        </div>
      </Card>
    </div>
  );
}
