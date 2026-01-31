'use client';

import React from 'react';

// Slider
export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  marks?: { value: number; label: string }[];
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue,
  marks,
  disabled = false,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <label className="text-sm text-gray-400">{label}</label>}
          {showValue && (
            <span className="text-sm font-medium text-white">{displayValue}</span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #10B981 0%, #10B981 ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
          }}
        />
      </div>
      {marks && (
        <div className="flex justify-between mt-1">
          {marks.map((mark) => (
            <span
              key={mark.value}
              className={`text-xs ${
                value >= mark.value ? 'text-emerald-400' : 'text-gray-500'
              }`}
            >
              {mark.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Range Slider (dual thumbs)
export interface RangeSliderProps {
  values: [number, number];
  onChange: (values: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

export function RangeSlider({
  values,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue,
  disabled = false,
  className = '',
}: RangeSliderProps) {
  const [minVal, maxVal] = values;
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  const displayMin = formatValue ? formatValue(minVal) : minVal;
  const displayMax = formatValue ? formatValue(maxVal) : maxVal;

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">{label}</label>
          <span className="text-sm font-medium text-white">
            {displayMin} - {displayMax}
          </span>
        </div>
      )}
      <div className="relative h-2">
        <div className="absolute w-full h-2 bg-gray-700 rounded-full" />
        <div
          className="absolute h-2 bg-emerald-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          value={minVal}
          onChange={(e) => {
            const newMin = Math.min(Number(e.target.value), maxVal - step);
            onChange([newMin, maxVal]);
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
        />
        <input
          type="range"
          value={maxVal}
          onChange={(e) => {
            const newMax = Math.max(Number(e.target.value), minVal + step);
            onChange([minVal, newMax]);
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>
    </div>
  );
}

// Rating Stars
export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const ratingSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function Rating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(starValue)}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
          >
            <svg
              className={`${ratingSizes[size]} ${
                isFilled ? 'text-yellow-400' : 'text-gray-600'
              }`}
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// Color Picker (simple)
export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
  label?: string;
  className?: string;
}

const defaultColors = [
  '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
  '#F59E0B', '#EF4444', '#6366F1', '#14B8A6',
];

export function ColorPicker({
  value,
  onChange,
  colors = defaultColors,
  label,
  className = '',
}: ColorPickerProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-gray-400 mb-2">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-lg transition-all ${
              value === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
