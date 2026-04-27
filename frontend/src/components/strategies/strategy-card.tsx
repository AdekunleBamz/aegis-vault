'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const RISK_COLOR: Record<RiskLevel, string> = {
  Low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  High: 'text-red-500 bg-red-500/10 border-red-500/20',
};

export type RiskLevel = 'Low' | 'Medium' | 'High';

interface StrategyCardProps {
    title: string;
    description: string;
    apy: string;
    risk: RiskLevel;
    tvl: string;
    tags: string[];
    isPopular?: boolean;
}

export function StrategyCard({
    title,
    description,
    apy,
    risk,
    tvl,
    tags,
    isPopular
}: StrategyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[40px] bg-background border border-border hover:border-aegis-purple/30 transition-all group relative overflow-hidden flex flex-col h-full"
        >
            {isPopular && (
                <div className="absolute top-6 right-6">
                    <div className="px-3 py-1 bg-aegis-purple text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-aegis-purple/20 flex items-center gap-2">
                        <Zap className="w-3 h-3 fill-current" />
                        Trending
                    </div>
                </div>
            )}

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        RISK_COLOR[risk]
                    )}>
                        {risk} Risk
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {tvl} TVL
                    </div>
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2 group-hover:text-gradient transition-all">{title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-3">
                    {description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-muted/50 rounded-lg text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-auto space-y-6">
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/30 relative">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Target APY</span>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-4xl font-black tracking-tight tabular-nums text-foreground">
                        {apy}<span className="text-sm text-muted-foreground ml-1">%</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                      className="flex-1 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                      aria-label={`Deploy ${title} strategy`}
                    >
                        Deploy Vault
                    </button>
                    <button
                      className="p-4 bg-muted/50 hover:bg-muted rounded-full transition-all group/info"
                      aria-label={`View ${title} metrics`}
                    >
                        <BarChart3 className="w-4 h-4 text-muted-foreground group-hover/info:text-foreground transition-colors" />
                    </button>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-8 -left-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Shield className="w-48 h-48 -rotate-12" />
            </div>
        </motion.div>
    );
}
