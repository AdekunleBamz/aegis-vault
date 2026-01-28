import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-400 text-sm mb-2">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full bg-gray-900 border ${
              error ? 'border-red-500' : 'border-gray-700'
            } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors ${className}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
