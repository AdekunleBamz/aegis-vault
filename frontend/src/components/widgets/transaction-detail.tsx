'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Hash, Clock, Shield, Database, Cpu, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, truncateAddress } from '@/lib/format';

interface TransactionDetailProps {
    transaction: any;
    onClose: () => void;
    actionConfig: any;
}

export function TransactionDetail({ transaction, onClose, actionConfig }: TransactionDetailProps) {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl shadow-blue-500/10"
            >
                {/* Modal Header */}
                <div className={`p-6 ${actionConfig.bgColor} border-b border-white/10 flex justify-between items-start`}>
                    <div className="flex gap-4">
                        <div className={`w-14 h-14 ${actionConfig.bgColor} bg-white/10 rounded-2xl flex items-center justify-center border border-white/10`}>
                            <span className={actionConfig.color}>{actionConfig.icon}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{actionConfig.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={transaction.tx_status === 'success' ? 'success' : 'warning'}>
                                    {transaction.tx_status}
                                </Badge>
                                <span className="text-xs text-white/60 font-medium">
                                    {formatRelativeTime(transaction.burn_block_time)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white/50" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <Hash className="w-3.5 h-3.5" />
                                Transaction ID
                            </div>
                            <p className="font-mono text-sm text-blue-400 break-all">{transaction.tx_id}</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <Database className="w-3.5 h-3.5" />
                                Block Height
                            </div>
                            <p className="text-xl font-bold text-white">#{transaction.block_height?.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Function Details */}
                    <div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            Contract Execution
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-gray-400 text-sm">Contract Path</span>
                                <span className="text-white font-mono text-xs">{truncateAddress(transaction.contract_call?.contract_id)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-gray-400 text-sm">Method Name</span>
                                <span className="text-blue-400 font-bold">{transaction.contract_call?.function_name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Arguments */}
                    {transaction.contract_call?.function_args && transaction.contract_call.function_args.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Input Arguments
                            </h3>
                            <div className="bg-black/40 rounded-2xl p-4 space-y-4 border border-white/5">
                                {transaction.contract_call.function_args.map((arg: any, i: number) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">{arg.name}</p>
                                        <p className="text-xs font-mono text-white/80 break-all bg-white/5 p-2 rounded-lg">{arg.repr}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Network Fees */}
                    <div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Coins className="w-4 h-4" />
                            Network Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="py-2 border-b border-white/5">
                                <span className="text-gray-400 text-xs block mb-1">Fee (STX)</span>
                                <span className="text-white font-bold">{parseInt(transaction.fee_rate) / 1000000} STX</span>
                            </div>
                            <div className="py-2 border-b border-white/5">
                                <span className="text-gray-400 text-xs block mb-1">Nonce</span>
                                <span className="text-white font-bold">{transaction.nonce}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-white/[0.02] border-t border-white/10 flex gap-3">
                    <a
                        href={`https://explorer.stacks.co/txid/${transaction.tx_id}?chain=mainnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                    </a>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
