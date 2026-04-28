'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmergencyBanner() {
    const [isVisible, setIsVisible] = React.useState(true);

    // Real-world scenario: This would be fetched from a security API or governance contract
    const alert = {
        severity: 'info', // 'warning' | 'emergency' | 'info'
        message: 'Protocol upgrade scheduled for block 142,500. Staking operations will be paused for approximately 2 hours.',
        cta: 'Learn more',
        link: '/governance/upgrade-142500'
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                    "relative z-[60] py-3 px-4 flex items-center justify-center gap-4 border-b transition-all",
                    alert.severity === 'emergency' && "bg-red-500 text-white border-red-600",
                    alert.severity === 'warning' && "bg-yellow-500 text-black border-yellow-600",
                    alert.severity === 'info' && "bg-aegis-blue text-white border-aegis-blue/20"
                )}
            >
                <div className="container max-w-7xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-lg animate-pulse">
                            {alert.severity === 'emergency' ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <p className="text-xs font-black uppercase tracking-wider leading-none">
                            <span className="opacity-80 font-bold mr-2">{alert.severity === 'emergency' ? 'CRITICAL:' : 'NOTICE:'}</span>
                            {alert.message}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href={alert.link}
                            className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all group"
                        >
                            {alert.cta}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                        <button type="button"
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
