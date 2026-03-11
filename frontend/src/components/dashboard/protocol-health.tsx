'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { RewardChart } from './reward-chart';

export function ProtocolHealth() {
    // Mock data for protocol trends
    const tvlTrend = [
        { day: 1, amount: 1200000 },
        { day: 5, amount: 1250000 },
        { day: 10, amount: 1400000 },
        { day: 15, amount: 1350000 },
        { day: 20, amount: 1500000 },
        { day: 25, amount: 1650000 },
        { day: 30, amount: 1800000 },
    ];

    const metrics = [
        {
            label: 'Protocol Revenue',
            value: '$124.5k',
            change: '+12.5%',
            icon: DollarSign,
            color: 'text-emerald-500'
        },
        {
            label: 'Utilization Rate',
            value: '88.2%',
            change: '+2.1%',
            icon: Activity,
            color: 'text-aegis-blue'
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* TVL Analytics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 p-8 rounded-[40px] bg-background border border-border shadow-sm group hover:shadow-xl transition-all duration-500"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black tracking-tight">TVL <span className="text-gradient">Growth</span></h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">30 Day Protocol Performance</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">+14.2%</span>
                    </div>
                </div>

                <RewardChart data={tvlTrend} height={180} color="hsl(var(--aegis-blue))" />
            </motion.div>

            {/* Health Side Cards */}
            <div className="flex flex-col gap-6">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex-1 p-6 rounded-[32px] bg-muted/30 border border-border group hover:bg-background hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl bg-background", metric.color)}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                {metric.change}
                            </span>
                        </div>
                        <div>
                            <div className="text-2xl font-black tabular-nums mb-1">{metric.value}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</div>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex-1 p-6 rounded-[32px] bg-gradient-to-br from-aegis-blue/10 to-aegis-purple/10 border border-aegis-blue/20 flex items-center justify-between group"
                >
                    <div>
                        <div className="text-sm font-black mb-1">Protocol Efficiency</div>
                        <div className="text-[10px] font-bold text-muted-foreground max-w-[120px]">
                            Optimized for maximum institutional yield.
                        </div>
                    </div>
                    <PieChart className="w-10 h-10 text-aegis-blue opacity-50 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            </div>
        </div>
    );
}

// Missing import fix
import { cn } from '@/lib/utils';
