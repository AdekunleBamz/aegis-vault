'use client';

import React from 'react';

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 rounded-[32px] bg-muted/50 border border-border/50" />
      ))}
    </div>
  );
}
