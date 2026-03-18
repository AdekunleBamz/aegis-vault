'use client';

import { StakingFlow } from '@/components/flows/staking-flow';
import { RewardProjection } from '@/components/dashboard/reward-projection';
import { TIERS } from '@/lib/constants';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Star,
  TrendingUp,
  ArrowRight,
  Calculator,
  Info,
  Layers,
  LayoutGrid,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function StakePage() {
  return (
    <div className="relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aegis-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aegis-purple/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="px-4 py-12 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <Breadcrumbs />
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-aegis-blue/10 border border-aegis-blue/20 rounded-full px-4 py-1.5 mb-6 text-aegis-blue">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Incentivized Staking Phase</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
              Protocol <span className="text-gradient">Staking</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Secure the Aegis Vault protocol while earning premium staking yields and governance weight.
            </p>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Interaction */}
            <div className="lg:col-span-7 space-y-12">
              <StakingFlow />

              {/* Protocol Commitments */}
              <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 md:p-10" aria-labelledby="commitments-title">
                <h3 id="commitments-title" className="text-xl font-black mb-8 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-aegis-blue" />
                  Protocol Commitments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Lock,
                      title: "Secure Lockdown",
                      desc: "24-hour cooling period for stability."
                    },
                    {
                      icon: Zap,
                      title: "Instant Accrual",
                      desc: "Earnings start precisely every block."
                    },
                    {
                      icon: Star,
                      title: "Tier Multiplier",
                      desc: "Hold more STX to scale your rewards."
                    },
                    {
                      icon: Calculator,
                      title: "Full Transparency",
                      desc: "Audit every yield projection on-chain."
                    }
                  ].map((tip, i) => (
                    <div key={i} className="group p-4 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <tip.icon className="w-4 h-4 text-aegis-blue group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-black tracking-tight">{tip.title}</h4>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Analytics & Info */}
            <div className="lg:col-span-5 space-y-12">
              <RewardProjection />

              {/* Tier Benefits & Comparison */}
              <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 md:p-10">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                  <LayoutGrid className="w-6 h-6 text-aegis-purple" />
                  Yield Tier Structure
                </h3>
                <div className="space-y-4">
                  {TIERS.map((tier, i) => (
                    <div
                      key={tier.name}
                      className="group flex items-center justify-between p-5 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12"
                          style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
                        >
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black tracking-tight">{tier.name}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                            {tier.minStake > 0 ? `${tier.minStake.toLocaleString()} STX+` : "Core Entry"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-500 text-lg font-black tabular-nums">
                          {tier.baseApy}% <span className="text-[10px] text-muted-foreground/40">APY</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons removed (already in main import)
