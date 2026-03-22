'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PortfolioSummary } from '@/components/widgets/portfolio-summary';
import { RecentActivity } from '@/components/widgets/recent-activity';
import { ProtocolStats } from '@/components/widgets/protocol-stats';
import { KPICard } from '@/components/dashboard/kpi-card';
import { RewardChart } from '@/components/dashboard/reward-chart';
import { ProtocolHealth } from '@/components/dashboard/protocol-health';
import {
  Zap,
  Target,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Coins,
  History,
  LayoutDashboard,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useWallet } from '@/context/wallet-context';

export default function DashboardPage() {
  const { isConnected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const mockRewardData = [
    { day: 1, amount: 10 }, { day: 5, amount: 25 }, { day: 10, amount: 15 },
    { day: 15, amount: 35 }, { day: 20, amount: 45 }, { day: 25, amount: 65 },
    { day: 30, amount: 85 }
  ];

  const quickActions = [
    {
      href: '/stake',
      title: 'Stake More',
      description: 'Increase your staked position',
      variant: 'blue',
      icon: Layers,
    },
    {
      href: '/withdraw',
      title: 'Withdraw',
      description: 'Unstake your STX tokens',
      variant: 'purple',
      icon: ArrowUpRight,
    },
    {
      href: '/claim',
      title: 'Claim Rewards',
      description: 'Collect your AGS earnings',
      variant: 'cyan',
      icon: Coins,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aegis-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aegis-purple/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <main className="flex-1 py-32 px-4 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <Breadcrumbs />
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <LayoutDashboard className="w-3 h-3" />
                Control Center
              </div>
              {isConnected && (
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live Sync
                </div>
              )}
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4">
              Project <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl font-medium">
              Monitor your staking yields, protocol health, and active positions in real-time.
            </p>
          </motion.div>

          {/* KPI Grid */}
          <section 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" 
            aria-label="Dashboard Statistics"
            aria-busy={isLoading}
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonKPI key={i} />
              ))
            ) : (
              [
                { label: "Total Staked", value: "12,450.00", secondaryValue: "STX", icon: Layers, variant: "blue", trend: { value: 12.5, isPositive: true, label: "vs last cycle" } },
                { label: "Accrued Rewards", value: "452.80", secondaryValue: "AGS", icon: Coins, variant: "purple", trend: { value: 8.2, isPositive: true, label: "velocity" } },
                { label: "Estimated APY", value: "14.2", secondaryValue: "%", icon: TrendingUp, variant: "cyan", trend: { value: 0.5, isPositive: true, label: "tier bonus" } },
                { label: "Protocol TVL", value: "2.4M", secondaryValue: "STX", icon: ShieldCheck, variant: "indigo", trend: { value: 2.1, isPositive: true, label: "growth" } }
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <KPICard {...kpi as any} />
                </motion.div>
              ))
            )}
          </section>

          <div className="space-y-12">
            <ProtocolHealth />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 rounded-[40px] bg-background border border-border">
                  <h3 className="text-xl font-black mb-6">Reward <span className="text-gradient">Projection</span></h3>
                  <RewardChart data={mockRewardData} height={250} />
                </div>
                <PortfolioSummary />
                <RecentActivity />
              </div>

              <div className="space-y-8">

                {/* Quick Actions Panel */}
                <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8" aria-label="Quick actions">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-aegis-blue" />
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    {quickActions.map((action) => (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="group flex items-center justify-between p-4 rounded-3xl bg-muted/30 border border-border/50 hover:border-aegis-blue/30 transition-all hover:bg-muted/50"
                        aria-label={`${action.title}: ${action.description}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                            action.variant === 'blue' && "bg-aegis-blue/10 text-aegis-blue",
                            action.variant === 'purple' && "bg-aegis-purple/10 text-aegis-purple",
                            action.variant === 'cyan' && "bg-aegis-cyan/10 text-aegis-cyan"
                          )}>
                            <action.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black tracking-tight">{action.title}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">{action.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

