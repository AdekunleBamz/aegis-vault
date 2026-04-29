'use client';

import { Search } from 'lucide-react';

type SortBy = 'date-desc' | 'date-asc' | 'status';
type StatusFilter = 'all' | 'success' | 'pending' | 'failed';

interface HistoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: SortBy;
  setSortBy: (value: SortBy) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
}

export function HistoryFilters({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
}: HistoryFiltersProps) {
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
      <label className="relative block">
        <span className="sr-only">Search transactions</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by txid or action..."
          className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-400/60 focus:outline-none"
        />
      </label>

      <label className="sr-only" htmlFor="history-status-filter">
        Filter by status
      </label>
      <select
        id="history-status-filter"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-gray-200 focus:border-blue-400/60 focus:outline-none"
      >
        <option value="all">All Statuses</option>
        <option value="success">Successful</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      <label className="sr-only" htmlFor="history-sort-by">
        Sort transactions
      </label>
      <select
        id="history-sort-by"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value as SortBy)}
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-gray-200 focus:border-blue-400/60 focus:outline-none"
      >
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="status">Status</option>
      </select>
    </div>
  );
}
