'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Vote, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VotingModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposalId: string;
    proposalTitle: string;
}

export function VotingModal({ isOpen, onClose, proposalId, proposalTitle }: VotingModalProps) {
    const [selectedOption, setSelectedOption] = useState<'for' | 'against' | 'abstain' | null>(null);
    const [isCasting, setIsCasting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCastVote = async () => {
        if (!selectedOption) return;
        setIsCasting(true);
        // Mock casting time
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsCasting(false);
        setIsSuccess(true);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl bg-background border border-border rounded-[48px] shadow-2xl p-10 lg:p-12 overflow-hidden mx-auto"
                >
                    {isSuccess ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-4">Vote <span className="text-gradient">Casted!</span></h3>
                            <p className="text-muted-foreground font-medium mb-12 max-w-sm mx-auto">
                                Your vote for {proposalId} has been successfully recorded on the Stacks blockchain.
                            </p>
                            <button type="button"
                                onClick={onClose}
                                className="w-full py-5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                            >
                                Return to Hub
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-aegis-purple mb-1">Casting Ballot</div>
                                    <h3 className="text-2xl font-black tracking-tighter">{proposalId}</h3>
                                </div>
                                <button type="button"
                                    onClick={onClose}
                                    className="p-3 hover:bg-muted rounded-2xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-10">
                                <p className="text-lg font-black tracking-tight mb-8 leading-tight">{proposalTitle}</p>

                                <div className="space-y-4">
                                    {[
                                        { id: 'for', label: 'Vote For', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                        { id: 'against', label: 'Vote Against', icon: X, color: 'text-red-500', bg: 'bg-red-500/10' },
                                        { id: 'abstain', label: 'Abstain', icon: Info, color: 'text-muted-foreground', bg: 'bg-muted/50' }
                                    ].map((option) => (
                                        <button type="button"
                                            key={option.id}
                                            onClick={() => setSelectedOption(option.id as any)}
                                            className={cn(
                                                "w-full p-6 rounded-3xl border transition-all flex items-center justify-between group",
                                                selectedOption === option.id
                                                    ? "border-aegis-purple bg-aegis-purple/5 shadow-lg shadow-aegis-purple/5"
                                                    : "border-border hover:border-border/80 hover:bg-muted/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("p-2 rounded-xl", option.bg, option.color)}>
                                                    <option.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-black text-sm uppercase tracking-widest">{option.label}</span>
                                            </div>
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                selectedOption === option.id ? "border-aegis-purple bg-aegis-purple" : "border-border"
                                            )}>
                                                {selectedOption === option.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-[32px] bg-muted/20 border border-border/30 mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Voting Power
                                    </div>
                                    <span className="text-sm font-black text-aegis-purple">24,500 vAGS</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5" />
                                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                                        Once cast, your vote cannot be changed. This transaction will be immutable on the Stacks blockchain.
                                    </p>
                                </div>
                            </div>

                            <button type="button"
                                disabled={!selectedOption || isCasting}
                                onClick={handleCastVote}
                                className={cn(
                                    "w-full py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all relative overflow-hidden active:scale-95 disabled:opacity-50 disabled:active:scale-100",
                                    "bg-foreground text-background"
                                )}
                            >
                                {isCasting ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        Casting Ballot...
                                    </div>
                                ) : 'Confirm Vote'}
                            </button>
                        </>
                    )}

                    {/* Background decor */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                        <Vote className="w-64 h-64 -rotate-12" />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
