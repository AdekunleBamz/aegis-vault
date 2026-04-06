import React from 'react';

export interface UseFormFocusReturn {
  focusedField: string | null;
  registerField: (fieldName: string, element: HTMLInputElement | null) => void;
  focusField: (fieldName: string) => void;
  focusNext: (currentField: string) => void;
  focusPrevious: (currentField: string) => void;
}

/**
 * PR #9: Auto-focus management in forms
 * Hook for managing form field focus order
 */
export function useFormFocus(): UseFormFocusReturn {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const fieldsRef = React.useRef<Record<string, HTMLInputElement | null>>({});

  const registerField = (fieldName: string, element: HTMLInputElement | null): void => {
    if (element) {
      fieldsRef.current[fieldName] = element;
    }
  };

  const focusField = (fieldName: string): void => {
    fieldsRef.current[fieldName]?.focus();
    setFocusedField(fieldName);
  };

  const focusNext = (currentField: string): void => {
    const fields = Object.keys(fieldsRef.current);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      focusField(fields[currentIndex + 1]);
    }
  };

  const focusPrevious = (currentField: string): void => {
    const fields = Object.keys(fieldsRef.current);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex > 0) {
      focusField(fields[currentIndex - 1]);
    }
  };

  return { focusedField, registerField, focusField, focusNext, focusPrevious };
}
