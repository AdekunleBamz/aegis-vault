import React, { useState } from 'react';

/**
 * PR #7: Copy-to-clipboard functionality for addresses
 * Reusable copy button component with feedback
 */
interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  label?: string;
  copiedLabel?: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ text, label = 'Copy', copiedLabel = 'Copied!', ...props }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
          throw new Error('Clipboard not available');
        }
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleCopy}
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-lg
          transition-all duration-200
          ${copied
            ? 'bg-green-500/20 border border-green-500/50 text-green-400'
            : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-gray-300 hover:text-white'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
        {...props}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {copiedLabel}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v2h2V4a3 3 0 00-3-3H9a3 3 0 00-3 3v2h2V3z" />
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm10 0H5v10h10V5z" clipRule="evenodd" />
            </svg>
            {label}
          </>
        )}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';
