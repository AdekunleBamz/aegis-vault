'use client';

import React from 'react';

// Switch Toggle
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: SwitchProps) {
  const sizeClass = sizes[size];

  return (
    <label className={`flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      {(label || description) && (
        <div className="mr-4">
          {label && <span className="text-white font-medium">{label}</span>}
          {description && (
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 ${sizeClass.track} items-center rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-gray-600'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block ${sizeClass.thumb} transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? sizeClass.translate : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

// Checkbox
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  className = '',
}: CheckboxProps) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            checked || indeterminate
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-500 hover:border-gray-400'
          }`}
        >
          {checked && !indeterminate && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {indeterminate && (
            <div className="w-2.5 h-0.5 bg-white rounded" />
          )}
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <span className="text-white">{label}</span>}
          {description && (
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}

// Radio Button
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  orientation = 'vertical',
  className = '',
}: RadioGroupProps) {
  return (
    <div
      className={`${
        orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3'
      } ${className}`}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-start gap-3 ${
            option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className="relative mt-0.5">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => !option.disabled && onChange(option.value)}
              disabled={option.disabled}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                value === option.value
                  ? 'border-emerald-500'
                  : 'border-gray-500 hover:border-gray-400'
              }`}
            >
              {value === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
            </div>
          </div>
          <div>
            <span className="text-white">{option.label}</span>
            {option.description && (
              <p className="text-sm text-gray-400 mt-0.5">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

// Segmented Control
export interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl({
  value,
  onChange,
  options,
  size = 'md',
  fullWidth = false,
  className = '',
}: SegmentedControlProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex bg-gray-800 rounded-lg p-1 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-center justify-center gap-1.5 ${sizeClasses[size]} rounded-md font-medium transition-all ${
            fullWidth ? 'flex-1' : ''
          } ${
            value === option.value
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
