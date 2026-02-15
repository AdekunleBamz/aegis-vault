import React, { useState } from 'react';

/**
 * PR #8: Input masking for amounts
 * Format input as user types (e.g., currency formatting)
 */
interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask?: 'currency' | 'phone' | 'custom';
  placeholder?: string;
  onChange?: (value: string, rawValue: string) => void;
}

const formatCurrency = (value: string): { formatted: string; raw: string } => {
  const raw = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(raw) || 0;
  return {
    formatted: num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }),
    raw,
  };
};

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask = 'currency', onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { formatted, raw } = formatCurrency(e.target.value);
      setDisplayValue(formatted);
      onChange?.(formatted, raw);
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        className={`
          w-full px-4 py-3 rounded-lg border border-gray-700
          bg-gray-900 text-white placeholder-gray-500
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
          transition-all
        `}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';
