'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex mb-8">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
                <li>
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted flex items-center"
                        aria-label="Home"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                </li>

                {paths.map((path, index) => {
                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const isLast = index === paths.length - 1;
                    const label = path.charAt(0).toUpperCase() + path.slice(1);

                    return (
                        <React.Fragment key={path}>
                            <li className="text-muted-foreground/30 select-none">
                                <ChevronRight className="w-4 h-4" />
                            </li>
                            <li>
                                {isLast ? (
                                    <span
                                        className="text-sm font-black text-aegis-blue uppercase tracking-widest px-2 py-1 bg-aegis-blue/5 border border-aegis-blue/10 rounded-lg whitespace-nowrap"
                                        aria-current="page"
                                    >
                                        {label}
                                    </span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="text-sm font-black text-muted-foreground hover:text-foreground uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-muted transition-all whitespace-nowrap"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
