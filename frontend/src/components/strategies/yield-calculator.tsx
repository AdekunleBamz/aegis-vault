'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, CalculatorIcon, ArrowRight, TrendingUp, DollarSign, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function YieldCalculator() {
    const [principal, setPrincipal] = useState(1000);
    const [duration, setDuration] = useState(365);
    const [selectedStrategy, setSelectedStrategy] = useState('Stable');

    const strategies = {
        Stable: { name: 'Stable Harvester', apy: 18.4, risk: 'Low' },
        Momentum: { name: 'AGS Momentum', apy: 32.1, risk: 'Medium' },
        Max: { name: 'Delta-Neutral', apy: 45.2, risk: 'High' }
    };

    const results = useMemo(() => {
        const strategy = strategies[selectedStrategy as keyof typeof strategies];
        const dailyRate = strategy.apy / 100 / 365;
        const totalReturn = principal * Math.pow(1 + dailyRate, duration);
        const profit = totalReturn - principal;
        return {
            total: totalReturn.toFixed(2),
            profit: profit.toFixed(2),
            percent: ((profit / principal) * 100).toFixed(1)
        };
    }, [principal, duration, selectedStrategy, strategies]);

    return (
        <div className="p-10 lg:p-12 rounded-[48px] bg-background border border-border shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aegis-blue via-aegis-purple to-aegis-blue opacity-50" />

            <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 bg-aegis-blue/10 rounded-2xl flex items-center justify-center text-aegis-blue border border-aegis-blue/20">
                    <Calculator className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="text-2xl font-black tracking-tight">Yield <span className="text-gradient-blue">Strategist</span></h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Project your algorithmic returns</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initial Principal</label>
                            <div className="text-sm font-black text-foreground">${principal.toLocaleString()}</div>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="100000"
                            step="100"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-aegis-blue"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staking Duration</label>
                            <div className="text-sm font-black text-foreground">{duration} Days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[30, 90, 180, 365].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={cn(
                                        "py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                                        duration === d
                                            ? "bg-aegis-blue text-white border-aegis-blue shadow-lg shadow-aegis-blue/20"
                                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {d}d
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">Select Strategy</label>
                        <div className="space-y-3">
                            {Object.entries(strategies).map(([id, s]) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedStrategy(id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group/opt",
                                        selectedStrategy === id
                                            ? "border-aegis-blue bg-aegis-blue/5"
                                            : "border-border hover:bg-muted/30"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            selectedStrategy === id ? "bg-aegis-blue animate-pulse" : "bg-muted"
                                        )} />
                                        <span className="text-xs font-black uppercase text-foreground">{s.name}</span>
                                    </div>
                                    <div className="text-xs font-bold text-muted-foreground">
                                        {s.apy}% APY
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex-1 p-8 rounded-[32px] bg-muted/20 border border-border/30 relative overflow-hidden flex flex-col justify-center text-center">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <TrendingUp className="w-32 h-32" />
                        </div>

                        <div className="mb-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Estimated Balance</div>
                            <div className="text-5xl font-black tracking-tighter text-foreground tabular-nums">
                                ${results.total}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-6 mt-6">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Net Profit</div>
                                <div className="text-xl font-black text-emerald-500 tracking-tight">${results.profit}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total ROI</div>
                                <div className="text-xl font-black text-aegis-blue tracking-tight">+{results.percent}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-start gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                        <Info className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-muted-foreground/80 leading-relaxed italic">
                            Projections are based on current protocol parameters and are not indicative of guaranteed performance. Algorithmic strategies carry inherent smart contract risks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
