'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, Coins } from 'lucide-react';

interface RewardChartProps {
    data: number[];
    labels: string[];
    height?: number;
    className?: string;
    variant?: 'blue' | 'purple' | 'cyan';
}

export function RewardChart({
    data,
    labels,
    height = 200,
    className,
    variant = 'purple',
}: RewardChartProps) {
    const max = Math.max(...data) || 1;
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return { x, y };
    });

    const pathData = points.map((p, i) => (i === 0 ? `M 0 ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaData = `${pathData} L 100 100 L 0 100 Z`;

    const colors = {
        blue: 'stroke-aegis-blue fill-aegis-blue/10 stop-aegis-blue',
        purple: 'stroke-aegis-purple fill-aegis-purple/10 stop-aegis-purple',
        cyan: 'stroke-aegis-cyan fill-aegis-cyan/10 stop-aegis-cyan',
    };

    return (
        <div className={cn(
            "relative rounded-[32px] border border-border bg-background/40 backdrop-blur-xl p-8 overflow-hidden group",
            className
        )}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black tracking-tight mb-1">Reward Velocity</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                        <Coins className="w-3 h-3" />
                        Projected AGS Accrual
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp className="w-3 h-3" />
                    Optimal Yield
                </div>
            </div>

            <div style={{ height }} className="relative w-full mt-4">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" className={cn(colors[variant], "stop-opacity-20")} />
                            <stop offset="100%" className={cn(colors[variant], "stop-opacity-0")} />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((line) => (
                        <line
                            key={line}
                            x1="0"
                            y1={line}
                            x2="100"
                            y2={line}
                            className="stroke-border/20"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Area */}
                    <motion.path
                        initial={{ d: `M 0 100 L 100 100 L 0 100 Z`, opacity: 0 }}
                        animate={{ d: areaData, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        fill={`url(#grad-${variant})`}
                    />

                    {/* Line */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={pathData}
                        fill="none"
                        className={cn("stroke-[2]", colors[variant])}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Target points */}
                    {points.map((p, i) => (
                        <motion.circle
                            key={i}
                            initial={{ r: 0 }}
                            animate={{ r: 2 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            cx={p.x}
                            cy={p.y}
                            className={cn("fill-background stroke-[1.5]", colors[variant])}
                        />
                    ))}
                </svg>

                {/* Labels */}
                <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between">
                    {labels.map((label, i) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Glow */}
            <div className={cn(
                "absolute -bottom-12 -right-12 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none",
                variant === 'blue' && "bg-aegis-blue",
                variant === 'purple' && "bg-aegis-purple",
                variant === 'cyan' && "bg-aegis-cyan"
            )} />
        </div>
    );
}
