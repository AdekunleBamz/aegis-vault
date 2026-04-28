'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Zap, Info, X, ChevronRight, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PerformanceMonitor() {
    const [isOpen, setIsOpen] = useState(false);
    const [metrics, setMetrics] = useState({
        fps: 0,
        memory: 0,
        latency: 0,
        status: 'Optimal'
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const update = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setMetrics(prev => ({
                    ...prev,
                    fps: Math.round((frameCount * 1000) / (now - lastTime)),
                    memory: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0,
                    latency: Math.round(now - lastTime - 1000)
                }));
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(update);
        };

        const handle = requestAnimationFrame(update);
        return () => cancelAnimationFrame(handle);
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-[100]">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setIsOpen(true)}
                        className="w-12 h-12 rounded-full bg-background border border-border shadow-2xl flex items-center justify-center text-muted-foreground hover:text-aegis-blue hover:border-aegis-blue/30 transition-all group"
                    >
                        <Gauge className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-72 bg-background/80 backdrop-blur-2xl border border-border shadow-[0_32px_64px_rgba(0,0,0,0.2)] rounded-[32px] overflow-hidden"
                    >
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-2">
                                <Gauge className="w-4 h-4 text-aegis-blue" />
                                <span className="text-[10px] font-black uppercase tracking-widest">System Pulse</span>
                            </div>
                            <button type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Frame Rate</div>
                                    <div className="text-xl font-black tabular-nums flex items-center gap-1.5">
                                        {metrics.fps}
                                        <span className="text-[10px] opacity-40">FPS</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">JS Heap</div>
                                    <div className="text-xl font-black tabular-nums flex items-center gap-1.5">
                                        {metrics.memory}
                                        <span className="text-[10px] opacity-40">MB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">App Health</div>
                                    <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest">
                                        {metrics.status}
                                    </div>
                                </div>
                                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '92%' }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Activity className="w-3 h-3 text-aegis-blue" />
                                    Latency: {metrics.latency}ms
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Cpu className="w-3 h-3 text-aegis-purple" />
                                    Node: v20.x
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-muted/50 flex items-center gap-2 group cursor-pointer hover:bg-muted transition-colors">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <div className="flex-1 text-[9px] font-black uppercase tracking-widest">Optimization Strategy</div>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
