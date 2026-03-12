'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, FileCode, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PortfolioExport() {
    const [status, setStatus] = useState<'idle' | 'generating' | 'success'>('idle');
    const [format, setFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');

    const handleExport = () => {
        setStatus('generating');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        }, 2000);
    };

    const formats = [
        { id: 'PDF', label: 'Financial Statement', icon: FileText, desc: 'Professional report for tax prep' },
        { id: 'CSV', label: 'Raw Data (Excel)', icon: FileSpreadsheet, desc: 'Analysis ready spreadsheet' },
        { id: 'JSON', label: 'Developer API', icon: FileCode, desc: 'Structured data for custom apps' }
    ];

    return (
        <div className="p-8 lg:p-10 rounded-[40px] bg-foreground text-background shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                <Download className="w-48 h-48" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                        <Download className="w-6 h-6 text-aegis-blue" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight italic">Portfolio <span className="text-aegis-blue">Export</span></h3>
                        <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-1">Tax & Performance Reporting</p>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    {formats.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFormat(f.id as any)}
                            className={cn(
                                "w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-4 group/opt",
                                format === f.id
                                    ? "border-aegis-blue bg-white/5"
                                    : "border-white/10 hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                format === f.id ? "bg-aegis-blue text-white" : "bg-white/10 text-white/50 group-hover/opt:text-white"
                            )}>
                                <f.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-black uppercase tracking-tight">{f.label}</div>
                                <div className="text-[10px] font-medium opacity-40">{f.desc}</div>
                            </div>
                            {format === f.id && (
                                <CheckCircle2 className="w-4 h-4 text-aegis-blue mt-1" />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    disabled={status !== 'idle'}
                    onClick={handleExport}
                    className={cn(
                        "w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all relative overflow-hidden flex items-center justify-center gap-3",
                        status === 'success' ? "bg-emerald-500 text-white" : "bg-aegis-blue text-white hover:shadow-[0_0_30px_rgba(40,140,250,0.4)]"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3"
                            >
                                Generate {format} Report
                                <ArrowRight className="w-4 h-4" />
                            </motion.div>
                        )}
                        {status === 'generating' && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing Data...
                            </motion.div>
                        )}
                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Report Downloaded
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Export</span>
                </div>
            </div>
        </div>
    );
}
