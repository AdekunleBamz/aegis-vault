'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useWallet } from '@/context/wallet-context';
import { usePositions } from '@/hooks/use-positions';
import { useNetwork } from '@/hooks/use-network';
import { formatSTX, formatAGS, formatBlockHeight, blocksToTime } from '@/lib/format';
import { TIERS } from '@/lib/constants';
import { calculateAPY } from '@/lib/staking';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  LayoutGrid,
  History,
  ArrowUpRight,
  Plus,
  Coins,
  ChevronRight,
  ArrowLeft,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PositionsPage() {
  const { address, isConnected, connect } = useWallet();
  const { position, isLoading } = usePositions(address || '');
  const { blockHeight } = useNetwork();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <Header />

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aegis-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aegis-purple/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <main className="flex-1 py-32 px-4 relative z-10">
          <div className="container max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background/40 backdrop-blur-3xl border border-border/50 rounded-[48px] p-12 shadow-2xl"
            >
              <div className="w-24 h-24 bg-muted rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-border/50">
                <ShieldCheck className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter mb-4">Vault Access Locked</h1>
              <p className="text-muted-foreground font-medium mb-10">Connect your decentralized wallet to view your active staking positions and accrued governance rewards.</p>
              <button
                onClick={connect}
                className="w-full py-5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-[0_0_40px_-10px_hsl(var(--foreground)/0.5)] transition-all active:scale-95"
              >
                Authenticate Wallet
              </button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tier = position?.tier || 0;
  const apy = calculateAPY(position?.amountStaked || BigInt(0), tier);
  const stakeDuration = blockHeight - (position?.stakeStartBlock || blockHeight);
  const stakedAmount = Number(position?.amountStaked || 0) / 1e6;
  const pendingRewards = Number(position?.pendingRewards || 0) / 1e6;

  // Calculate progress to next tier
  const nextTier = tier < TIERS.length - 1 ? TIERS[tier + 1] : null;
  const currentTierMin = TIERS[tier]?.minStake || 0;
  const nextTierMin = nextTier?.minStake || 0;
  const progressToNext = nextTier
    ? Math.min(100, ((stakedAmount - currentTierMin) / (nextTierMin - currentTierMin)) * 100)
    : 100;
  const amountToNext = nextTier ? nextTierMin - stakedAmount : 0;

  // Mock USD rates
  const stxUsdRate = 0.65;
  const agsUsdRate = 0.042;
  const totalValue = (stakedAmount * stxUsdRate) + (pendingRewards * agsUsdRate);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aegis-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aegis-purple/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <main className="flex-1 py-32 px-4 relative z-10">
        <div className="container max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  Inventory
                </div>
                <div className="px-3 py-1 bg-aegis-blue/10 border border-aegis-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest text-aegis-blue flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-aegis-blue rounded-full animate-pulse" />
                  Vault v2
                </div>
              </div>
              <h1 className="text-5xl font-black tracking-tighter">Your <span className="text-gradient">Positions</span></h1>
              <p className="text-lg text-muted-foreground max-w-xl font-medium mt-2">
                Manage your active vault positions, monitor yield accrual, and optimize your staking tier.
              </p>
            </div>

            {position && position.amountStaked > BigInt(0) && (
              <div className="p-8 rounded-[32px] bg-background/40 backdrop-blur-2xl border border-border/50 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">Combined Position Value</p>
                <div className="text-4xl font-black tracking-tight">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32"
              >
                <div className="w-16 h-16 relative mb-6">
                  <div className="absolute inset-0 border-4 border-aegis-blue/10 rounded-full" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-aegis-blue border-t-transparent rounded-full"
                  />
                </div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Synchronizing Vault Data...</p>
              </motion.div>
            ) : !position || position.amountStaked <= BigInt(0) ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[48px] border border-border bg-background/40 backdrop-blur-2xl p-16 text-center overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-aegis-blue/5 to-aegis-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-24 h-24 bg-muted rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h2 className="text-3xl font-black mb-4">No Active Positions</h2>
                  <p className="text-muted-foreground font-medium mb-10">
                    You haven't deployed any capital to the Aegis Vault yet. Start staking to earn protocol rewards and unlock exclusive tier benefits.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/stake">
                      <button className="px-8 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Initiate Staking
                      </button>
                    </Link>
                    <Link href="/tiers">
                      <button className="px-8 py-4 bg-muted/50 hover:bg-muted rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                        View Tiers
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Main Position Card */}
                <div className="rounded-[48px] border border-border bg-background/40 backdrop-blur-2xl p-10 lg:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-aegis-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                      <div className="flex items-center gap-6">
                        <div
                          className="w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl relative overflow-hidden group/icon"
                          style={{ backgroundColor: `${TIERS[tier]?.color}15` }}
                        >
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                          <TrendingUp className="w-10 h-10 relative z-10" style={{ color: TIERS[tier]?.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-black tracking-tighter">Active Position</h2>
                            <div
                              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                              style={{ backgroundColor: `${TIERS[tier]?.color}20`, color: TIERS[tier]?.color, border: `1px solid ${TIERS[tier]?.color}30` }}
                            >
                              {TIERS[tier]?.name} Tier
                            </div>
                          </div>
                          <p className="text-muted-foreground font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Active for {blocksToTime(stakeDuration)} · Started Block {formatBlockHeight(position.stakeStartBlock)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link href="/withdraw" className="flex-1 lg:flex-initial">
                          <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-muted/50 hover:bg-muted rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                            Unstake
                          </button>
                        </Link>
                        <Link href="/stake" className="flex-1 lg:flex-initial">
                          <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-lg">
                            Add Capital
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 flex flex-col justify-between group/stat hover:bg-muted/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Principal Staked</span>
                          <Layers className="w-4 h-4 text-aegis-blue group-hover/stat:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <div className="text-2xl font-black">{formatSTX(position.amountStaked)} STX</div>
                          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">≈ ${(stakedAmount * stxUsdRate).toLocaleString()} USD</div>
                        </div>
                      </div>

                      <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 flex flex-col justify-between group/stat hover:bg-muted/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Accrued Rewards</span>
                          <Coins className="w-4 h-4 text-emerald-500 group-hover/stat:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-emerald-500">{formatAGS(position.pendingRewards)} AGS</div>
                          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">≈ ${(pendingRewards * agsUsdRate).toLocaleString()} USD</div>
                        </div>
                      </div>

                      <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 flex flex-col justify-between group/stat hover:bg-muted/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Current Yield</span>
                          <Zap className="w-4 h-4 text-aegis-purple group-hover/stat:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-aegis-purple">{apy}% APY</div>
                          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">Efficiency Level</div>
                        </div>
                      </div>

                      <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 flex flex-col justify-between group/stat hover:bg-muted/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Time Locked</span>
                          <Clock className="w-4 h-4 text-aegis-cyan group-hover/stat:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <div className="text-2xl font-black">{blocksToTime(stakeDuration)}</div>
                          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">{stakeDuration.toLocaleString()} Blocks</div>
                        </div>
                      </div>
                    </div>

                    {/* Tier Progress */}
                    {nextTier && (
                      <div className="mt-12 p-8 rounded-[32px] bg-muted/10 border border-border/30">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Boost Progress</div>
                            <div className="text-lg font-black tracking-tight">Path to <span className="text-gradient" style={{ '--gradient-from': nextTier.color, '--gradient-to': nextTier.color } as any}>{nextTier.name} Tier</span></div>
                          </div>
                          <div className="text-[10px] font-black text-aegis-blue uppercase tracking-widest bg-aegis-blue/10 px-3 py-1 rounded-full">
                            {amountToNext.toLocaleString()} STX to unlock boost
                          </div>
                        </div>
                        <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden p-[2px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-aegis-blue to-aegis-purple rounded-full relative"
                          >
                            <div className="absolute top-0 right-0 w-24 h-full bg-white/20 blur-md animate-pulse" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Benefits / Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 group hover:bg-muted/5 transition-all">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight mb-2">Maximum Yield</h3>
                    <p className="text-sm text-muted-foreground font-medium">Your current {apy}% APY is active. Rewards accrue every block and can be claimed anytime.</p>
                  </div>

                  <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 group hover:bg-muted/5 transition-all">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-2xl flex items-center justify-center text-aegis-blue mb-6 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight mb-2">Auto-Compounding</h3>
                    <p className="text-sm text-muted-foreground font-medium">Your governance tokens (AGS) represent your voting power in the upcoming Aegis DAO.</p>
                  </div>

                  <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 group hover:bg-muted/5 transition-all">
                    <div className="w-12 h-12 bg-aegis-purple/10 rounded-2xl flex items-center justify-center text-aegis-purple mb-6 group-hover:scale-110 transition-transform">
                      <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight mb-2">Protocol Access</h3>
                    <p className="text-sm text-muted-foreground font-medium">Being a {TIERS[tier]?.name} tier member grants you early access to new vault strategies.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
