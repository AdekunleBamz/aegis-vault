'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Sparkles, TrendingUp, Info, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AutoCompoundWidget() {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <div className="p-8 rounded-[40px] bg-background border border-border shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-aegis-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-aegis-blue/10 rounded-2xl flex items-center justify-center text-aegis-blue">
                        <RotateCw className={cn("w-6 h-6", isEnabled && "animate-spin-slow")} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Auto <span className="text-gradient-blue">Compound</span></h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Algorithmic Reinvestment</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={cn(
                        "w-14 h-8 rounded-full transition-all relative",
                        isEnabled ? "bg-aegis-blue" : "bg-muted"
                    )}
                >
                    <motion.div
                        animate={{ x: isEnabled ? 24 : 4 }}
                        className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-sm"
                    />
                </button>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/10 border border-border/20">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Frequency</div>
                        <div className="text-lg font-black uppercase">Daily</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/10 border border-border/20">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Fee Saved</div>
                        <div className="text-lg font-black text-emerald-500">92%</div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-muted/20 border border-border/30 relative overflow-hidden group/chart">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Efficiency Gains</div>
                        <Activity className="w-4 h-4 text-aegis-blue" />
                    </div>
                    <div className="flex items-end gap-2 h-16">
                        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className={cn(
                                    "flex-1 rounded-t-lg transition-colors",
                                    isEnabled ? "bg-aegis-blue/40" : "bg-muted/40"
                                )}
                            />
                        ))}
                    </div>
                    {isEnabled && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-aegis-blue/5 backdrop-blur-[1px] flex items-center justify-center"
                        >
                            <div className="flex items-center gap-2 text-[10px] font-black text-aegis-blue uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                Maximizing Yield
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/30">
                <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-aegis-blue mt-0.5 shrink-0" />
                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                        Auto-compounding automatically harvests your rewards and adds them back to your principal every 24 hours, utilizing batch transactions to minimize Stacks gas fees.
                    </p>
                </div>
            </div>
        </div>
    );
}
