'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VotingPower } from '@/components/governance/voting-power';
import { GovernanceStats } from '@/components/governance/governance-stats';
import { ProposalCard, ProposalStatus } from '@/components/governance/proposal-card';
import { VotingModal } from '@/components/governance/voting-modal';
import { Vote, FilePlus2, Search, Filter, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function GovernancePage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<ProposalStatus | 'All'>('All');
    const [selectedProposal, setSelectedProposal] = useState<{ id: string, title: string } | null>(null);

    const proposals = [
        {
            id: 'AGIP-005',
            title: 'Adjust Reward Multipliers for Jade Tier',
            description: 'Proposal to increase the Jade tier multiplier from 1.5x to 1.8x to incentivize mid-tier staking and better align with protocol growth targets.',
            status: 'Active' as ProposalStatus,
            votesFor: 840500,
            votesAgainst: 125000,
            proposer: 'ST123...4567',
            endDate: '2d 14h left'
        },
        {
            id: 'AGIP-004',
            title: 'Integrate STX/BTC Liquidity Monitoring',
            description: 'Implement real-time monitoring of STX/BTC liquidity depth to enhance protocol risk scoring and insurance fund adjustments.',
            status: 'Passed' as ProposalStatus,
            votesFor: 2450000,
            votesAgainst: 50000,
            proposer: 'ST888...9999',
            endDate: 'Ended 3 days ago'
        },
        {
            id: 'AGIP-003',
            title: 'Implement Multi-step Unstaking Period',
            description: 'Proposed change to the unstaking logic to introduce a 2-step cooldown period to prevent flash-exit volatility during market stress.',
            status: 'Rejected' as ProposalStatus,
            votesFor: 450000,
            votesAgainst: 1850000,
            proposer: 'ST555...2222',
            endDate: 'Ended 1 week ago'
        }
    ];

    const filteredProposals = proposals.filter(p =>
        (filter === 'All' || p.status === filter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
         p.id.toLowerCase().includes(search.toLowerCase()) ||
         p.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-aegis-purple/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-aegis-blue/5 rounded-full blur-[140px] translate-x-1/2 pointer-events-none" />

            <div className="px-4 py-12 relative z-10">
                <div className="container max-w-7xl mx-auto">
                    <Breadcrumbs />
                    {/* Page Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-aegis-purple/10 border border-aegis-purple/20 rounded-full text-[10px] font-black uppercase tracking-widest text-aegis-purple flex items-center gap-2">
                                    <Vote className="w-3 h-3" />
                                    Decentralized Protocol
                                </div>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter mb-4">
                                Governance <span className="text-gradient">Hub</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                                Shape the future of Aegis Vault. Vote on protocol upgrades, adjust economic parameters, and participate in community-led decision making.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <button className="px-8 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group">
                                <FilePlus2 className="w-4 h-4" />
                                Create Proposal
                                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        <div className="lg:col-span-2">
                            <GovernanceStats />
                        </div>
                        <div>
                            <VotingPower />
                        </div>
                    </div>

                    {/* Proposals Section */}
                    <section>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
                            <h2 className="text-3xl font-black tracking-tighter">Active <span className="text-gradient">Proposals</span></h2>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-aegis-purple transition-colors" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search AGIPs..."
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-aegis-purple/20 transition-all font-bold"
                                    />
                                </div>
                                <div className="flex bg-muted/30 border border-border rounded-2xl p-1">
                                    {['All', 'Active', 'Passed'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setFilter(t as any)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                filter === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredProposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal.id}
                                    {...proposal}
                                    onVote={() => setSelectedProposal({ id: proposal.id, title: proposal.title })}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <VotingModal
                isOpen={!!selectedProposal}
                onClose={() => setSelectedProposal(null)}
                proposalId={selectedProposal?.id || ''}
                proposalTitle={selectedProposal?.title || ''}
            />
        </div>
    );
}
