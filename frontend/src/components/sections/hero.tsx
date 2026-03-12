'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/wallet-context';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Globe,
  ChevronRight,
  TrendingUp,
  Clock,
  LayoutGrid,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Hero() {
  const { isConnected, connect } = useWallet();

  const stats = [
    { value: '12%', label: 'Base APY', icon: TrendingUp, color: 'text-aegis-blue' },
    { value: '24%', label: 'Max APY', icon: Zap, color: 'text-aegis-purple' },
    { value: '3-30', label: 'Days Lockup', icon: Clock, color: 'text-aegis-indigo' },
    { value: '4', label: 'Reward Tiers', icon: LayoutGrid, color: 'text-aegis-cyan' },
  ];

  const proofPoints = [
    'Non-custodial vault access',
    'Tiered rewards with clear lock windows',
    'Mainnet-ready analytics and transparency'
  ];

  return (
    <section
      className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center"
      aria-labelledby="hero-headline"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-aegis-blue/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-aegis-purple/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-aegis-indigo/5 rounded-full blur-[140px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-md mb-8 group cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Mainnet Protocol Live
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            id="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            Secure Your STX. <br />
            <span className="text-gradient">Maximize Rewards.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Aegis Vault is a non-custodial staking primitive for the Stacks ecosystem.
            Earn institutional-grade yield with flexible lockup periods.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {isConnected ? (
              <Link
                href="/stake"
                className="group relative px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-blue)/0.5)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Staking Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-aegis-blue to-aegis-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            ) : (
              <button
                onClick={connect}
                className="group relative px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-blue)/0.5)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect to Stake
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-aegis-blue to-aegis-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            )}
            <Link
              href="#stake-panel"
              aria-label="Jump to the staking calculator"
              className="px-8 py-4 rounded-full border border-border bg-muted/30 backdrop-blur-md text-foreground font-bold text-lg hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
            >
              Estimate My Rewards
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {proofPoints.map((point) => (
              <div
                key={point}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
              >
                <ShieldCheck className="h-4 w-4 text-aegis-blue" />
                <span>{point}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats Grid */}
          <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-6 rounded-3xl bg-muted/30 border border-border/50 backdrop-blur-sm group hover:border-border transition-colors cursor-default"
              >
                <stat.icon className={cn("w-5 h-5 mb-4 opacity-70 group-hover:opacity-100 transition-opacity", stat.color)} />
                <div className="text-3xl font-black tabular-nums tracking-tighter mb-1">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/50"
          >
            <div className="flex items-center gap-2 group hover:text-foreground transition-colors">
              <ShieldCheck className="w-4 h-4 text-green-500/50 group-hover:text-green-500 transition-colors" />
              Smart Contract Audited
            </div>
            <div className="flex items-center gap-2 group hover:text-foreground transition-colors">
              <Globe className="w-4 h-4 text-blue-500/50 group-hover:text-blue-500 transition-colors" />
              Fully Decentralized
            </div>
            <div className="flex items-center gap-2 group hover:text-foreground transition-colors">
              <Zap className="w-4 h-4 text-purple-500/50 group-hover:text-purple-500 transition-colors" />
              Real-time Rewards
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
