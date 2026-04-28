'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtocolCard } from '@/components/ecosystem/protocol-card';
import { Globe, Search, Filter, Rocket, Sparkles, ArrowRight, Activity, Share2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function EcosystemPage() {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const protocols = [
        {
            name: 'ALEX Lab',
            description: 'The premier DeFi platform on Stacks, bringing full Bitcoin DeFi capabilities to the ecosystem.',
            category: 'DEX / DeFi',
            logo: 'https://app.alexlab.co/favicon.png',
            url: 'https://alexlab.co',
            integrationStatus: 'Partner' as const,
            isLive: true
        },
        {
            name: 'Arkadiko',
            description: 'Collateralized debt positions and stablecoin (USDA) protocol built on top of the Stacks blockchain.',
            category: 'Lending / Stability',
            logo: 'https://arkadiko.finance/favicon.png',
            url: 'https://arkadiko.finance',
            integrationStatus: 'Partner' as const,
            isLive: true
        },
        {
            name: 'Stacking DAO',
            description: 'Liquid stacking protocol for STX, allowing users to earn Bitcoin rewards while staying liquid.',
            category: 'Liquid Staking',
            logo: 'https://stackingdao.com/favicon.png',
            url: 'https://stackingdao.com',
            integrationStatus: 'Native' as const,
            isLive: true
        },
        {
            name: 'Gamma.io',
            description: 'The leading NFT marketplace on Stacks, empowering creators and collectors on the Bitcoin network.',
            category: 'NFTs / Assets',
            logo: 'https://gamma.io/favicon.png',
            url: 'https://gamma.io',
            integrationStatus: 'External' as const,
            isLive: true
        },
        {
            name: 'Bitflow',
            description: 'Decentralized exchange optimized for stable swaps and Bitcoin liquidity bridges.',
            category: 'DEX / Stablecoins',
            logo: 'https://bitflow.finance/favicon.png',
            url: 'https://bitflow.finance',
            integrationStatus: 'Partner' as const,
            isLive: true
        }
    ];

    const categories = ['All', 'DEX / DeFi', 'Lending / Stability', 'Liquid Staking', 'NFTs / Assets'];

    const filtered = protocols.filter(p =>
        (categoryFilter === 'All' || p.category === categoryFilter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
         p.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="relative overflow-hidden">

            {/* Hero Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-aegis-blue/5 to-transparent pointer-events-none" />
            <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-aegis-purple/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="px-4 py-12 relative z-10">
                <div className="container max-w-7xl mx-auto">
                    <Breadcrumbs />
                    {/* Header Section */}
                    <div className="max-w-4xl mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="px-3 py-1 bg-foreground/5 border border-border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-3 h-3" />
                                Stacks Protocol Network
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                <Activity className="w-3 h-3" />
                                Interconnected
                            </div>
                        </motion.div>
                        <h1 className="text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                            The Aegis <span className="text-gradient-blue text-glow">Ecosystem</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                            A curated directory of the most trusted protocols in the Stacks ecosystem. Discover, integrate, and maximize your Bitcoin DeFi experience.
                        </p>
                    </div>

                    {/* Featured Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
                        {[
                            { label: 'Active Integrations', value: '12+', icon: Rocket },
                            { label: 'Network TVL', value: '$840M', icon: Activity },
                            { label: 'Cross-Protocol APY', value: '28.4%', icon: Sparkles },
                            { label: 'Community Partners', value: '45', icon: Share2 }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-[32px] bg-muted/20 border border-border/40 backdrop-blur-xl group hover:border-aegis-blue/30 transition-all"
                            >
                                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border/50 mb-4 group-hover:text-aegis-blue transition-colors">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</div>
                                <div className="text-2xl font-black">{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Discovery Controls */}
                    <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
                        <h2 className="text-4xl font-black tracking-tighter">Discover <span className="text-gradient-blue">Network</span></h2>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            <div className="relative w-full sm:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-aegis-blue transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search protocols..."
                                    className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-aegis-blue/20 transition-all font-bold"
                                />
                            </div>
                            <div className="flex overflow-x-auto bg-muted/30 border border-border rounded-2xl p-1 no-scrollbar w-full sm:w-auto">
                                {categories.map((c) => (
                                    <button type="button"
                                        key={c}
                                        onClick={() => setCategoryFilter(c)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                            categoryFilter === c ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {c.split(' / ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                        {filtered.map((protocol, i) => (
                            <ProtocolCard
                                key={i}
                                {...protocol}
                            />
                        ))}

                        {/* Submit Integration Suggestion */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 rounded-[40px] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-aegis-blue transition-all"
                        >
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6 group-hover:bg-aegis-blue/10 group-hover:text-aegis-blue transition-all">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black mb-2">Propose Integration</h3>
                            <p className="text-xs text-muted-foreground font-medium mb-6">Want to see your protocol here?</p>
                            <button type="button" className="px-6 py-2.5 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">
                                Submit Protocol
                            </button>
                        </motion.div>
                    </div>

                    {/* Network Connection Section */}
                    <div className="p-16 rounded-[48px] bg-foreground text-background overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                            <Globe className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-5xl font-black tracking-tighter mb-6 leading-none italic">Verified <span className="text-aegis-blue">Connections</span></h2>
                            <p className="text-lg font-medium opacity-60 mb-10 leading-relaxed">
                                Every protocol in the Aegis Ecosystem undergoes a rigorous security review and technical validation process to ensure the highest standards of safety for our users.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <button type="button" className="w-full sm:w-auto px-8 py-4 bg-aegis-blue text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(40,140,250,0.4)] transition-all flex items-center justify-center gap-3">
                                    Read Integration Standards
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-6 opacity-40">
                                    <div className="text-[10px] font-black uppercase tracking-widest">Audit Partners:</div>
                                    <div className="font-black italic text-xl">L2 BEAT</div>
                                    <div className="font-black italic text-xl">CERTIK</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
