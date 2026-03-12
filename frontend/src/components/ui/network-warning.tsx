'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useWallet } from '@/context/wallet-context';
import { useNetwork } from '@/hooks/use-network';

export function NetworkWarning() {
    const { isConnected, network: walletNetwork } = useWallet();
    const { networkType: appNetworkType } = useNetwork();

    if (!isConnected) return null;

    const walletIsTestnet = walletNetwork.chainId === 2147483648;
    const appIsTestnet = appNetworkType === 'testnet';

    const isMismatch = walletIsTestnet !== appIsTestnet;

    return (
        <AnimatePresence>
            {isMismatch && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4"
                >
                    <div className="bg-destructive/10 backdrop-blur-2xl border border-destructive/20 rounded-3xl p-5 shadow-2xl flex items-start gap-4">
                        <div className="p-3 bg-destructive/10 rounded-2xl flex-shrink-0">
                            <ShieldAlert className="w-6 h-6 text-destructive" />
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-black uppercase tracking-widest text-destructive mb-1">
                                Network Mismatch detected
                            </h4>
                            <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                                Your wallet is connected to <span className="text-destructive font-black underline decoration-2">{walletIsTestnet ? 'Testnet' : 'Mainnet'}</span>, but Aegis Vault is currently running on <span className="text-emerald-500 font-black underline decoration-2">{appIsTestnet ? 'Testnet' : 'Mainnet'}</span>.
                            </p>

                            <div className="mt-4 flex items-center gap-4">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Please switch network in your browser wallet
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
