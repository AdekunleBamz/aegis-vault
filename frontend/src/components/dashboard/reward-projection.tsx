'use client';

import React, { useState, useMemo } from 'react';
import { TIERS } from '@/lib/constants';
import { determineTier, calculateAPY } from '@/lib/staking';
import { motion } from 'framer-motion';
import {
    Zap,
    TrendingUp,
    Coins,
    Target,
    ArrowRight,
    Calculator,
    ShieldCheck,
    Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RewardProjection() {
    const [projectedAmount, setProjectedAmount] = useState(1000);

    const microAmount = BigInt(projectedAmount) * 1000000n;
    const tierIndex = determineTier(microAmount);
    const tier = TIERS[tierIndex];
    const apy = calculateAPY(microAmount, tierIndex);

    const yearlyAGS = projectedAmount * (apy / 100);
    const monthlyAGS = yearlyAGS / 12;
    const weeklyAGS = yearlyAGS / 52;

    const nextTier = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null;
    const nextTierMin = nextTier ? nextTier.minStake : 0;
    const nextTierApy = nextTier ? calculateAPY(BigInt(nextTier.minStake) * 1000000n, tierIndex + 1) : 0;

    return (
        <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-3xl p-8 md:p-10 relative overflow-hidden group">
            {/* Visual background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-aegis-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-aegis-blue">
                            <Calculator className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Yield Calculator</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Projected Earnings</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Scenario Tool
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Amount Slider */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Estimated Stake</span>
                            <span className="text-2xl font-black tabular-nums">{projectedAmount.toLocaleString()} <span className="text-xs text-muted-foreground/40 font-bold uppercase">STX</span></span>
                        </div>
                        <div className="relative pt-4 pb-2">
                            <input
                                type="range"
                                min="100"
                                max="50000"
                                step="100"
                                value={projectedAmount}
                                onChange={(e) => setProjectedAmount(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-aegis-blue"
                                aria-label="Estimated stake amount in STX"
                            />
                            <div className="flex justify-between mt-4 px-1" aria-hidden="true">
                                <span className="text-[10px] font-black text-muted-foreground/20">100 STX</span>
                                <span className="text-[10px] font-black text-muted-foreground/20">50K STX</span>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-live="polite">
                        <div className="p-6 rounded-[32px] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group/stat">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Annual Yield</div>
                            <div className="text-3xl font-black text-emerald-500 tabular-nums" aria-label={`${yearlyAGS.toLocaleString(undefined, { maximumFractionDigits: 1 })} AGS tokens per year`}>{yearlyAGS.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                            <div className="text-[10px] font-bold text-muted-foreground/40 uppercase mt-1">Total AGS Tokens</div>
                        </div>

                        <div className="p-6 rounded-[32px] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group/stat">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Monthly</div>
                            <div className="text-3xl font-black tabular-nums">{monthlyAGS.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                            <div className="text-[10px] font-bold text-muted-foreground/40 uppercase mt-1">AGS Returns</div>
                        </div>

                        <div className="p-6 rounded-[32px] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group/stat">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Rate (APY)</div>
                            <div className="text-3xl font-black text-aegis-blue tabular-nums" aria-label={`${apy.toFixed(1)} percent APY`}>{apy.toFixed(1)}%</div>
                            <div className="text-[10px] font-bold text-muted-foreground/40 uppercase mt-1">Active Tier: {tier.name}</div>
                        </div>
                    </div>

                    {/* Tier Upgrade Banner */}
                    {nextTier && (
                        <motion.div
                            layout
                            className="p-8 rounded-[40px] bg-gradient-to-br from-aegis-blue/10 to-aegis-purple/10 border border-aegis-blue/20 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-background/50 rounded-2xl flex items-center justify-center text-aegis-purple shadow-xl">
                                        <Star className="w-7 h-7 fill-aegis-purple/20" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black tracking-tight mb-1">Unlock {nextTier.name} Boost</h4>
                                        <p className="text-xs text-muted-foreground font-medium">Earn up to <span className="text-foreground font-black">{nextTierApy}% APY</span> by increasing your stake.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Required</div>
                                        <div className="text-sm font-black text-foreground">{(nextTierMin - projectedAmount).toLocaleString()} STX More</div>
                                    </div>
                                    <div className="p-3 bg-foreground text-background rounded-full transition-transform hover:scale-110">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-aegis-purple/10 rounded-full blur-3xl opacity-50" />
                        </motion.div>
                    )}

                    {/* Protocol Note */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Dynamic Rate
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                            <Zap className="w-3.5 h-3.5" />
                            Real-time Accrual
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
