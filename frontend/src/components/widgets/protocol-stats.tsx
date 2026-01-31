'use client';

import React, { useEffect, useState } from 'react';
import { getPoolStats, PoolStats } from '@/lib/staking';
import { formatSTX, formatBlockHeight } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading';

export function ProtocolStats() {
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const poolStats = await getPoolStats();
        setStats(poolStats);
        setLastUpdated(new Date());
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

  const statItems = [
    {
      label: 'Total Value Locked',
      value: formatSTX(stats?.totalStaked || BigInt(0)) + ' STX',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Stakers',
      value: (stats?.totalStakers || 0).toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Reward Rate',
      value: formatSTX(stats?.rewardRate || BigInt(0)) + ' AGS/block',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      valueColor: 'text-green-400',
    },
    {
      label: 'Last Distribution',
      value: 'Block ' + formatBlockHeight(stats?.lastDistributionBlock || 0),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <Card>
      <CardHeader 
        title="Protocol Stats" 
        subtitle="Live on-chain data"
        action={
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        }
      />
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className={`${item.bgColor} rounded-xl p-4 transition-all hover:scale-[1.02]`}
          >
            <div className={`${item.iconColor} mb-3`}>
              {item.icon}
            </div>
            <p className="text-gray-400 text-sm mb-1">{item.label}</p>
            {isLoading ? (
              <LoadingSkeleton className="w-full h-6" />
            ) : (
              <p className={`font-semibold ${item.valueColor || 'text-white'}`}>
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
          <span>Last updated</span>
          <span>{lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}
    </Card>
  );
}
