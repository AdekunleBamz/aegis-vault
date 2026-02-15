import React, { useState } from 'react';

/**
 * PR #45: Sortable table columns
 */
interface Sortable {
  key: string;
  label: string;
  sortable?: boolean;
}

export const SortableTable: React.FC<{
  columns: Sortable[];
  data: any[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}> = ({ columns, data, onSort }) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-300">
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        {sortDir === 'asc' ? (
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                        ) : (
                          <path fillRule="evenodd" d="M17 11a1 1 0 01-.293.707l-7 7a1 1 0 01-1.414-1.414L15.586 11H3a1 1 0 110-2h12.586l-6.293-6.293a1 1 0 011.414-1.414l7 7A1 1 0 0117 11z" />
                        )}
                      </svg>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-300">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * PR #46: Data filtering UI
 */
export const FilterControls: React.FC<{
  filters: Array<{ key: string; label: string; options: string[] }>;
  onFilterChange?: (key: string, value: string) => void;
}> = ({ filters, onFilterChange }) => (
  <div className="flex flex-wrap gap-3">
    {filters.map((filter) => (
      <select
        key={filter.key}
        onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
        className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-blue-500"
      >
        <option value="">{filter.label}</option>
        {filter.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ))}
  </div>
);

/**
 * PR #47: Pagination controls
 */
export const Pagination: React.FC<{
  total: number;
  current: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}> = ({ total, current, onPageChange, pageSize = 10 }) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, current - 2);
    return start + i;
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
      >
        ← Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg ${
            page === current
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === totalPages}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
      >
        Next →
      </button>
    </div>
  );
};

/**
 * PR #48: Empty state designs
 */
export const EmptyDataState: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="py-12 text-center space-y-4">
    <div className="text-6xl opacity-10">📊</div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
