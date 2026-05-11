'use client';

/**
 * @file Key Performance Indicator (KPI) card component
 *
 * Displays a single metric with optional trend indicator and icon.
 * Used throughout dashboards to show important statistics.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the KPICard component.
 */
interface KPICardProps {
    label: string;
    value: string | number;
    secondaryValue?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    variant?: 'blue' | 'purple' | 'cyan' | 'indigo';
    loading?: boolean;
    className?: string;
}

/** Tailwind class maps for each colour variant of the KPICard. */
const variants = {
    blue: {
        iconBg: 'bg-aegis-blue/10',
        iconColor: 'text-aegis-blue',
        glow: 'group-hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-blue)/0.2)]',
        border: 'group-hover:border-aegis-blue/30',
    },
    purple: {
        iconBg: 'bg-aegis-purple/10',
        iconColor: 'text-aegis-purple',
        glow: 'group-hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-purple)/0.2)]',
        border: 'group-hover:border-aegis-purple/30',
    },
    cyan: {
        iconBg: 'bg-aegis-cyan/10',
        iconColor: 'text-aegis-cyan',
        glow: 'group-hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-cyan)/0.2)]',
        border: 'group-hover:border-aegis-cyan/30',
    },
    indigo: {
        iconBg: 'bg-aegis-indigo/10',
        iconColor: 'text-aegis-indigo',
        glow: 'group-hover:shadow-[0_0_30px_-5px_hsl(var(--aegis-indigo)/0.2)]',
        border: 'group-hover:border-aegis-indigo/30',
    },
};

export function KPICard({
    label,
    value,
    secondaryValue,
    icon: Icon,
    trend,
    variant = 'blue',
    loading = false,
    className,
}: KPICardProps) {
    const v = variants[variant];

    if (loading) {
        return (
            <div className={cn(
                "relative rounded-[32px] border border-border bg-background/40 backdrop-blur-xl p-6 h-full animate-pulse",
                className
            )}>
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-muted rounded-2xl" />
                    <div className="w-16 h-4 bg-muted rounded-full" />
                </div>
                <div className="w-32 h-8 bg-muted rounded-lg mb-2" />
                <div className="w-24 h-4 bg-muted rounded-full" />
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                "group relative rounded-[32px] border border-border bg-background/40 backdrop-blur-xl p-6 h-full transition-all duration-300",
                v.glow,
                v.border,
                className
            )}
            role="region"
            aria-label={`${label} statistic card`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                    v.iconBg,
                    v.iconColor
                )} aria-hidden="true">
                    <Icon className="w-6 h-6" />
                </div>

                {trend && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                    )}
                        role="img"
                        aria-label={`Trend: ${trend.isPositive ? "Up" : "Down"} by ${trend.value}%`}
                    >
                        {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trend.value}%
                    </div>
                )}
            </div>

            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                    {label}
                </h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight">
                        {value}
                    </span>
                    {secondaryValue && (
                        <span className="text-sm font-bold text-muted-foreground/40">
                            {secondaryValue}
                        </span>
                    )}
                </div>

                {trend?.label && (
                    <p className="mt-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        {trend.label}
                    </p>
                )}
            </div>

            {/* Hover decoration */}
            <div className={cn(
                "absolute bottom-0 right-0 w-24 h-24 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                variant === 'blue' && "bg-aegis-blue",
                variant === 'purple' && "bg-aegis-purple",
                variant === 'cyan' && "bg-aegis-cyan",
                variant === 'indigo' && "bg-aegis-indigo"
            )} />
        </motion.div>
    );
}

interface SkeletonKPIProps {
    className?: string;
    variant?: 'blue' | 'purple' | 'cyan' | 'indigo';
}

export function SkeletonKPI({ className, variant = 'blue' }: SkeletonKPIProps) {
    return (
        <KPICard
            label="Loading"
            value="--"
            icon={Minus}
            variant={variant}
            loading
            className={className}
        />
    );
}
