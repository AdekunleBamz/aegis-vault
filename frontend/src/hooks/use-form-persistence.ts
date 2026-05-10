import React from 'react';

/**
 * Hook for managing form state with localStorage auto-save.
 * Persists field values across page reloads using a namespaced key.
 */
export type FormState = Record<string, unknown>;

/** Return value of the useFormPersistence hook. */
export interface UseFormPersistenceReturn {
  values: FormState;
  updateField: (fieldName: string, value: unknown) => void;
  clearForm: () => void;
  restoreForm: () => void;
  setValues: React.Dispatch<React.SetStateAction<FormState>>;
  /** True when the in-memory state has diverged from localStorage (i.e. unsaved changes) */
  isDirty: boolean;
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

  const [savedValues, setSavedValues] = React.useState<FormState>(values);

  const updateField = React.useCallback((fieldName: string, value: unknown): void => {
    setValues((prev) => {
      const updated = { ...prev, [fieldName]: value };
      localStorage.setItem(`form_${formKey}`, JSON.stringify(updated));
      setSavedValues(updated);
      return updated;
    });
  }, [formKey]);

  const clearForm = React.useCallback((): void => {
    setValues(initialState);
    setSavedValues(initialState);
    localStorage.removeItem(`form_${formKey}`);
  }, [formKey, initialState]);

  const restoreForm = React.useCallback((): void => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`form_${formKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValues(parsed);
        setSavedValues(parsed);
      }
    }
  }, [formKey]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(savedValues);

  return { values, updateField, clearForm, restoreForm, setValues, isDirty };
}
