'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Shield, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIER_DEFINITIONS = [
    {
        name: 'Bronze',
        min: '0',
        multiplier: '1.0x',
        icon: Star,
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        features: ['Base APR', 'Standard Support', 'No minimum lock']
    },
    {
        name: 'Silver',
        min: '10k',
        multiplier: '1.2x',
        icon: Shield,
        color: 'text-slate-300',
        bg: 'bg-slate-300/10',
        features: ['20% Bonus Yield', 'Priority Withdrawals', 'Community Access']
    },
    {
        name: 'Gold',
        min: '50k',
        multiplier: '1.5x',
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        features: ['50% Bonus Yield', 'Governance Voting', 'Exclusive NFT drops']
    },
    {
        name: 'Diamond',
        min: '250k',
        multiplier: '2.0x',
        icon: Crown,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        features: ['100% Bonus Yield', 'Direct Protocol Support', 'Institutional Tools']
    },
];

interface TierDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TierDrawer({ isOpen, onClose }: TierDrawerProps) {

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tier-drawer-title"
                        aria-describedby="tier-drawer-description"
                        className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-background border-l border-border shadow-2xl z-[120] overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 id="tier-drawer-title" className="text-3xl font-black tracking-tight">Tier <span className="text-gradient">Benefits</span></h2>
                                    <p id="tier-drawer-description" className="text-muted-foreground font-medium mt-1">Unlock superior yield by increasing your stake.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Close tier benefits drawer"
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="grid gap-6">
                                {TIER_DEFINITIONS.map((tier, i) => (
                                    <motion.div
                                        key={tier.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                        className="p-6 rounded-[32px] bg-muted/30 border border-border group hover:border-aegis-blue/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-3 rounded-2xl", tier.bg, tier.color)} aria-hidden="true">
                                                    <tier.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black">{tier.name}</h3>
                                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                                        Min Capture: {tier.min} STX
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-black text-gradient">
                                                {tier.multiplier}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {tier.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-2 text-sm font-medium">
                                                    <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-12 p-8 rounded-[40px] bg-aegis-blue/5 border border-aegis-blue/20">
                                <h4 className="text-lg font-black mb-2">How it works</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    Tiers are calculated based on your total active stake across all pools.
                                    Once you cross a threshold, your multiplier is applied instantly to all ongoing rewards.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
