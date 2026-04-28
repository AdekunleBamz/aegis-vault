'use client';

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PositionStatus = 'all' | 'active' | 'locking' | 'expired';

const POSITION_STATUSES: { value: PositionStatus; label: string }[] = [
    { value: 'all', label: 'All Positions' },
    { value: 'active', label: 'Active' },
    { value: 'locking', label: 'Locking' },
    { value: 'expired', label: 'Expired' },
];

interface PositionFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: PositionStatus;
    onStatusChange: (status: PositionStatus) => void;
}

export function PositionFilters({
    search,
    onSearchChange,
    status,
    onStatusChange
}: PositionFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-aegis-blue transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by ID or amount..."
                    aria-label="Search positions by ID or amount"
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aegis-blue/20 focus:border-aegis-blue/50 transition-all"
                />
                {search && (
                    <button type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border border-border rounded-xl mr-2">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Status</span>
                </div>

                {POSITION_STATUSES.map((s) => (
                    <button type="button"
                        key={s.value}
                        onClick={() => onStatusChange(s.value)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                            status === s.value
                                ? "bg-foreground text-background border-foreground shadow-lg"
                                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50"
                        )}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
