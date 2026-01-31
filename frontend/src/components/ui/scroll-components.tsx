'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// =============================================================================
// SCROLL TO TOP BUTTON
// =============================================================================

interface ScrollToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function ScrollToTop({
  threshold = 300,
  smooth = true,
  className = '',
  position = 'bottom-right',
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-50 p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-full shadow-lg
        transition-all duration-300 hover:scale-110 active:scale-95
        ${positionClasses[position]}
        ${className}
      `}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

// =============================================================================
// SCROLL PROGRESS INDICATOR
// =============================================================================

interface ScrollProgressProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  className?: string;
}

export function ScrollProgress({
  color = 'bg-amber-500',
  height = 3,
  position = 'top',
  className = '',
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percent = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
    };

    window.addEventListener('scroll', calculateProgress);
    calculateProgress();
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'} ${className}`}
      style={{ height }}
    >
      <div
        className={`h-full ${color} transition-[width] duration-100`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// =============================================================================
// INFINITE SCROLL TRIGGER
// =============================================================================

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
}

export function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading = false,
  threshold = 100,
  className = '',
  loadingComponent,
  endComponent,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, threshold]);

  return (
    <div ref={triggerRef} className={`py-4 flex justify-center ${className}`}>
      {isLoading ? (
        loadingComponent || (
          <div className="flex items-center gap-2 text-zinc-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Loading more...</span>
          </div>
        )
      ) : !hasMore ? (
        endComponent || <span className="text-zinc-500 text-sm">No more items</span>
      ) : null}
    </div>
  );
}

// =============================================================================
// PULL TO REFRESH
// =============================================================================

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  pullThreshold?: number;
  className?: string;
  refreshingComponent?: React.ReactNode;
}

export function PullToRefresh({
  children,
  onRefresh,
  pullThreshold = 80,
  className = '',
  refreshingComponent,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const distance = e.touches[0].clientY - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, pullThreshold * 1.5));
      }
    }
  }, [isRefreshing, pullThreshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  }, [pullDistance, pullThreshold, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / pullThreshold, 1);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
        style={{
          top: Math.max(0, pullDistance - 50),
          opacity: progress,
          transition: pullDistance === 0 ? 'all 0.3s ease' : 'none',
        }}
      >
        {isRefreshing ? (
          refreshingComponent || (
            <svg className="w-6 h-6 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )
        ) : (
          <svg
            className="w-6 h-6 text-zinc-400"
            style={{ transform: `rotate(${progress * 180}deg)` }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
      </div>
      <div style={{ transform: `translateY(${pullDistance}px)`, transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none' }}>
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// VIRTUALIZED LIST
// =============================================================================

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerHeight: number;
  overscan?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  containerHeight,
  overscan = 3,
  className = '',
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// STICKY SECTION
// =============================================================================

interface StickySectionProps {
  children: React.ReactNode;
  stickyContent: React.ReactNode;
  stickyPosition?: 'top' | 'bottom';
  offset?: number;
  className?: string;
  stickyClassName?: string;
}

export function StickySection({
  children,
  stickyContent,
  stickyPosition = 'top',
  offset = 0,
  className = '',
  stickyClassName = '',
}: StickySectionProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`sticky z-40 ${stickyClassName}`}
        style={{ [stickyPosition]: offset }}
      >
        {stickyContent}
      </div>
      {children}
    </div>
  );
}
