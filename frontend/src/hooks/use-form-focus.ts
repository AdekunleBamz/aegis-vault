import React from 'react';

/**
 * PR #9: Auto-focus management in forms
 * Hook for managing form field focus order
 */
export function useFormFocus() {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const fieldsRef = React.useRef<Record<string, HTMLInputElement | null>>({});

  const registerField = (fieldName: string, element: HTMLInputElement | null) => {
    if (element) {
      fieldsRef.current[fieldName] = element;
    }
  };

  const focusField = (fieldName: string) => {
    fieldsRef.current[fieldName]?.focus();
    setFocusedField(fieldName);
  };

  const focusNext = (currentField: string) => {
    const fields = Object.keys(fieldsRef.current);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      focusField(fields[currentIndex + 1]);
    }
  };

  const focusPrevious = (currentField: string) => {
    const fields = Object.keys(fieldsRef.current);
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex > 0) {
      focusField(fields[currentIndex - 1]);
    }
  };

  return { focusedField, registerField, focusField, focusNext, focusPrevious };
}
