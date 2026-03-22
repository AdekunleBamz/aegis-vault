'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Represents the state of a multi-step form.
 */
export interface StepFormState {
  /** The index of the current active step (0-indexed) */
  currentStep: number;
  /** The total number of steps in the form */
  totalSteps: number;
  /** Aggregated data from all completed steps */
  data: Record<string, unknown>;
  /** Indices of steps that have been successfully validated/completed */
  completedSteps: number[];
  /** Errors associated with specific steps */
  errors: Record<number, string>;
}

/**
 * A custom hook to manage the state and navigation of a multi-step form.
 * 
 * @param totalSteps - The total number of steps in the form
 * @returns An object containing step state, navigation functions, and progress info
 */
export function useStepForm(totalSteps: number) {
  const [state, setState] = useState<StepFormState>({
    currentStep: 0,
    totalSteps,
    data: {},
    completedSteps: [],
    errors: {},
  });

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep < totalSteps - 1) {
        const newCompletedSteps = prev.completedSteps.includes(prev.currentStep)
          ? prev.completedSteps
          : [...prev.completedSteps, prev.currentStep];
        return {
          ...prev,
          currentStep: prev.currentStep + 1,
          completedSteps: newCompletedSteps,
        };
      }
      return prev;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep > 0) {
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
  }, []);

  const setStepData = useCallback((stepData: Record<string, unknown>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...stepData },
    }));
  }, []);

  const setStepError = useCallback((step: number, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [step]: error },
    }));
  }, []);

  const clearStepError = useCallback((step: number) => {
    setState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[step];
      return { ...prev, errors: newErrors };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      totalSteps,
      data: {},
      completedSteps: [],
      errors: {},
    });
  }, [totalSteps]);

  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === totalSteps - 1;
  const progress = ((state.currentStep + 1) / totalSteps) * 100;

  return {
    ...state,
    isFirstStep,
    isLastStep,
    progress,
    goToStep,
    nextStep,
    prevStep,
    setStepData,
    setStepError,
    clearStepError,
    reset,
  };
}

/**
 * Represents the state of an individual form field.
 */
export interface FieldState {
  /** The current string value of the field */
  value: string;
  /** Validation error message, or null if valid */
  error: string | null;
  /** Whether the field has been focused/blurred */
  touched: boolean;
  /** Whether the field value has changed from its initial state */
  dirty: boolean;
}

export type FormFields<T extends string> = Record<T, FieldState>;

/**
 * A custom hook to manage individual form fields, validation, and change tracking.
 * 
 * @template T - String literal union of field names
 * @param initialFields - Initial values for the form fields
 * @param validators - Optional validation functions for each field
 * @returns An object containing field states and management functions
 */
export function useFormFields<T extends string>(
  initialFields: Record<T, string>,
  validators?: Record<T, (value: string) => string | null>
) {
  const initialState = Object.keys(initialFields).reduce((acc, key) => {
    acc[key as T] = {
      value: initialFields[key as T],
      error: null,
      touched: false,
      dirty: false,
    };
    return acc;
  }, {} as FormFields<T>);

  const [fields, setFields] = useState<FormFields<T>>(initialState);

  const setFieldValue = useCallback((name: T, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        dirty: value !== initialFields[name],
      },
    }));
  }, [initialFields]);

  const setFieldTouched = useCallback((name: T) => {
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], touched: true },
    }));
  }, []);

  const setFieldError = useCallback((name: T, error: string | null) => {
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], error },
    }));
  }, []);

  const validateField = useCallback((name: T) => {
    const validator = validators?.[name];
    if (validator) {
      const error = validator(fields[name].value);
      setFieldError(name, error);
      return !error;
    }
    return true;
  }, [fields, validators, setFieldError]);

  const validateAll = useCallback(() => {
    let isValid = true;
    (Object.keys(fields) as T[]).forEach(name => {
      if (!validateField(name)) {
        isValid = false;
      }
    });
    return isValid;
  }, [fields, validateField]);

  const reset = useCallback(() => {
    setFields(initialState);
  }, [initialState]);

  const getValues = useCallback(() => {
    return (Object.keys(fields) as T[]).reduce((acc, key) => {
      acc[key] = fields[key].value;
      return acc;
    }, {} as Record<T, string>);
  }, [fields]);

  const fieldValues = Object.values(fields) as FieldState[];
  const hasErrors = fieldValues.some(field => field.error);
  const isDirty = fieldValues.some(field => field.dirty);
  const isTouched = fieldValues.some(field => field.touched);

  return {
    fields,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateAll,
    reset,
    getValues,
    hasErrors,
    isDirty,
    isTouched,
  };
}

/**
 * Represents the state of a form submission process.
 */
export interface SubmitState {
  /** Whether the form is currently being submitted */
  isSubmitting: boolean;
  /** Whether the form has been successfully submitted at least once */
  isSubmitted: boolean;
  /** The total number of successful submissions */
  submitCount: number;
  /** Top-level submission error message, or null */
  error: string | null;
}

/**
 * A custom hook to handle form submission logic, including loading states and callbacks.
 * 
 * @template T - The type of the data being submitted
 * @param onSubmit - Async function to perform the actual submission
 * @param options - Optional callbacks for success/error and behavior toggles
 * @returns An object containing submission state and the handler function
 */
export function useFormSubmit<T>(
  onSubmit: (data: T) => Promise<void>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    resetOnSuccess?: boolean;
  }
) {
  const [state, setState] = useState<SubmitState>({
    isSubmitting: false,
    isSubmitted: false,
    submitCount: 0,
    error: null,
  });

  const { onSuccess, onError, resetOnSuccess = false } = options || {};

  const handleSubmit = useCallback(async (data: T) => {
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));

    try {
      await onSubmit(data);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        submitCount: prev.submitCount + 1,
      }));
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
      }));
      onError?.(error as Error);
    }
  }, [onSubmit, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSubmitted: false,
      submitCount: 0,
      error: null,
    });
  }, []);

  return { ...state, handleSubmit, reset };
}

// Autosave hook
export function useAutosave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 2000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousData = useRef<T>(data);

  useEffect(() => {
    if (JSON.stringify(data) === JSON.stringify(previousData.current)) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      setError(null);

      try {
        await saveFn(data);
        setLastSaved(new Date());
        previousData.current = data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed');
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFn, delay]);

  return { isSaving, lastSaved, error };
}
