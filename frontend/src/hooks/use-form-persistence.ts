import React from 'react';

/**
 * PR #10: Form submission state persistence
 * Hook for managing form state and auto-save
 */
export type FormState = Record<string, unknown>;

export interface UseFormPersistenceReturn {
  values: FormState;
  updateField: (fieldName: string, value: unknown) => void;
  clearForm: () => void;
  restoreForm: () => void;
  setValues: React.Dispatch<React.SetStateAction<FormState>>;
}

export function useFormPersistence(
  formKey: string,
  initialState: FormState = {}
): UseFormPersistenceReturn {
  const [values, setValues] = React.useState<FormState>(() => {
    if (typeof window === 'undefined') return initialState;
    const saved = localStorage.getItem(`form_${formKey}`);
    return saved ? JSON.parse(saved) : initialState;
  });

  const updateField = React.useCallback((fieldName: string, value: unknown): void => {
    setValues((prev) => {
      const updated = { ...prev, [fieldName]: value };
      localStorage.setItem(`form_${formKey}`, JSON.stringify(updated));
      return updated;
    });
  }, [formKey]);

  const clearForm = React.useCallback((): void => {
    setValues(initialState);
    localStorage.removeItem(`form_${formKey}`);
  }, [formKey, initialState]);

  const restoreForm = React.useCallback((): void => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`form_${formKey}`);
      if (saved) setValues(JSON.parse(saved));
    }
  }, [formKey]);

  return { values, updateField, clearForm, restoreForm, setValues };
}
