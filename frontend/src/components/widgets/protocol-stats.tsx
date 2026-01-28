'use client';

import React, { useEffect, useState } from 'react';
import { getPoolStats, PoolStats } from '@/lib/staking';
import { formatSTX, formatBlockHeight } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading';

export function ProtocolStats() {
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const poolStats = await getPoolStats();
        setStats(poolStats);
      } catch (error) {
        console.error('Failed to fetch pool stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader title="Protocol Stats" subtitle="Live on-chain data" />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Value Locked</span>
          {isLoading ? (
            <LoadingSkeleton className="w-24 h-6" />
          ) : (
            <span className="text-white font-medium">
              {formatSTX(stats?.totalStaked || BigInt(0))} STX
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Stakers</span>
          {isLoading ? (
            <LoadingSkeleton className="w-16 h-6" />
          ) : (
            <span className="text-white font-medium">
              {stats?.totalStakers || 0}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Reward Rate</span>
          {isLoading ? (
            <LoadingSkeleton className="w-20 h-6" />
          ) : (
            <span className="text-green-400 font-medium">
              {formatSTX(stats?.rewardRate || BigInt(0))} AGS/block
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Last Distribution</span>
          {isLoading ? (
            <LoadingSkeleton className="w-24 h-6" />
          ) : (
            <span className="text-white font-medium">
              Block {formatBlockHeight(stats?.lastDistributionBlock || 0)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
