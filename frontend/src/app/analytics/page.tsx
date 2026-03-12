'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ActivityHeatmap } from '@/components/dashboard/activity-heatmap';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { PortfolioExport } from '@/components/dashboard/portfolio-export';
import { BarChart3, TrendingUp, Sparkles, ShieldCheck, Download, Zap, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Header />

            {/* Hero Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-aegis-blue/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />

            <main className="flex-1 py-32 px-4 relative z-10">
                <div className="container max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-3xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                    <BarChart3 className="w-3 h-3" />
                                    Advanced Insights v2.0
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-aegis-blue uppercase tracking-widest">
                                    <Zap className="w-3 h-3 fill-current" />
                                    Real-time Data
                                </div>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter mb-6 leading-none">
                                Portfolio <span className="text-gradient">Analytics</span>
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                                Deep-dive into your protocol performance. Track revenue growth, monitor on-chain engagement, and export comprehensive financial reports.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Main Revenue Chart - Spans 2 cols */}
                        <div className="lg:col-span-2">
                            <RevenueChart />
                        </div>

                        {/* Export Section */}
                        <div className="h-full">
                            <PortfolioExport />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        {/* Heatmap Section - Spans 2 cols */}
                        <div className="lg:col-span-2">
                            <ActivityHeatmap />
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="space-y-6">
                            <div className="p-8 rounded-[40px] bg-muted/20 border border-border/40 backdrop-blur-xl group hover:border-aegis-blue/30 transition-all">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Staking Purity</div>
                                <div className="flex items-end justify-between">
                                    <div className="text-4xl font-black tabular-nums">98.4%</div>
                                    <div className="text-emerald-500 text-xs font-black flex items-center gap-1 mb-1">
                                        <TrendingUp className="w-3 h-3" />
                                        +0.2%
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full mt-6 overflow-hidden">
                                    <div className="w-[98.4%] h-full bg-aegis-blue" />
                                </div>
                            </div>

                            <div className="p-8 rounded-[40px] bg-muted/20 border border-border/40 backdrop-blur-xl group hover:border-aegis-purple/30 transition-all">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Governance IQ</div>
                                <div className="flex items-end justify-between">
                                    <div className="text-4xl font-black tabular-nums">142</div>
                                    <div className="px-2 py-0.5 bg-aegis-purple/10 border border-aegis-purple/20 rounded-md text-[9px] font-black text-aegis-purple uppercase mb-1">Expert</div>
                                </div>
                                <div className="flex gap-1 mt-6">
                                    {[1, 1, 1, 1, 0.5, 0].map((v, i) => (
                                        <div key={i} className="flex-1 h-3 rounded-sm bg-muted overflow-hidden">
                                            <div className="h-full bg-aegis-purple transition-all" style={{ width: `${v * 100}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Educational Trust Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="p-16 rounded-[48px] border border-emerald-500/20 bg-emerald-500/5 flex flex-col lg:flex-row items-center justify-between gap-12 group overflow-hidden relative"
                    >
                        <div className="absolute bottom-0 right-0 p-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="w-48 h-48" />
                        </div>

                        <div className="max-w-2xl text-center lg:text-left">
                            <h3 className="text-3xl font-black tracking-tighter mb-4 italic">Immutable <span className="text-emerald-500">Integrity</span></h3>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-8">
                                All analytics data is fetched directly from the Stacks blockchain and processed locally. We never store your financial profile on external servers.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                {['Audited Logic', 'Zero Tracking', 'Real-time Feed'].map(tag => (
                                    <div key={tag} className="px-4 py-2 bg-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-full text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform group/btn">
                            Download Audit Info
                            <MousePointer2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
