import React from 'react';

/**
 * PR #4: Input focus states and visual feedback
 * Enhanced focus styles for form inputs
 */
export const enhancedInputStyles = {
  focusWithin: 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-950',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  inputBase: 'w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 transition-all duration-200',
  inputFocus: 'focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20',
  inputError: 'aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:shadow-red-500/20',
};

interface FocusableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FocusableInput = React.forwardRef<HTMLInputElement, FocusableInputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <input
        ref={ref}
        className={`
          ${enhancedInputStyles.inputBase}
          ${enhancedInputStyles.inputFocus}
          ${enhancedInputStyles.inputError}
        `}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
);

FocusableInput.displayName = 'FocusableInput';
