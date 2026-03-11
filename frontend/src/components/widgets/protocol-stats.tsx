'use client';

import React, { useEffect, useState } from 'react';
import { getPoolStats, PoolStats } from '@/lib/staking';
import { formatSTX, formatBlockHeight } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  RefreshCw,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProtocolStats() {
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setIsRefreshing(true);
      try {
        const poolStats = await getPoolStats();
        setStats(poolStats);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch pool stats:', error);
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsRefreshing(false), 1000);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      label: 'Protocol TVL',
      value: formatSTX(stats?.totalStaked || BigInt(0)),
      unit: 'STX',
      icon: ShieldCheck,
      color: 'text-aegis-blue',
      bg: 'bg-aegis-blue/10',
    },
    {
      label: 'Active Stakers',
      value: (stats?.totalStakers || 0).toLocaleString(),
      unit: 'Users',
      icon: Users,
      color: 'text-aegis-purple',
      bg: 'bg-aegis-purple/10',
    },
    {
      label: 'Reward Rate',
      value: formatSTX(stats?.rewardRate || BigInt(0)),
      unit: 'AGS/blk',
      icon: Zap,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Last Epoch',
      value: formatBlockHeight(stats?.lastDistributionBlock || 0),
      unit: 'Block',
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 flex flex-col h-full relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Protocol Health</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Real-time Metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Activity className={cn("w-3 h-3 text-emerald-500", isRefreshing && "animate-spin")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {statItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-[32px] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group/stat"
          >
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover/stat:rotate-12", item.bg, item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{item.label}</p>
              {isLoading ? (
                <div className="w-full h-6 bg-muted animate-pulse rounded-lg" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tracking-tight">{item.value}</span>
                  <span className="text-[10px] font-black text-muted-foreground/40 uppercase">{item.unit}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/50 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
          <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
          Last Update: {lastUpdated?.toLocaleTimeString() || 'Waiting...'}
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-aegis-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-aegis-blue/10 transition-colors" />
    </div>
  );
}
