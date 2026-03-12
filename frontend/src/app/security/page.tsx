'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SecurityScore } from '@/components/widgets/security-score';
import { AuditLogs } from '@/components/widgets/audit-logs';
import { InsuranceFund } from '@/components/widgets/insurance-fund';
import { ShieldCheck, Lock, Eye, Activity, FileCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function SecurityPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Header />

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aegis-blue/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <main className="flex-1 py-32 px-4 relative z-10">
                <div className="container max-w-7xl mx-auto">
                    <Breadcrumbs />
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                Transparency Hub
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Verified Safe
                            </div>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">
                            Security & <span className="text-gradient">Transparency</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                            Aegis Vault is built on a foundation of cryptographic safety and radical transparency.
                            Monitor our risk profile, audits, and insurance health in real-time.
                        </p>
                    </motion.div>

                    {/* Top Grid: Score & Pillars */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        <div className="lg:col-span-2">
                            <SecurityScore />
                        </div>
                        <div className="space-y-6">
                            {[
                                {
                                    title: 'Open Source',
                                    desc: 'All contract code is verified and public on Stacks Explorer.',
                                    icon: Eye,
                                    color: 'text-aegis-blue'
                                },
                                {
                                    title: 'Non-Custodial',
                                    desc: 'Aegis never takes custody of your keys or principal.',
                                    icon: Lock,
                                    color: 'text-aegis-purple'
                                },
                                {
                                    title: 'Real-time Proof',
                                    desc: 'Yields are generated on-chain with verifiable logic.',
                                    icon: Activity,
                                    color: 'text-emerald-500'
                                }
                            ].map((pillar, i) => (
                                <motion.div
                                    key={pillar.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="p-6 rounded-[32px] bg-background border border-border group hover:border-aegis-blue/30 transition-all flex items-start gap-4"
                                >
                                    <div className={cn("p-3 rounded-2xl bg-muted/30 group-hover:scale-110 transition-transform", pillar.color)}>
                                        <pillar.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight">{pillar.title}</h4>
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-1">{pillar.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Middle Grid: Logs & Insurance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <AuditLogs />
                        <InsuranceFund />
                    </div>

                    {/* Bottom Info: Trust Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[48px] bg-gradient-to-br from-background to-muted/20 border border-border relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <FileCheck className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 max-w-3xl">
                            <h3 className="text-2xl font-black mb-4">Our Commitment to <span className="text-gradient">Safety</span></h3>
                            <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                                DeFi is only as strong as its weakest link. At Aegis Vault, we employ a multi-layered security strategy including continuous smart contract monitoring, professional third-party audits, and a robust community insurance fund. Every transaction is transparently recorded on the Stacks blockchain, ensuring you remain in control of your assets at all times.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                                    Read Whitepaper
                                </button>
                                <button className="px-8 py-4 bg-muted/50 hover:bg-muted rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                                    Bug Bounty Program
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
