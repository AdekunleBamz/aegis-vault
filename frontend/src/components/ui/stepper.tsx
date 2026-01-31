'use client';

import React from 'react';

// Stepper Component
export interface StepperStep {
  id: string | number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  className = '',
}: StepperProps) {
  if (orientation === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                        ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500'
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-[24px] mt-2 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p
                  className={`font-medium ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500'
                      : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={`mt-2 text-sm font-medium ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Timeline Component
export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  time?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'error' | 'warning' | 'pending' | 'default';
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusColors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  pending: 'bg-blue-500',
  default: 'bg-gray-500',
};

export function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full ${statusColors[item.status || 'default']}`}
            />
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-700 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">{item.title}</p>
              {item.time && (
                <span className="text-xs text-gray-500">{item.time}</span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Breadcrumbs Component
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  className = '',
}: BreadcrumbsProps) {
  const defaultSeparator = (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav className={`flex items-center space-x-2 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-500">{separator || defaultSeparator}</span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1 text-sm text-white">
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
