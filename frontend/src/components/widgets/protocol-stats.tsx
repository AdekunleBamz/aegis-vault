'use client';

import React, { useEffect, useState } from 'react';
import { getPoolStats, PoolStats } from '@/lib/staking';
import { formatSTX, formatBlockHeight } from '@/lib/format';
import { Card, CardHeader } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading';
import { motion } from 'framer-motion';
import { Lock, Users, TrendingUp, History, ArrowUpRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NumberTicker } from '@/components/ui/number-ticker';

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
      value: Number(stats?.totalStaked || BigInt(0)) / 1e6,
      suffix: ' STX',
      icon: <Lock className="w-5 h-5" />,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Stakers',
      value: stats?.totalStakers || 0,
      icon: <Users className="w-5 h-5" />,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Reward Rate',
      value: Number(stats?.rewardRate || BigInt(0)) / 1e6,
      suffix: ' AGS/block',
      icon: <TrendingUp className="w-5 h-5" />,
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      valueColor: 'text-green-400',
    },
    {
      label: 'Last Distribution',
      value: Number(stats?.lastDistributionBlock || 0),
      prefix: 'Block ',
      icon: <History className="w-5 h-5" />,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="glass-dark border border-white/5 rounded-2xl overflow-hidden h-full">
      <div className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">Protocol Vitality</h3>
            <p className="text-gray-500 text-xs">Real-time on-chain statistics</p>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-tight">Active</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ delay: 0.05 * index }}
              className="group bg-gray-950/40 border border-white/[0.03] rounded-xl p-4 hover:border-white/5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg transition-colors", item.bgColor)}>
                    <div className={item.iconColor}>
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">{item.label}</p>
                    {isLoading ? (
                      <div className="h-5 w-24 bg-white/5 animate-pulse rounded" />
                    ) : (
                      <div className={cn("font-bold tabular-nums", item.valueColor || 'text-white')}>
                        {/* @ts-ignore - we know prefix/suffix exist but TS might complain if they aren't on every item */}
                        {item.prefix}
                        <NumberTicker
                          value={item.value as number}
                          decimalPlaces={(item.label.includes('Rate') || item.label.includes('Value')) ? 2 : 0}
                        />
                        {/* @ts-ignore */}
                        {item.suffix}
                      </div>
                    )}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {lastUpdated && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Sync Status
            </span>
            <span className="text-gray-500 tabular-nums">Latest: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
