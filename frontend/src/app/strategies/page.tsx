'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StrategyCard, RiskLevel } from '@/components/strategies/strategy-card';
import { AutoCompoundWidget } from '@/components/strategies/autocompound-widget';
import { YieldCalculator } from '@/components/strategies/yield-calculator';
import { AutomationDashboard } from '@/components/strategies/automation-dashboard';
import { Cpu, Search, Filter, Rocket, Sparkles, ArrowRight, Activity, Shield, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function StrategiesPage() {
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');

    const strategies = [
        {
            title: 'Stable Stacks Harvester',
            description: 'Low-risk algorithmic strategy focusing on maximizing base STX yield through optimized lock periods and automatic re-staking.',
            apy: '18.4',
            risk: 'Low' as RiskLevel,
            tvl: '$2.4M',
            tags: ['STX', 'Auto-restake', 'Low Volatility'],
            isPopular: true
        },
        {
            title: 'AGS Momentum Vault',
            description: 'Leveraging Aegis governance tokens to capture protocol fees and growth multipliers. Actively balanced based on TVL trends.',
            apy: '32.1',
            risk: 'Medium' as RiskLevel,
            tvl: '$1.8M',
            tags: ['AGS', 'Fee-sharing', 'Growth'],
        },
        {
            title: 'Delta-Neutral Yield',
            description: 'Sophisticated strategy utilizing hedge positions to mitigate STX price volatility while capturing high staking rewards.',
            apy: '45.2',
            risk: 'High' as RiskLevel,
            tvl: '$850k',
            tags: ['Algorithmic', 'Hedged', 'Max Yield'],
        }
    ];

    const filteredStrategies = strategies.filter(s =>
        (riskFilter === 'All' || s.risk === riskFilter) &&
        (s.title.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="relative overflow-hidden">

            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aegis-blue/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aegis-purple/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="px-4 py-12 relative z-10">
                <div className="container max-w-7xl mx-auto">
                    <Breadcrumbs />
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-3xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-aegis-blue/10 border border-aegis-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest text-aegis-blue flex items-center gap-2">
                                    <Cpu className="w-3 h-3" />
                                    Vault Automation v2.0
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                    <Sparkles className="w-3 h-3 fill-current" />
                                    Optimized
                                </div>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter mb-6 leading-none">
                                Algorithmic <span className="text-gradient-blue text-glow">Strategies</span>
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                                Maximize your Stacks yield with one-click automated vaults. Our algorithmic strategies handle compounding, rebalancing, and risk management for you.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:w-96"
                        >
                            <AutoCompoundWidget />
                        </motion.div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 p-8 rounded-[40px] bg-muted/20 border border-border/30 backdrop-blur-xl">
                        {[
                            { label: 'Active Stratgies', value: '12', icon: Activity, color: 'text-aegis-blue' },
                            { label: 'Total Value Automated', value: '$8.4M', icon: Rocket, color: 'text-aegis-purple' },
                            { label: 'Avg Strategy APR', value: '24.2%', icon: TrendingUp, color: 'text-emerald-500' }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={cn("p-4 rounded-2xl bg-background border border-border/40 shadow-sm", stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</div>
                                    <div className="text-2xl font-black tabular-nums">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                        <YieldCalculator />
                        <AutomationDashboard />
                    </div>

                    {/* Selection Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-8">
                        <h2 className="text-3xl font-black tracking-tighter">Choose your <span className="text-gradient-blue">Yield Path</span></h2>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-72 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-aegis-blue transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Find strategy..."
                                    className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-aegis-blue/20 transition-all font-bold"
                                />
                            </div>
                            <div className="flex bg-muted/30 border border-border rounded-2xl p-1">
                                {['All', 'Low', 'Medium', 'High'].map((r) => (
                                    <button type="button"
                                        key={r}
                                        onClick={() => setRiskFilter(r as any)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            riskFilter === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Strategies Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {filteredStrategies.map((strategy, i) => (
                            <StrategyCard
                                key={i}
                                {...strategy}
                            />
                        ))}
                    </div>

                    {/* Educational Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-32 p-12 rounded-[48px] border border-aegis-blue/20 bg-aegis-blue/5 flex flex-col items-center text-center group overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aegis-blue to-transparent opacity-30" />
                        <div className="w-16 h-16 bg-aegis-blue/10 rounded-2xl flex items-center justify-center text-aegis-blue mb-8">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-4">Non-Custodial <span className="text-aegis-blue">Automation</span></h3>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl mb-8 leading-relaxed">
                            Your assets never leave your vault control. Automation strategies interact with your vault via verified, open-source smart contracts. You can withdraw or deactivate any strategy at any time.
                        </p>
                        <button type="button" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-aegis-blue hover:translate-x-1 transition-transform cursor-pointer">
                            Read strategy documentation
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
