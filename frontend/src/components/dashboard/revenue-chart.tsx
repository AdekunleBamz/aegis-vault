'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, DollarSign, Activity, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Monthly revenue data points (in $100 units) for the RevenueChart bar graph. */
const REVENUE_DATA = [12, 18, 15, 24, 21, 32, 28, 45, 42, 58, 54, 72];
/** Maximum value in REVENUE_DATA used to normalise bar heights. */
const REVENUE_MAX = Math.max(...REVENUE_DATA);

export function RevenueChart() {

    return (
        <div className="p-10 rounded-[48px] bg-background border border-border shadow-sm group hover:shadow-2xl transition-all duration-700 relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Revenue <span className="text-emerald-500">Growth</span></h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Staking & Strategy Yield</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">YTD Earnings</div>
                    <div className="text-3xl font-black text-emerald-500 tracking-tighter flex items-center gap-1 justify-end">
                        <Plus className="w-4 h-4" />
                        $12,840.42
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[200px] relative flex items-end gap-2 mb-10 group/grid">
                {/* Horizontal grid lines */}
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="absolute w-full h-px bg-border/20" style={{ bottom: `${i * 33.3}%` }} />
                ))}

                {REVENUE_DATA.map((h, i) => (
                    <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-4 group/bar">
                        {/* Tooltip */}
                        <div className="absolute bottom-[110%] mb-2 opacity-0 group-hover/bar:opacity-100 transition-all scale-90 group-hover/bar:scale-100 pointer-events-none z-20">
                            <div className="px-3 py-1.5 bg-foreground text-background text-[10px] font-black rounded-xl whitespace-nowrap shadow-xl">
                                ${(h * 100).toLocaleString()}
                            </div>
                        </div>

                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(h / REVENUE_MAX) * 100}%` }}
                            transition={{ delay: i * 0.05, duration: 1, ease: 'circOut' }}
                            className={cn(
                                "w-full rounded-t-2xl transition-all duration-300 relative overflow-hidden",
                                i === REVENUE_DATA.length - 1
                                    ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                    : "bg-emerald-500/20 group-hover/bar:bg-emerald-500/40"
                            )}
                        >
                            {i === REVENUE_DATA.length - 1 && (
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                            )}
                        </motion.div>
                        <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 group-hover/bar:opacity-100 transition-opacity">
                            M{i + 1}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-8 mt-auto pt-10 border-t border-border/30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted/30 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-emerald-500 transition-colors">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Efficiency</div>
                        <div className="text-lg font-black tracking-tight">98.2%</div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 text-xs font-black uppercase tracking-widest text-emerald-500 hover:translate-x-1 transition-transform cursor-pointer">
                    Detailed Report
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* Decor */}
            <div className="absolute -bottom-10 -left-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <PieChart className="w-64 h-64 -rotate-12" />
            </div>
        </div>
    );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    );
}
