'use client';

/**
 * @file Governance statistics display component
 * 
 * Displays real-time governance metrics including treasury value,
 * quorum status, active voters, and staked governance tokens.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Landmark, PieChart, Users2, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * GovernanceStats displays key governance metrics for the protocol.
 * Shows treasury value, quorum status, active voters, and staked vAGS.
 */
export function GovernanceStats() {
    const stats = [
        {
            label: 'Treasury Value',
            value: '$4.2M',
            change: '+12.5%',
            detail: 'STX + AGS + BTC',
            icon: Landmark,
            color: 'text-aegis-blue'
        },
        {
            label: 'Quorum Reached',
            value: '78%',
            change: 'Avg 65%',
            detail: 'Recent Proposals',
            icon: Activity,
            color: 'text-emerald-500'
        },
        {
            label: 'Active Voters',
            value: '1,240',
            change: '+42.1%',
            detail: 'This Month',
            icon: Users2,
            color: 'text-aegis-purple'
        },
        {
            label: 'Staked vAGS',
            value: '12.4M',
            change: '88% of supply',
            detail: 'Governance Lockup',
            icon: PieChart,
            color: 'text-orange-500'
        }
    ];

    return (
        <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 lg:p-10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter">Governance <span className="text-gradient">Pulse</span></h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Real-time protocol metrics</p>
                </div>
                <button
                  className="p-3 bg-muted/50 hover:bg-muted rounded-2xl transition-all"
                  aria-label="Open governance trend details"
                >
                    <TrendingUp className="w-5 h-5 text-aegis-blue" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-background border border-border group/stat hover:border-aegis-blue/30 transition-all relative overflow-hidden"
                        aria-label={`${stat.label}: ${stat.value}, ${stat.change}`}
                    >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={cn("p-3 rounded-2xl bg-muted/50 group-hover/stat:scale-110 transition-transform", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.change}</div>
                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{stat.detail}</div>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{stat.label}</div>
                            <div className="text-2xl font-black tracking-tight tabular-nums">{stat.value}</div>
                        </div>

                        {/* Subtle background glow */}
                        <div className={cn(
                            "absolute -bottom-4 -right-4 w-24 h-24 blur-3xl opacity-0 group-hover/stat:opacity-20 transition-opacity pointer-events-none",
                            stat.color.replace('text-', 'bg-')
                        )} />
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-[32px] bg-muted/20 border border-border/30 flex items-start gap-4">
                <Info className="w-5 h-5 text-aegis-blue shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                    Governance parameters are subject to change via Phase 1 governance votes. Current quorum for protocol upgrades is set to 25% of total vAGS supply.
                </p>
            </div>
        </div>
    );
}
