import React, { useState } from 'react';

/**
 * PR #5: Floating labels for form inputs
 * Form input component with animated floating labels
 */
interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, icon, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(!!props.value);
    const id = props.id || `floating-${Math.random()}`;

    return (
      <div>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setFilled(!!e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${icon ? 'pl-10' : ''}
              bg-gray-900 text-white
              ${error ? 'border-red-500/50' : 'border-gray-700'}
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
            `}
            {...props}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${icon ? 'left-10' : ''}
              ${(focused || filled) ? 'text-xs -top-2 bg-gray-950 px-1 text-blue-400' : 'text-sm top-1/2 -translate-y-1/2 text-gray-500'}
            `}
          >
            {label}
          </label>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';
