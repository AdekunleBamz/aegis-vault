'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  suffix?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  suffix,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`
            w-full bg-gray-800 border rounded-lg px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || suffix ? 'pr-10' : ''}
            ${error ? 'border-red-500' : 'border-gray-700'}
            ${className}
          `}
          {...props}
        />
        
        {(rightIcon || suffix) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon || suffix}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-400' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      
      <select
        className={`
          w-full bg-gray-800 border rounded-lg px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition appearance-none cursor-pointer
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        className={`
          w-full bg-gray-800 border rounded-lg px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition resize-none
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
