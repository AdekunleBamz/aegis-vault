import React from 'react';

/**
 * PR #10: Form submission state persistence
 * Hook for managing form state and auto-save
 */
interface FormState {
  [key: string]: any;
}

export function useFormPersistence(formKey: string, initialState: FormState = {}) {
  const [values, setValues] = React.useState<FormState>(() => {
    if (typeof window === 'undefined') return initialState;
    const saved = localStorage.getItem(`form_${formKey}`);
    return saved ? JSON.parse(saved) : initialState;
  });

  const updateField = React.useCallback((fieldName: string, value: any) => {
    setValues((prev) => {
      const updated = { ...prev, [fieldName]: value };
      localStorage.setItem(`form_${formKey}`, JSON.stringify(updated));
      return updated;
    });
  }, [formKey]);

  const clearForm = React.useCallback(() => {
    setValues(initialState);
    localStorage.removeItem(`form_${formKey}`);
  }, [formKey, initialState]);

  const restoreForm = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`form_${formKey}`);
      if (saved) setValues(JSON.parse(saved));
    }
  }, [formKey]);

  return { values, updateField, clearForm, restoreForm, setValues };
}
