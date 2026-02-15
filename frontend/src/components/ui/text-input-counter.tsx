import React, { useState, useEffect } from 'react';

/**
 * PR #6: Character counter for text fields
 * Text input with character/word counter
 */
interface TextInputWithCounterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  maxLength?: number;
  showWords?: boolean;
  error?: string;
}

export const TextInputWithCounter = React.forwardRef<HTMLInputElement, TextInputWithCounterProps>(
  ({ label, maxLength, showWords = false, error, ...props }, ref) => {
    const [count, setCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setCount(text.length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      props.onChange?.(e);
    };

    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
        <input
          ref={ref}
          type="text"
          maxLength={maxLength}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all
            bg-gray-900 text-white placeholder-gray-500
            ${error ? 'border-red-500/50' : 'border-gray-700'}
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
          `}
          {...props}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>
            {count} character{count !== 1 ? 's' : ''}
            {maxLength && ` / ${maxLength}`}
          </span>
          {showWords && <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>}
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

TextInputWithCounter.displayName = 'TextInputWithCounter';
