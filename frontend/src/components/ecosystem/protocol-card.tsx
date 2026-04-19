'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type IntegrationStatus = 'Native' | 'Partner' | 'External';

const INTEGRATION_STATUS_CLASS: Record<IntegrationStatus, string> = {
    Native: 'text-aegis-blue bg-aegis-blue/10 border-aegis-blue/20',
    Partner: 'text-aegis-purple bg-aegis-purple/10 border-aegis-purple/20',
    External: 'text-muted-foreground bg-muted border-border',
};

interface ProtocolCardProps {
    name: string;
    description: string;
    category: string;
    logo: string;
    url: string;
    integrationStatus: IntegrationStatus;
    isLive?: boolean;
}

export function ProtocolCard({
    name,
    description,
    category,
    logo,
    url,
    integrationStatus,
    isLive
}: ProtocolCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="p-8 rounded-[40px] bg-background border border-border hover:border-aegis-blue/30 transition-all group relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl"
        >
            <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-muted/30 rounded-[24px] border border-border/50 flex items-center justify-center p-3 group-hover:bg-background transition-colors overflow-hidden">
                    <Image
                      src={logo}
                      alt={`${name} logo`}
                      width={64}
                      height={64}
                      sizes="64px"
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        INTEGRATION_STATUS_CLASS[integrationStatus]
                    )}>
                        {integrationStatus}
                    </div>
                    {isLive && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Live
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <div className="text-[10px] font-black text-aegis-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                    {category}
                    {integrationStatus === 'Native' && <Sparkles className="w-3 h-3 fill-current" />}
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-3 group-hover:text-gradient-blue transition-all">{name}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/30">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-aegis-blue transition-colors group/link"
                    aria-label={`Explore ${name} protocol`}
                >
                    Explore Protocol
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
                <div className="flex -space-x-2 group-hover:-space-x-1 transition-all">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-background" />
                    ))}
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                <Globe className="w-40 h-40 rotate-12" />
            </div>
        </motion.div>
    );
}
