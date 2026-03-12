'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Coins, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RewardChart } from '@/components/dashboard/reward-chart';

export function InsuranceFund() {
    const fundData = [
        { day: 1, amount: 450000 },
        { day: 5, amount: 465000 },
        { day: 10, amount: 480000 },
        { day: 15, amount: 500000 },
        { day: 20, amount: 525000 },
        { day: 25, amount: 540000 },
        { day: 30, amount: 550000 },
    ];

    return (
        <div className="p-8 rounded-[40px] bg-background border border-border shadow-sm group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black tracking-tight">Insurance <span className="text-gradient">Fund</span></h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Community Protection Pool</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-6 h-6" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-3xl bg-muted/20 border border-border/30">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Fund Balance</div>
                    <div className="text-xl font-black tabular-nums">550,000 STX</div>
                    <div className="text-[10px] font-bold text-emerald-500 mt-0.5">≈ $357.5k USD</div>
                </div>
                <div className="p-5 rounded-3xl bg-muted/20 border border-border/30">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Coverage Ratio</div>
                    <div className="text-xl font-black tabular-nums">22.4%</div>
                    <div className="text-[10px] font-bold text-aegis-blue mt-0.5">Total Liability Covered</div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Balance Trend</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">+22.2% Monthly</span>
                </div>
                <RewardChart data={fundData} height={120} color="hsl(var(--aegis-blue))" />
            </div>

            <div className="p-6 rounded-[32px] bg-aegis-blue/5 border border-aegis-blue/20 flex items-start gap-4">
                <Info className="w-5 h-5 text-aegis-blue shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                    The Aegis Insurance Fund is a backstop for protocol insolvency or unexpected losses. It is funded by 10% of all protocol revenue and yield capture.
                </p>
            </div>
        </div>
    );
}
