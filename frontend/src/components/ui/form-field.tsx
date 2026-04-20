import React, { InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  floatingLabel?: boolean;
  required?: boolean;
}

/**
 * PR #3: Field-level error messages with icons
 * Enhanced form input component with error display
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      floatingLabel = false,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = props.id || `input-${Math.random().toString(36).slice(2, 11)}`;

    return (
      <div className="w-full">
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              bg-gray-900 text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/50'
              }
              ${className}
            `}
            {...props}
          />

          {floatingLabel && label && (
            <label
              htmlFor={inputId}
              className={`
                absolute left-4 transition-all duration-200 pointer-events-none
                ${props.value ? 'text-xs top-1 text-gray-400' : 'text-sm top-1/2 -translate-y-1/2 text-gray-500'}
              `}
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <div id={`${inputId}-error`} className="flex items-center gap-1 mt-2 text-red-400 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
