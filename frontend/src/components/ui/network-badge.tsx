'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/context/wallet-context';

/**
 * Displays the current Stacks network (Mainnet/Testnet) with a status indicator.
 * Uses the wallet context to detect the active chainId.
 */
export function NetworkBadge() {
    const { network, isConnected } = useWallet();

    // Use chainId for network detection (testnet chainId is 2147483648)
    const isMainnet = network.chainId !== 2147483648;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={`Current Network: ${isMainnet ? "Mainnet" : "Testnet"}${!isMainnet ? " - Trial Mode" : ""}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 backdrop-blur-md"
        >
            <div className="relative flex items-center justify-center">
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    isMainnet ? "bg-emerald-500" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                )} />
                {!isMainnet && (
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500"
                    />
                )}
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                {isMainnet ? 'Mainnet' : 'Testnet'}
            </span>

            <AnimatePresence>
                {!isMainnet && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden flex items-center gap-1.5 ml-1 border-l border-border/50 pl-2"
                    >
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span className="text-[9px] font-bold text-amber-500/80 whitespace-nowrap">Trial Mode</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
