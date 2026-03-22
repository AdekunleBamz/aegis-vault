'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
    day: number;
    amount: number;
}

interface RewardChartProps {
    data?: DataPoint[];
    height?: number;
    color?: string;
}

export function RewardChart({
    data = [],
    height = 200,
    color = 'hsl(var(--aegis-blue))'
}: RewardChartProps) {
    const { points, areaPoints, maxAmount, maxDay } = useMemo(() => {
        if (data.length === 0) return { points: '', areaPoints: '', maxAmount: 1, maxDay: 1 };

        const mAmount = Math.max(...data.map(d => d.amount), 1);
        const mDay = Math.max(...data.map(d => d.day), 1);

        const pts = data.map((d, i) => {
            const x = (d.day / mDay) * 100;
            const y = 100 - (d.amount / mAmount) * 100;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        const lastPoint = data[data.length - 1];
        const firstPoint = data[0];
        const aPts = `${pts} L ${(lastPoint.day / mDay) * 100} 100 L ${(firstPoint.day / mDay) * 100} 100 Z`;

        return { points: pts, areaPoints: aPts, maxAmount: mAmount, maxDay: mDay };
    }, [data]);

    if (data.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-muted/5 p-4" style={{ height }}>
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
            >
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map((tick) => (
                    <line
                        key={tick}
                        x1="0"
                        y1={tick}
                        x2="100"
                        y2={tick}
                        stroke="currentColor"
                        strokeOpacity="0.05"
                        strokeWidth="0.5"
                    />
                ))}

                {/* Fill Area */}
                <motion.path
                    initial={{ opacity: 0, d: areaPoints.replace(/L [^ ]+ [^ ]+/g, 'L 0 100') }}
                    animate={{ opacity: 1, d: areaPoints }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    fill="url(#chartGradient)"
                />

                {/* Line */}
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const x = (d.day / maxDay) * 100;
                    const y = 100 - (d.amount / maxAmount) * 100;

                    return (
                        <motion.circle
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 + i * 0.05 }}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="white"
                            stroke={color}
                            strokeWidth="0.5"
                            className="cursor-pointer hover:r-2 transition-all"
                        />
                    );
                })}
            </svg>

            {/* Axis Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/50">Day 0</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/50">Day 30</span>
            </div>
        </div>
    );
}
