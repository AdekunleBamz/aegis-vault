'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface HistoryFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export function HistoryFilters({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter
}: HistoryFiltersProps) {
    return (
        <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by Tx ID, Block, or Function..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-3 h-3 text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2">
                    <div className="relative group">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Largest Amount</option>
                            <option value="amount-asc">Smallest Amount</option>
                        </select>
                    </div>

                    <div className="relative group">
                        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="success">Success Only</option>
                            <option value="pending">Pending Only</option>
                            <option value="failed">Failed Only</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
