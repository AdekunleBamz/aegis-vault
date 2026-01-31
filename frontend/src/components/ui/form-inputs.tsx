'use client';

import React from 'react';

// Search Input with suggestions
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  isLoading = false,
  className = '',
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && value && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onChange(suggestion);
                onSearch?.(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Amount Input with max button
export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  max?: string | number;
  symbol?: string;
  decimals?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  max,
  symbol,
  decimals = 6,
  label,
  error,
  disabled = false,
  className = '',
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow valid number input
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  const handleMax = () => {
    if (max !== undefined) {
      onChange(String(max));
    }
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">{label}</label>
          {max !== undefined && (
            <span className="text-xs text-gray-500">
              Balance: {Number(max).toLocaleString(undefined, { maximumFractionDigits: decimals })} {symbol}
            </span>
          )}
        </div>
      )}
      <div className={`relative rounded-lg overflow-hidden ${error ? 'ring-1 ring-red-500' : ''}`}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="0.00"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg font-medium placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
          {max !== undefined && (
            <button
              onClick={handleMax}
              disabled={disabled}
              className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              MAX
            </button>
          )}
          {symbol && (
            <span className="text-gray-400 font-medium">{symbol}</span>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

// Number Stepper Input
export interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className = '',
}: NumberStepperProps) {
  const decrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-gray-400 mb-2">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val) && val >= min && val <= max) {
              onChange(val);
            }
          }}
          min={min}
          max={max}
          className="w-20 text-center py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-medium focus:border-emerald-500 outline-none"
        />
        <button
          onClick={increment}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
