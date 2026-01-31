'use client'

import React from 'react'
import Link from 'next/link'

// Page Header Props
interface PageHeaderProps {
  title: string
  description?: string
  backLink?: {
    href: string
    label: string
  }
  actions?: React.ReactNode
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  }
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  children?: React.ReactNode
  className?: string
}

// Badge variant styles
const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
}

// Breadcrumb Component
export function Breadcrumbs({ items }: { items: PageHeaderProps['breadcrumbs'] }) {
  if (!items || items.length === 0) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg 
              className="w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          )}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Back Link Component
export function BackLink({ href, label }: NonNullable<PageHeaderProps['backLink']>) {
  return (
    <Link 
      href={href}
      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
    >
      <svg 
        className="w-4 h-4 mr-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      {label}
    </Link>
  )
}

// Main Page Header Component
export function PageHeader({
  title,
  description,
  backLink,
  actions,
  badge,
  breadcrumbs,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      
      {/* Back Link */}
      {backLink && !breadcrumbs && <BackLink {...backLink} />}

      {/* Main Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title with Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
            {badge && (
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  badgeVariants[badge.variant || 'default']
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          
          {/* Description */}
          {description && (
            <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Additional Content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </header>
  )
}

// Page Title Component for SEO
export function PageTitle({ title, suffix = 'Aegis Vault' }: { title: string; suffix?: string }) {
  const fullTitle = suffix ? `${title} | ${suffix}` : title
  
  return (
    <>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
    </>
  )
}

// Section Header Component
export function SectionHeader({
  title,
  description,
  action,
  className = '',
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Divider with optional label
export function Divider({ label, className = '' }: { label?: string; className?: string }) {
  if (label) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <hr className={`border-gray-200 dark:border-gray-700 ${className}`} />
  )
}

export default PageHeader
