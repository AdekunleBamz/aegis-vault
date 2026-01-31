'use client';

import React from 'react';

// Accordion Component
export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className = '',
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-white">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-4 py-3 bg-gray-800/50">{children}</div>
      </div>
    </div>
  );
}

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

// Collapsible Section
export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  className?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = true,
  icon,
  badge,
  className = '',
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 mb-2 group"
      >
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
          {title}
        </span>
        {badge !== undefined && (
          <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
      <div
        className={`transition-all duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// Expandable Card
export interface ExpandableCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  expandedContent?: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function ExpandableCard({
  header,
  children,
  expandedContent,
  defaultExpanded = false,
  className = '',
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden ${className}`}>
      <div className="p-4">
        {header}
        <div className="mt-3">{children}</div>
      </div>
      
      {expandedContent && (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gray-700/50 hover:bg-gray-700 transition-colors text-sm text-gray-400"
          >
            <span>{isExpanded ? 'Show less' : 'Show more'}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`transition-all duration-300 ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="p-4 pt-0 border-t border-gray-700">{expandedContent}</div>
          </div>
        </>
      )}
    </div>
  );
}

// Details/Summary
export interface DetailsProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Details({ summary, children, className = '' }: DetailsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">{summary}</span>
      </button>
      {isOpen && (
        <div className="mt-2 ml-6 text-gray-300 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}
