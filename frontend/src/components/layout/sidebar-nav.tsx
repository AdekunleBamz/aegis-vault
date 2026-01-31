'use client'

import React from 'react'
import Link from 'next/link'

// Sidebar Navigation Component
interface SidebarNavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  active?: boolean
  disabled?: boolean
  children?: SidebarNavItem[]
}

interface SidebarNavProps {
  items: SidebarNavItem[]
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function SidebarNav({
  items,
  collapsed = false,
  onCollapse,
  header,
  footer,
  className = '',
}: SidebarNavProps) {
  return (
    <nav 
      className={`
        flex flex-col h-full
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-200
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      {/* Header */}
      {header && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}

      {/* Collapse Toggle */}
      {onCollapse && (
        <button
          onClick={() => onCollapse(!collapsed)}
          className="absolute -right-3 top-6 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {items.map((item, index) => (
            <SidebarNavItemComponent 
              key={index} 
              item={item} 
              collapsed={collapsed}
            />
          ))}
        </ul>
      </div>

      {/* Footer */}
      {footer && !collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </nav>
  )
}

function SidebarNavItemComponent({
  item,
  collapsed,
  depth = 0,
}: {
  item: SidebarNavItem
  collapsed: boolean
  depth?: number
}) {
  const [expanded, setExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  const baseClasses = `
    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
    transition-colors duration-150
    ${item.disabled 
      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
      : item.active
        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }
    ${depth > 0 ? 'ml-6' : ''}
  `

  const content = (
    <>
      {item.icon && (
        <span className="flex-shrink-0 w-5 h-5">
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <svg 
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </>
      )}
    </>
  )

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full ${baseClasses}`}
          disabled={item.disabled}
        >
          {content}
        </button>
        {expanded && !collapsed && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child, index) => (
              <SidebarNavItemComponent 
                key={index} 
                item={child} 
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <Link
        href={item.href}
        className={baseClasses}
        aria-disabled={item.disabled}
        aria-current={item.active ? 'page' : undefined}
      >
        {content}
      </Link>
    </li>
  )
}

// Tab Navigation
interface TabNavItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  disabled?: boolean
}

interface TabNavProps {
  items: TabNavItem[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function TabNav({
  items,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabNavProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5',
  }

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      item: (active: boolean) => active
        ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600',
    },
    pills: {
      container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      item: (active: boolean) => active
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm rounded-md'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md',
    },
    underline: {
      container: '',
      item: (active: boolean) => active
        ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 pb-2'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 pb-2',
    },
  }

  return (
    <nav 
      className={`flex ${fullWidth ? 'w-full' : ''} ${variantClasses[variant].container} ${className}`}
      role="tablist"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => !item.disabled && onChange(item.id)}
          className={`
            flex items-center gap-2
            ${sizeClasses[size]}
            ${variantClasses[variant].item(activeTab === item.id)}
            ${fullWidth ? 'flex-1 justify-center' : ''}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            transition-colors duration-150
            font-medium
          `}
          role="tab"
          aria-selected={activeTab === item.id}
          disabled={item.disabled}
        >
          {item.icon}
          {item.label}
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

// Step Navigation
interface StepNavItem {
  id: string
  label: string
  description?: string
  status: 'completed' | 'current' | 'upcoming'
}

interface StepNavProps {
  steps: StepNavItem[]
  orientation?: 'horizontal' | 'vertical'
  showNumbers?: boolean
  className?: string
}

export function StepNav({
  steps,
  orientation = 'horizontal',
  showNumbers = true,
  className = '',
}: StepNavProps) {
  return (
    <nav 
      className={`
        ${orientation === 'horizontal' ? 'flex items-start' : 'space-y-4'}
        ${className}
      `}
      aria-label="Progress"
    >
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={`
            ${orientation === 'horizontal' ? 'flex-1 relative' : 'flex gap-4'}
            ${index < steps.length - 1 && orientation === 'horizontal' ? 'pr-4' : ''}
          `}
        >
          {/* Connector Line */}
          {index < steps.length - 1 && orientation === 'horizontal' && (
            <div 
              className={`
                absolute top-4 left-8 right-0 h-0.5
                ${step.status === 'completed' ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}
              `}
            />
          )}
          
          <div className={`flex ${orientation === 'horizontal' ? 'flex-col items-start' : 'items-start'} relative`}>
            {/* Step Indicator */}
            <div 
              className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2
                ${step.status === 'completed' 
                  ? 'bg-purple-500 border-purple-500 text-white' 
                  : step.status === 'current'
                    ? 'border-purple-500 text-purple-500 bg-white dark:bg-gray-800'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400 bg-white dark:bg-gray-800'
                }
              `}
            >
              {step.status === 'completed' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : showNumbers ? (
                <span className="text-sm font-medium">{index + 1}</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>

            {/* Step Label */}
            <div className={orientation === 'horizontal' ? 'mt-2' : ''}>
              <p 
                className={`
                  text-sm font-medium
                  ${step.status === 'current' 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : step.status === 'completed'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}

export default SidebarNav
