'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Vote, Zap, Users, Info, ArrowUpRight } from 'lucide-react';

export function VotingPower() {
    // Mock data - would be derived from AGS balance and lock duration
    const stats = {
        totalPower: '24,500',
        multiplier: '2.5x',
        rank: 'Top 5%',
        delegated: '0',
        nextEpoch: '2d 14h'
    };

    return (
        <div className="p-8 rounded-[40px] bg-background border border-border shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-aegis-purple/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-aegis-purple/10 rounded-2xl flex items-center justify-center text-aegis-purple">
                        <Vote className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Voting <span className="text-gradient">Power</span></h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Your Governance Influence</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-muted/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Epoch 42
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/30 relative group/power">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Current vAGS Balance</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tabular-nums">{stats.totalPower}</span>
                        <span className="text-sm font-black text-aegis-purple">vAGS</span>
                    </div>
                    <motion.div
                        className="absolute top-6 right-6 p-2 bg-aegis-purple/10 rounded-xl text-aegis-purple opacity-0 group-hover/power:opacity-100 transition-opacity"
                        initial={false}
                    >
                        <Zap className="w-4 h-4 fill-current" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/10 border border-border/20">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Multiplier</div>
                        <div className="text-lg font-black">{stats.multiplier}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/10 border border-border/20">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Global Rank</div>
                        <div className="text-lg font-black">{stats.rank}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-aegis-purple/5 border border-aegis-purple/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-aegis-purple" />
                        <span className="text-xs font-bold text-muted-foreground">Delegation Status</span>
                    </div>
                    <button
                        className="text-[10px] font-black uppercase tracking-widest text-aegis-purple hover:underline flex items-center gap-1"
                        aria-label="Setup voting power delegation"
                    >
                        Setup
                        <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        Next Snapshot
                        <Info className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-black tabular-nums text-foreground">{stats.nextEpoch}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-aegis-purple"
                        role="progressbar"
                        aria-label="Time remaining before next governance snapshot"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={65}
                    />
                </div>
            </div>
        </div>
    );
}
