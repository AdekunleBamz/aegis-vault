'use client';

import React from 'react';

// Filter Chip Component
export interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  count?: number;
  className?: string;
}

export function FilterChip({
  label,
  isActive = false,
  onClick,
  onRemove,
  count,
  className = '',
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isActive
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
          isActive ? 'bg-white/20' : 'bg-gray-600'
        }`}>
          {count}
        </span>
      )}
      {onRemove && isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 p-0.5 hover:bg-white/20 rounded-full"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </button>
  );
}

// Filter Group
export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroupProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function FilterGroup({
  options,
  selected,
  onChange,
  multiple = true,
  className = '',
}: FilterGroupProps) {
  const handleClick = (id: string) => {
    if (multiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <FilterChip
          key={option.id}
          label={option.label}
          count={option.count}
          isActive={selected.includes(option.id)}
          onClick={() => handleClick(option.id)}
          onRemove={multiple ? () => onChange(selected.filter((s) => s !== option.id)) : undefined}
        />
      ))}
    </div>
  );
}

// Sort Dropdown
export interface SortOption {
  id: string;
  label: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'asc' | 'desc';
  onDirectionChange?: (direction: 'asc' | 'desc') => void;
  className?: string;
}

export function SortDropdown({
  options,
  value,
  onChange,
  direction = 'desc',
  onDirectionChange,
  className = '',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((o) => o.id === value);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:border-gray-600 transition-colors"
        >
          <span className="text-sm">Sort by: {selectedOption?.label || 'Select'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {onDirectionChange && (
          <button
            onClick={() => onDirectionChange(direction === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            title={direction === 'asc' ? 'Ascending' : 'Descending'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${direction === 'asc' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                option.id === value
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Date Range Filter
export interface DateRangeFilterProps {
  presets?: { id: string; label: string; days: number }[];
  selected?: string;
  onChange: (id: string) => void;
  className?: string;
}

const defaultPresets = [
  { id: '24h', label: '24h', days: 1 },
  { id: '7d', label: '7d', days: 7 },
  { id: '30d', label: '30d', days: 30 },
  { id: '90d', label: '90d', days: 90 },
  { id: 'all', label: 'All', days: 0 },
];

export function DateRangeFilter({
  presets = defaultPresets,
  selected = '30d',
  onChange,
  className = '',
}: DateRangeFilterProps) {
  return (
    <div className={`inline-flex bg-gray-800 rounded-lg p-1 ${className}`}>
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onChange(preset.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            selected === preset.id
              ? 'bg-emerald-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
