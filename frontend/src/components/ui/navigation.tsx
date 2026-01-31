'use client';

import React, { useState, useEffect, useCallback } from 'react';

// =============================================================================
// BREADCRUMBS
// =============================================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  maxItems = 4,
  className = '',
}: BreadcrumbsProps) {
  const defaultSeparator = (
    <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const visibleItems = items.length > maxItems
    ? [items[0], { label: '...' }, ...items.slice(-maxItems + 2)]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-sm">
        {visibleItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-zinc-600">{separator || defaultSeparator}</span>}
            {item.href && item.label !== '...' ? (
              <a
                href={item.href}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <span className={`flex items-center gap-1.5 ${index === visibleItems.length - 1 ? 'text-zinc-100 font-medium' : 'text-zinc-500'}`}>
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// =============================================================================
// PAGINATION
// =============================================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
  showFirstLast = true,
  size = 'md',
}: PaginationProps) {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), 'dots', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, 'dots', ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [1, 'dots', ...range(leftSiblingIndex, rightSiblingIndex), 'dots', totalPages];
  };

  const sizeClasses = {
    sm: 'h-8 min-w-8 text-sm',
    md: 'h-10 min-w-10 text-base',
    lg: 'h-12 min-w-12 text-lg',
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1 ${className}`}>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${sizeClasses[size]} px-2 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          aria-label="First page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${sizeClasses[size]} px-2 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, index) => {
        if (page === 'dots') {
          return (
            <span key={`dots-${index}`} className={`${sizeClasses[size]} flex items-center justify-center text-zinc-500`}>
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`${sizeClasses[size]} px-3 flex items-center justify-center rounded-lg border transition-colors ${
              isActive
                ? 'bg-amber-500 border-amber-500 text-black font-medium'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${sizeClasses[size]} px-2 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${sizeClasses[size]} px-2 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          aria-label="Last page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

// =============================================================================
// SIMPLE PAGINATION
// =============================================================================

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: SimplePaginationProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <span className="text-zinc-500">
        Page <span className="text-zinc-100 font-medium">{currentPage}</span> of{' '}
        <span className="text-zinc-100 font-medium">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// =============================================================================
// PAGE SIZE SELECTOR
// =============================================================================

interface PageSizeSelectorProps {
  pageSize: number;
  options?: number[];
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export function PageSizeSelector({
  pageSize,
  options = [10, 25, 50, 100],
  onPageSizeChange,
  className = '',
}: PageSizeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-zinc-400">Show</span>
      <select
        value={pageSize}
        onChange={e => onPageSizeChange(Number(e.target.value))}
        className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-zinc-400">per page</span>
    </div>
  );
}

// =============================================================================
// LINK TABS
// =============================================================================

interface LinkTab {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface LinkTabsProps {
  tabs: LinkTab[];
  activeHref: string;
  className?: string;
}

export function LinkTabs({ tabs, activeHref, className = '' }: LinkTabsProps) {
  return (
    <nav className={`flex items-center gap-1 border-b border-zinc-800 ${className}`}>
      {tabs.map(tab => {
        const isActive = tab.href === activeHref;
        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              isActive
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
            }`}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700 text-zinc-400'}`}>
                {tab.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}

// =============================================================================
// SIDEBAR NAV
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

interface SidebarNavProps {
  items: NavItem[];
  activeHref: string;
  className?: string;
}

export function SidebarNav({ items, activeHref, className = '' }: SidebarNavProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  const renderItem = (item: NavItem, depth = 0) => {
    const isActive = item.href === activeHref;
    const isExpanded = expandedItems.includes(item.href);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.href}>
        <a
          href={hasChildren ? undefined : item.href}
          onClick={hasChildren ? () => toggleExpand(item.href) : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            isActive
              ? 'bg-amber-500/10 text-amber-400'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
          style={{ paddingLeft: `${(depth * 12) + 12}px` }}
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-2 py-0.5 text-xs bg-zinc-700 text-zinc-300 rounded-full">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </a>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map(item => renderItem(item))}
    </nav>
  );
}
