'use client'

import React from 'react'

// Page Container - Main layout wrapper for pages
interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: 'px-0',
  sm: 'px-4',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12',
}

export function PageContainer({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
}: PageContainerProps) {
  return (
    <div 
      className={`
        w-full mx-auto
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Page Section - Section within a page
interface PageSectionProps {
  children: React.ReactNode
  id?: string
  background?: 'transparent' | 'muted' | 'card' | 'gradient'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const backgroundClasses = {
  transparent: '',
  muted: 'bg-gray-50 dark:bg-gray-800/50',
  card: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
  gradient: 'bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 rounded-xl',
}

const spacingClasses = {
  none: '',
  sm: 'py-4',
  md: 'py-6 sm:py-8',
  lg: 'py-8 sm:py-12',
  xl: 'py-12 sm:py-16',
}

export function PageSection({
  children,
  id,
  background = 'transparent',
  spacing = 'md',
  className = '',
}: PageSectionProps) {
  return (
    <section 
      id={id}
      className={`
        ${backgroundClasses[background]}
        ${spacingClasses[spacing]}
        ${background === 'card' ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </section>
  )
}

// Content Grid - Responsive grid for content layout
interface ContentGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export function ContentGrid({
  children,
  columns = 2,
  gap = 'md',
  className = '',
}: ContentGridProps) {
  return (
    <div 
      className={`
        grid
        ${gridClasses[columns]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Sidebar Layout - Main content with sidebar
interface SidebarLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: 'sm' | 'md' | 'lg'
  sticky?: boolean
  className?: string
}

const sidebarWidthClasses = {
  sm: 'lg:w-64',
  md: 'lg:w-80',
  lg: 'lg:w-96',
}

export function SidebarLayout({
  children,
  sidebar,
  sidebarPosition = 'right',
  sidebarWidth = 'md',
  sticky = true,
  className = '',
}: SidebarLayoutProps) {
  const sidebarContent = (
    <aside 
      className={`
        ${sidebarWidthClasses[sidebarWidth]}
        flex-shrink-0
        ${sticky ? 'lg:sticky lg:top-24 lg:self-start' : ''}
      `}
    >
      {sidebar}
    </aside>
  )

  return (
    <div 
      className={`
        flex flex-col lg:flex-row gap-8
        ${className}
      `}
    >
      {sidebarPosition === 'left' && sidebarContent}
      <main className="flex-1 min-w-0">
        {children}
      </main>
      {sidebarPosition === 'right' && sidebarContent}
    </div>
  )
}

// Split Layout - Two equal or weighted columns
interface SplitLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
  ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1'
  gap?: 'sm' | 'md' | 'lg'
  reverseOnMobile?: boolean
  className?: string
}

const ratioClasses = {
  '1:1': 'lg:grid-cols-2',
  '1:2': 'lg:grid-cols-3', // left gets 1/3, right gets 2/3
  '2:1': 'lg:grid-cols-3', // left gets 2/3, right gets 1/3
  '1:3': 'lg:grid-cols-4', // left gets 1/4, right gets 3/4
  '3:1': 'lg:grid-cols-4', // left gets 3/4, right gets 1/4
}

export function SplitLayout({
  left,
  right,
  ratio = '1:1',
  gap = 'md',
  reverseOnMobile = false,
  className = '',
}: SplitLayoutProps) {
  const getColSpan = (side: 'left' | 'right') => {
    switch (ratio) {
      case '1:2': return side === 'left' ? 'lg:col-span-1' : 'lg:col-span-2'
      case '2:1': return side === 'left' ? 'lg:col-span-2' : 'lg:col-span-1'
      case '1:3': return side === 'left' ? 'lg:col-span-1' : 'lg:col-span-3'
      case '3:1': return side === 'left' ? 'lg:col-span-3' : 'lg:col-span-1'
      default: return ''
    }
  }

  return (
    <div 
      className={`
        grid grid-cols-1
        ${ratioClasses[ratio]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      <div className={`${getColSpan('left')} ${reverseOnMobile ? 'order-2 lg:order-1' : ''}`}>
        {left}
      </div>
      <div className={`${getColSpan('right')} ${reverseOnMobile ? 'order-1 lg:order-2' : ''}`}>
        {right}
      </div>
    </div>
  )
}

// Stack - Vertical stack with consistent spacing
interface StackProps {
  children: React.ReactNode
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  divider?: boolean
  className?: string
}

const stackSpacingClasses = {
  xs: 'space-y-2',
  sm: 'space-y-3',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
}

export function Stack({
  children,
  spacing = 'md',
  divider = false,
  className = '',
}: StackProps) {
  const childArray = React.Children.toArray(children)

  if (divider) {
    return (
      <div className={`${stackSpacingClasses[spacing]} ${className}`}>
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childArray.length - 1 && (
              <hr className="border-gray-200 dark:border-gray-700" />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className={`${stackSpacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  )
}

export default PageContainer
