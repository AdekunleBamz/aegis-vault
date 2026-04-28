'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, ExternalLink, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const AUDIT_LOGS = [
    {
        id: 'AUD-2026-003',
        date: '2026-03-10',
        type: 'Smart Contract Audit',
        entity: 'Halborn',
        status: 'Completed',
        severity: 'Low Risk',
        hash: '0x82f...a12'
    },
    {
        id: 'SEC-2026-001',
        date: '2026-03-05',
        type: 'Security Patch',
        entity: 'Core Devs',
        status: 'Deployed',
        severity: 'Critical Fix',
        hash: '0x1de...f90'
    },
    {
        id: 'AUD-2026-002',
        date: '2026-02-15',
        type: 'Penetration Test',
        entity: 'Kudelski Security',
        status: 'Completed',
        severity: 'Secure',
        hash: '0x45a...b32'
    },
    {
        id: 'AUD-2026-001',
        date: '2026-01-20',
        type: 'Initial Code Audit',
        entity: 'Zell-O',
        status: 'Completed',
        severity: 'Resolved',
        hash: '0xce3...d44'
    },
];

export function AuditLogs() {

    return (
        <div className="rounded-[40px] border border-border bg-background/40 backdrop-blur-2xl p-8 lg:p-10 relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter">Audit <span className="text-gradient">Trail</span></h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Immutable security history</p>
                </div>
                <div className="relative group w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-aegis-blue transition-colors" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-aegis-blue/20 transition-all font-bold"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {AUDIT_LOGS.map((log, i) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-3xl bg-muted/20 border border-border/30 hover:border-aegis-blue/30 hover:bg-muted/40 transition-all gap-6 group/log"
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                log.severity.includes('Critical') ? "bg-red-500/10 text-red-500" : "bg-aegis-blue/10 text-aegis-blue"
                            )}>
                                {log.severity.includes('Critical') ? <ShieldAlert className="w-6 h-6" /> : <FileSearch className="w-6 h-6" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-base font-black tracking-tight">{log.type}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{log.id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground">{log.entity}</span>
                                    <span className="w-1 h-1 bg-border rounded-full" />
                                    <span className="text-xs font-bold text-muted-foreground">{log.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-8">
                            <div className="text-right">
                                <div className={cn(
                                    "text-[10px] font-black uppercase tracking-widest mb-1 px-3 py-1 rounded-full border inline-block",
                                    log.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-aegis-blue/10 text-aegis-blue border-aegis-blue/20"
                                )}>
                                    {log.status}
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Severity: {log.severity}</div>
                            </div>
                            <button type="button" className="p-3 bg-background border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-aegis-blue transition-all group/btn">
                                <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button type="button" className="w-full mt-8 py-5 bg-background border border-border/50 rounded-3xl text-xs font-black uppercase tracking-widest hover:border-aegis-blue/50 transition-all flex items-center justify-center gap-2 group/footer">
                Load Historical Archives
                <ChevronRight className="w-4 h-4 group-hover/footer:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}

import { ChevronRight } from 'lucide-react';
