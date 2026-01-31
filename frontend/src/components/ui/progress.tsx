import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gradient';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  label,
  animated = false,
  striped = false,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-400">{label || 'Progress'}</span>
          <span className="text-white font-medium">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-700/50 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out
            ${striped ? 'bg-stripes' : ''}
            ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gradient';
  showValue?: boolean;
  label?: string;
  className?: string;
}

const circularSizes = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 128,
};

const circularStrokeColors = {
  blue: 'stroke-blue-500',
  green: 'stroke-green-500',
  purple: 'stroke-purple-500',
  orange: 'stroke-orange-500',
  gradient: 'stroke-[url(#gradient)]',
};

export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 4,
  color = 'blue',
  showValue = true,
  label,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeNum = circularSizes[size];
  const radius = (sizeNum - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={sizeNum} height={sizeNum} className="transform -rotate-90">
        {color === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={sizeNum / 2}
          cy={sizeNum / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-700"
        />
        <circle
          cx={sizeNum / 2}
          cy={sizeNum / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-500 ease-out ${circularStrokeColors[color]}`}
          style={color === 'gradient' ? { stroke: 'url(#gradient)' } : {}}
        />
      </svg>
      {(showValue || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className={`font-bold text-white ${size === 'xl' ? 'text-2xl' : size === 'lg' ? 'text-xl' : 'text-sm'}`}>
              {percentage.toFixed(0)}%
            </span>
          )}
          {label && (
            <span className="text-gray-400 text-xs">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Steps Progress
interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepsProgressProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export function StepsProgress({ steps, currentStep, orientation = 'horizontal' }: StepsProgressProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div className={`flex ${isVertical ? 'flex-col' : 'items-center'}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={step.id}
            className={`flex ${isVertical ? 'flex-row' : 'flex-col items-center'} ${
              index !== steps.length - 1 ? (isVertical ? 'pb-8' : 'flex-1') : ''
            }`}
          >
            <div className={`flex ${isVertical ? 'flex-col items-center' : 'flex-row items-center w-full'}`}>
              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm
                  transition-all duration-200
                  ${isCompleted 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : isCurrent 
                      ? 'border-blue-500 text-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 text-gray-500 bg-gray-800'}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div className={`${isVertical ? 'w-0.5 h-full min-h-[2rem] mx-auto mt-2' : 'flex-1 h-0.5 mx-3'}
                  ${isCompleted ? 'bg-blue-500' : 'bg-gray-700'}`}
                />
              )}
            </div>
            
            {/* Step label */}
            <div className={`${isVertical ? 'ml-4' : 'mt-2 text-center'}`}>
              <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
