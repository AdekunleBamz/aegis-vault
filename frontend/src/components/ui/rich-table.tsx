'use client'

import React from 'react'

// ============================================================================
// Rich Data Table Component
// ============================================================================

export interface TableColumn<T> {
  key: string
  header: string | React.ReactNode
  accessor: (item: T, index: number) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  className?: string
}

interface RichTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  loading?: boolean
  loadingRows?: number
  onRowClick?: (item: T, index: number) => void
  selectedRows?: Set<string | number>
  onSelectRow?: (key: string | number, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
  selectable?: boolean
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  stickyHeader?: boolean
  compact?: boolean
  striped?: boolean
  hoverable?: boolean
  className?: string
}

export function RichTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  emptyIcon,
  loading = false,
  loadingRows = 5,
  onRowClick,
  selectedRows,
  onSelectRow,
  onSelectAll,
  selectable = false,
  sortColumn,
  sortDirection,
  onSort,
  stickyHeader = false,
  compact = false,
  striped = false,
  hoverable = true,
  className = '',
}: RichTableProps<T>) {
  const allSelected = data.length > 0 && selectedRows?.size === data.length
  const someSelected = selectedRows && selectedRows.size > 0 && !allSelected

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return

    const newDirection = 
      sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(column.key, newDirection)
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3'

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl
        border border-gray-200 dark:border-gray-700
        overflow-hidden
        ${className}
      `}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead 
            className={`
              bg-gray-50 dark:bg-gray-700/50
              border-b border-gray-200 dark:border-gray-700
              ${stickyHeader ? 'sticky top-0 z-10' : ''}
            `}
          >
            <tr>
              {/* Select All Checkbox */}
              {selectable && (
                <th className={`${cellPadding} w-10`}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected ?? false
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
              )}

              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${cellPadding}
                    ${alignClasses[column.align || 'left']}
                    ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600' : ''}
                    text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider
                    ${column.className || ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <TableSortIcon
                        active={sortColumn === column.key}
                        direction={sortColumn === column.key ? sortDirection : undefined}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Loading State
              Array.from({ length: loadingRows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {selectable && (
                    <td className={cellPadding}>
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cellPadding}>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    {emptyIcon || (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    )}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((item, index) => {
                const key = keyExtractor(item, index)
                const isSelected = selectedRows?.has(key)

                return (
                  <tr
                    key={key}
                    className={`
                      ${striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                      ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}
                      ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                      ${onRowClick ? 'cursor-pointer' : ''}
                      transition-colors
                    `}
                    onClick={() => onRowClick?.(item, index)}
                  >
                    {/* Row Checkbox */}
                    {selectable && (
                      <td 
                        className={cellPadding}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow?.(key, e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                    )}

                    {/* Data Cells */}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`
                          ${cellPadding}
                          ${alignClasses[column.align || 'left']}
                          text-sm text-gray-700 dark:text-gray-300
                          ${column.className || ''}
                        `}
                      >
                        {column.accessor(item, index)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Sort Icon Component
function TableSortIcon({ 
  active, 
  direction 
}: { 
  active: boolean
  direction?: 'asc' | 'desc' 
}) {
  return (
    <svg 
      className={`w-4 h-4 ${active ? 'text-purple-500' : 'text-gray-400'}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      {!active || direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  )
}

// ============================================================================
// Table Pagination Component
// ============================================================================

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  maxVisiblePages?: number
  showItemCount?: boolean
  className?: string
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
  showItemCount = true,
  className = '',
}: TablePaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    if (rangeStart > 2) {
      pages.push('ellipsis')
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems ?? currentPage * itemsPerPage)

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Item Count */}
      {showItemCount && totalItems !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
      )}

      {/* Page Navigation */}
      <nav className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {showPageNumbers && getVisiblePages().map((page, index) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[40px] h-10 rounded-lg text-sm font-medium
                transition-colors
                ${currentPage === page
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  )
}

export default RichTable
