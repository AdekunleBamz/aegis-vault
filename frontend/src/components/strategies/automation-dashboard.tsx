'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap, CheckCircle2, AlertCircle, Cpu, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AutomationDashboard() {
    const activities = [
        {
            id: 1,
            type: 'Compound',
            strategy: 'Stable Harvester',
            amount: '42.5 STX',
            status: 'Success',
            time: '2 hours ago',
        },
        {
            id: 2,
            type: 'Rebalance',
            strategy: 'AGS Momentum',
            amount: 'N/A',
            status: 'Success',
            time: '5 hours ago',
        },
        {
            id: 3,
            type: 'Harvest',
            strategy: 'Delta-Neutral',
            amount: '128.2 STX',
            status: 'Pending',
            time: 'Just now',
        }
    ];

    return (
        <div className="rounded-[40px] bg-background/40 backdrop-blur-2xl border border-border p-8 lg:p-10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-aegis-purple/10 rounded-2xl flex items-center justify-center text-aegis-purple">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter">Automation <span className="text-gradient">Logs</span></h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Live execution feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Active</span>
                </div>
            </div>

            <div className="space-y-4">
                {activities.map((activity, i) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-3xl bg-background border border-border/40 hover:border-aegis-purple/30 transition-all group/item flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                activity.status === 'Success' ? "bg-emerald-500/10 text-emerald-500" : "bg-aegis-purple/10 text-aegis-purple"
                            )}>
                                {activity.type === 'Compound' && <Zap className="w-5 h-5" />}
                                {activity.type === 'Rebalance' && <Activity className="w-5 h-5" />}
                                {activity.type === 'Harvest' && <RotateCw className="w-5 h-5 animate-spin-slow" />}
                            </div>
                            <div>
                                <div className="text-sm font-black tracking-tight">{activity.type}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">{activity.strategy}</div>
                            </div>
                        </div>

                        <div className="hidden sm:block text-right">
                            <div className="text-xs font-black tabular-nums">{activity.amount !== 'N/A' && '+'}{activity.amount}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{activity.time}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest hidden lg:block",
                                activity.status === 'Success' ? "text-emerald-500" : "text-aegis-purple"
                            )}>
                                {activity.status}
                            </span>
                            {activity.status === 'Success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <div className="w-4 h-4 border-2 border-aegis-purple/30 border-t-aegis-purple rounded-full animate-spin" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 px-6 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 group/btn">
                View All Automation History
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>

            {/* Background Decor */}
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Activity className="w-48 h-48 rotate-12" />
            </div>
        </div>
    );
}

function RotateCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
        </svg>
    );
}
