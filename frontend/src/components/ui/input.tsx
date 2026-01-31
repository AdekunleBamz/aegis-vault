import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  variant?: 'default' | 'filled' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  showCharCount?: boolean;
  maxLength?: number;
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

const variantClasses = {
  default: 'bg-gray-900 border-gray-700 focus:border-blue-500',
  filled: 'bg-gray-800 border-transparent focus:border-blue-500 focus:bg-gray-900',
  ghost: 'bg-transparent border-gray-700/50 focus:border-blue-500 focus:bg-gray-900/50',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText,
    suffix, 
    prefix,
    variant = 'default',
    inputSize = 'md',
    showCharCount = false,
    maxLength,
    className = '', 
    onChange,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-sm mb-2 transition-colors ${
            isFocused ? 'text-blue-400' : error ? 'text-red-400' : 'text-gray-400'
          }`}>
            {label}
          </label>
        )}
        <div className={`relative group ${isFocused ? 'ring-2 ring-blue-500/20 rounded-lg' : ''}`}>
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full border rounded-lg text-white placeholder-gray-500
              focus:outline-none transition-all duration-200
              ${variantClasses[variant]}
              ${sizeClasses[inputSize]}
              ${error ? 'border-red-500 focus:border-red-500' : ''}
              ${prefix ? 'pl-10' : ''}
              ${suffix ? 'pr-10' : ''}
              ${className}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {suffix}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-1">
          {error ? (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          ) : helperText ? (
            <p className="text-gray-500 text-sm">{helperText}</p>
          ) : <span />}
          {showCharCount && maxLength && (
            <span className={`text-xs ${charCount >= maxLength ? 'text-red-400' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

// Additional TextArea component
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, showCharCount, maxLength, className = '', onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-sm mb-2 transition-colors ${
            isFocused ? 'text-blue-400' : error ? 'text-red-400' : 'text-gray-400'
          }`}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            transition-all duration-200 resize-none min-h-[100px]
            ${error ? 'border-red-500' : 'border-gray-700'}
            ${className}`}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : helperText ? (
            <p className="text-gray-500 text-sm">{helperText}</p>
          ) : <span />}
          {showCharCount && maxLength && (
            <span className={`text-xs ${charCount >= maxLength ? 'text-red-400' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
