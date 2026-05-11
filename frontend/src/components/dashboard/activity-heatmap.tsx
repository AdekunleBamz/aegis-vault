'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Total number of weeks rendered in the activity heatmap grid. */
const HEATMAP_WEEKS = 20;
/** Total number of days per week column in the activity heatmap grid. */
const HEATMAP_DAYS = 7;

const LEVEL_COLOR: Record<number, string> = {
    0: 'bg-muted/30',
    1: 'bg-aegis-blue/20',
    2: 'bg-aegis-blue/40',
    3: 'bg-aegis-blue/70 text-white',
    4: 'bg-aegis-blue text-white shadow-[0_0_15px_rgba(40,140,250,0.3)]',
};

const DEFAULT_LEVEL_COLOR = 'bg-muted/30';

export function ActivityHeatmap() {
    // Mock data for a 20-week grid
    const generateData = React.useMemo(() => {
        return Array.from({ length: HEATMAP_WEEKS * HEATMAP_DAYS }, () => {
            // Randomly weight towards lower activity to look realistic
            const r = Math.random();
            if (r > 0.9) return 4;
            if (r > 0.7) return 3;
            if (r > 0.5) return 2;
            if (r > 0.3) return 1;
            return 0;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const data = generateData;

    return (
        <div className="p-8 lg:p-10 rounded-[40px] bg-background border border-border shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-2xl flex items-center justify-center text-aegis-blue border border-aegis-blue/20">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">On-Chain <span className="text-gradient-blue">Activity</span></h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Historical Engagement Pulse</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Last 5 Months
                </div>
            </div>

            <div className="flex gap-1.5 scrollbar-hide overflow-x-auto pb-4">
                {Array.from({ length: HEATMAP_WEEKS }).map((_, w) => (
                    <div key={w} className="flex flex-col gap-1.5 flex-shrink-0">
                        {Array.from({ length: HEATMAP_DAYS }).map((_, d) => {
                            const level = data[w * HEATMAP_DAYS + d];
                            return (
                                <motion.div
                                    key={d}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (w * 0.02) + (d * 0.01) }}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    className={cn(
                                        "w-3.5 h-3.5 rounded-[4px] transition-all cursor-help relative group/cell",
                                        LEVEL_COLOR[level] ?? DEFAULT_LEVEL_COLOR
                                    )}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-[8px] font-black rounded opacity-0 group-hover/cell:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                                        {level > 0 ? `${level * 4} Actions` : 'No Activity'}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Less</span>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map(l => (
                                <div key={l} className={cn("w-2.5 h-2.5 rounded-sm", LEVEL_COLOR[l] ?? DEFAULT_LEVEL_COLOR)} />
                            ))}
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">More</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase flex-shrink-0">
                    <Info className="w-3 h-3 text-aegis-blue" />
                    Updated 4m ago
                </div>
            </div>

            {/* Stats overlay */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/30">
                <div>
                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Actions</div>
                    <div className="text-xl font-black">248</div>
                </div>
                <div>
                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Consistency</div>
                    <div className="text-xl font-black text-emerald-500">84%</div>
                </div>
            </div>
        </div>
    );
}
