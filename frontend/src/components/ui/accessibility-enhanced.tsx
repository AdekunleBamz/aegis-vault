import React from 'react';

/**
 * PR #26: ARIA labels and descriptions
 * Component wrapper for improved accessibility
 */
interface AccessibleFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactElement;
  required?: boolean;
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  label,
  description,
  error,
  children,
  required = false,
}) => {
  const id = `field-${Math.random().toString(36).substr(2, 9)}`;
  const describedBy = [description && `${id}-desc`, error && `${id}-error`]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {React.cloneElement(children, {
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': !!error,
        'aria-required': required,
      })}
      {description && (
        <p id={`${id}-desc`} className="text-xs text-gray-400">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * PR #27: Keyboard navigation
 */
export const KeyboardNavigationWrapper: React.FC<{
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
}> = ({ children, onEscape, onEnter }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
    }
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return <div onKeyDown={handleKeyDown}>{children}</div>;
};

/**
 * PR #28: Focus visible styles
 */
export const focusVisibleStyles = `
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-blue-500
  focus-visible:ring-offset-2
  focus-visible:ring-offset-gray-950
`;

/**
 * PR #30: Color contrast utilities
 */
export const contrastClasses = {
  text: {
    high: 'text-white', // High contrast
    medium: 'text-gray-100', // Medium contrast
    low: 'text-gray-300', // Lower contrast (use for secondary text)
  },
  bg: {
    dark: 'bg-gray-950', // Darkest background
    darker: 'bg-gray-900', // Dark background
  },
};

/**
 * PR #31: Reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
