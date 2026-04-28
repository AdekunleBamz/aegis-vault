'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, User, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProposalStatus = 'Active' | 'Passed' | 'Rejected' | 'Pending';

interface ProposalCardProps {
    id: string;
    title: string;
    description: string;
    status: ProposalStatus;
    votesFor: number;
    votesAgainst: number;
    proposer: string;
    endDate: string;
    onVote?: () => void;
}

export function ProposalCard({
    id,
    title,
    description,
    status,
    votesFor,
    votesAgainst,
    proposer,
    endDate,
    onVote
}: ProposalCardProps) {
    const totalVotes = votesFor + votesAgainst;
    const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[40px] bg-background border border-border hover:border-aegis-blue/30 transition-all group relative overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                        status === 'Active' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        status === 'Passed' && "bg-aegis-blue/10 text-aegis-blue border-aegis-blue/20",
                        status === 'Rejected' && "bg-red-500/10 text-red-500 border-red-600/20",
                        status === 'Pending' && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                    )}>
                        {status === 'Active' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                        {status === 'Passed' && <CheckCircle2 className="w-3 h-3" />}
                        {status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {status === 'Pending' && <Clock className="w-3 h-3" />}
                        {status}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{id}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        {proposer.slice(0, 6)}...{proposer.slice(-4)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {endDate}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h4 className="text-2xl font-black tracking-tight mb-2 group-hover:text-gradient transition-all cursor-pointer">{title}</h4>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">{description}</p>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">For</span>
                            <span className="text-xs font-bold text-muted-foreground">{votesFor.toLocaleString()} vAGS</span>
                        </div>
                        <span className="text-xs font-black tabular-nums">{forPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                        <div
                            style={{ width: `${forPercentage}%` }}
                            className="h-full bg-emerald-500 transition-all duration-1000"
                            role="progressbar"
                            aria-label={`${id} votes in favor`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Number(forPercentage.toFixed(1))}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-red-500">Against</span>
                            <span className="text-xs font-bold text-muted-foreground">{votesAgainst.toLocaleString()} vAGS</span>
                        </div>
                        <span className="text-xs font-black tabular-nums">{againstPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                        <div
                            style={{ width: `${againstPercentage}%` }}
                            className="h-full bg-red-500 transition-all duration-1000"
                            role="progressbar"
                            aria-label={`${id} votes against`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Number(againstPercentage.toFixed(1))}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                <button type="button"
                    onClick={onVote}
                    disabled={status !== 'Active'}
                    aria-label={status === 'Active' ? `Cast vote for proposal ${id}` : `Voting closed for proposal ${id}`}
                    className={cn(
                        "px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100",
                        status === 'Active' ? "bg-foreground text-background hover:shadow-lg" : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    {status === 'Active' ? 'Cast Vote' : 'Voting Ended'}
                </button>
                <button type="button" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all group/view" aria-label={`View details for proposal ${id}`}>
                    View Detail
                    <ChevronRight className="w-4 h-4 group-hover/view:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Decorative background icon */}
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <FileText className="w-48 h-48 rotate-12" />
            </div>
        </motion.div>
    );
}
