'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, Lock, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityMetricProps {
    icon: React.ElementType;
    label: string;
    value: string;
    subValue?: string;
    status: 'optimal' | 'warning' | 'critical';
    index: number;
}

const SecurityMetric = ({ icon: Icon, label, value, subValue, status, index }: SecurityMetricProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
        }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-blue-500/30 group cursor-pointer"
    >
        <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                <Icon className={cn(
                    "w-5 h-5",
                    status === 'optimal' ? "text-green-400" : status === 'warning' ? "text-orange-400" : "text-red-400"
                )} />
            </div>
            <div className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                status === 'optimal' ? "bg-green-500/10 text-green-400" : status === 'warning' ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"
            )}>
                {status}
            </div>
        </div>
        <div className="text-gray-400 text-xs mb-1">{label}</div>
        <div className="text-xl font-bold text-white mb-0.5">{value}</div>
        {subValue && <div className="text-gray-500 text-[10px]">{subValue}</div>}
    </motion.div>
);

export function SecurityDashboard() {
    const healthScore = 98;

    const metrics = [
        {
            icon: Lock,
            label: 'Locked Liquidity',
            value: '94.2%',
            subValue: 'Locked for 180+ days',
            status: 'optimal' as const
        },
        {
            icon: Zap,
            label: 'Gas Optimization',
            value: 'Level A',
            subValue: 'Batching enabled',
            status: 'optimal' as const
        },
        {
            icon: Clock,
            label: 'Contract Uptime',
            value: '99.99%',
            subValue: 'Last audit: 12 days ago',
            status: 'optimal' as const
        },
        {
            icon: ShieldAlert,
            label: 'Emergency Halt',
            value: 'Ready',
            subValue: 'Manual override active',
            status: 'warning' as const
        }
    ];

    return (
        <div className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/10 rounded-2xl p-6 mb-8 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-gray-800"
                            />
                            <motion.circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={226}
                                initial={{ strokeDashoffset: 226 }}
                                animate={{ strokeDashoffset: 226 - (226 * healthScore) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-blue-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-white">{healthScore}</span>
                            <span className="text-[8px] text-gray-400 uppercase tracking-tighter">Health</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">Vault Security Health</h2>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your assets are protected by multi-layer hardware security and audited smart contracts.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        View Audit Report
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <Shield className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {metrics.map((metric, i) => (
                    <SecurityMetric key={metric.label} {...metric} index={i} />
                ))}
            </div>
        </div>
    );
}
