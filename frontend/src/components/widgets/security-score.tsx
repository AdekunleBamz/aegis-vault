'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const SECURITY_SCORE = 94; // Out of 100

const RISK_FACTORS = [
    { label: 'Smart Contract Audit', status: 'secure', value: 'Verified' },
    { label: 'Liquidity Depth', status: 'secure', value: 'High' },
    { label: 'Centralization Risk', status: 'warning', value: 'Low' },
    { label: 'Market Volatility', status: 'warning', value: 'Moderate' },
];

export function SecurityScore() {

    return (
        <div className="p-8 rounded-[40px] bg-background border border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                {/* Radial Score */}
                <div className="relative w-48 h-48 flex items-center justify-center" aria-label={`Protocol safety score: ${SECURITY_SCORE} out of 100`}>
                    <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-muted/20"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={502.6}
                            initial={{ strokeDashoffset: 502.6 }}
                            animate={{ strokeDashoffset: 502.6 * (1 - SECURITY_SCORE / 100) }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="text-emerald-500"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-5xl font-black tracking-tight"
                        >
                            {SECURITY_SCORE}
                        </motion.span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Safety Score</span>
                    </div>
                </div>

                {/* Risk Grid */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {RISK_FACTORS.map((factor, i) => (
                        <motion.div
                            key={factor.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            aria-label={`Risk factor ${factor.label}: ${factor.value}`}
                            className="p-4 rounded-3xl bg-muted/20 border border-border/30 flex items-center justify-between group/factor hover:bg-muted/40 transition-all"
                        >
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">{factor.label}</div>
                                <div className="text-sm font-black">{factor.value}</div>
                            </div>
                            <div className={cn(
                                "p-2 rounded-xl",
                                factor.status === 'secure' ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                            )}>
                                {factor.status === 'secure' ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <AlertTriangle className="w-4 h-4" aria-hidden="true" />}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-aegis-blue" />
                    <span className="text-sm font-bold">Audited by <span className="text-aegis-blue">Halborn</span> & <span className="text-aegis-blue">Kudelski</span></span>
                </div>
                <button
                    aria-label="View detailed security audit report"
                    className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-full text-xs font-black uppercase tracking-widest transition-all"
                >
                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                    Detail Report
                </button>
            </div>
        </div>
    );
}
