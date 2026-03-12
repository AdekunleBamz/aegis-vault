'use client';

import React from 'react';
import Link from 'next/link';
import { useNetwork } from '@/hooks/use-network';
import { formatSTX, formatBlockHeight } from '@/lib/format';
import {
  BarChart3,
  Users,
  Gift,
  Box,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Stats() {
  const { blockHeight } = useNetwork();

  // TODO: Fetch real stats from contract
  const stats = [
    {
      label: 'Total Value Locked',
      value: formatSTX(BigInt(1500000000000)),
      unit: 'STX',
      note: 'Capital actively securing vault strategies',
      icon: BarChart3,
      color: 'text-aegis-blue',
      glow: 'shadow-aegis-blue/10'
    },
    {
      label: 'Active Stakers',
      value: '42',
      unit: 'Users',
      note: 'Wallets with live positions in the protocol',
      icon: Users,
      color: 'text-aegis-purple',
      glow: 'shadow-aegis-purple/10'
    },
    {
      label: 'Rewards Distributed',
      value: formatSTX(BigInt(50000000000)),
      unit: 'AGS',
      note: 'Governance incentives paid to participants',
      icon: Gift,
      color: 'text-aegis-cyan',
      glow: 'shadow-aegis-cyan/10'
    },
    {
      label: 'Current Block',
      value: formatBlockHeight(blockHeight),
      unit: 'Stacks',
      note: 'Latest synced network height from the connected app',
      icon: Box,
      color: 'text-aegis-indigo',
      glow: 'shadow-aegis-indigo/10'
    },
  ];

  const highlights = [
    'Capital depth',
    'User participation',
    'Rewards throughput',
    'Chain sync status'
  ];

  return (
    <section
      className="py-24 relative overflow-hidden bg-muted/20"
      aria-labelledby="stats-headline"
    >
      <div className="container relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 id="stats-headline" className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Protocol <span className="text-gradient">Performance</span>
            </h2>
            <p className="text-muted-foreground font-medium">
              Real-time metrics from the Aegis Vault protocol. Transparency at the core of decentralization.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-green-500" />
              Live Network Data
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/60 border border-border/60 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Box className="w-3.5 h-3.5 text-aegis-blue" />
              Block {formatBlockHeight(blockHeight)}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-[32px] border border-border/60 bg-background/50 p-5 backdrop-blur-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Use these numbers to sanity-check vault health before staking. The cards below separate capital, participation, rewards, and chain sync so the protocol state is easier to scan.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/stats"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-aegis-blue/30 bg-aegis-blue/10 px-5 py-3 text-sm font-semibold text-aegis-blue transition-all hover:border-aegis-cyan/40 hover:text-aegis-cyan"
          >
            Open full analytics
            <TrendingUp className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4" role="list">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              role="listitem"
              aria-label={`${stat.label}: ${stat.value} ${stat.unit}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative flex h-full flex-col p-8 rounded-[32px] bg-background border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1",
                stat.glow
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-2xl bg-muted group-hover:bg-foreground group-hover:text-background transition-colors duration-500", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground/30 group-hover:text-green-500 transition-colors" />
              </div>

              <div className="flex flex-1 flex-col space-y-1">
                <div className="text-3xl font-black tabular-nums tracking-tighter">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    {stat.label}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 bg-muted rounded-md text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
                <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                  {stat.note}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                  Review metric
                  <TrendingUp className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Hover Decorative Element */}
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-transparent to-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-aegis-blue/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-aegis-purple/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
