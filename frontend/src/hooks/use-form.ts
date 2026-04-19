'use client';

/**
 * @file Form hooks for Aegis Vault
 *
 * Provides reusable hooks for form management: multi-step forms,
 * field management, form submission, and autosave functionality.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * State management for multi-step forms.
 */
export interface StepFormState {
  /** The current step index (0-based) */
  currentStep: number;
  /** Total number of steps in the form */
  totalSteps: number;
  /** Data collected from all steps */
  data: Record<string, unknown>;
  /** Array of completed step indices */
  completedSteps: number[];
  /** Error messages keyed by step index */
  errors: Record<number, string>;
}

/**
 * Return type for the useStepForm hook.
 */
export interface UseStepFormReturn extends StepFormState {
  /** Whether the current step is the first step */
  isFirstStep: boolean;
  /** Whether the current step is the last step */
  isLastStep: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Navigate to a specific step */
  goToStep: (step: number) => void;
  /** Advance to the next step */
  nextStep: () => void;
  /** Go back to the previous step */
  prevStep: () => void;
  /** Set data for the current step */
  setStepData: (stepData: Record<string, unknown>) => void;
  /** Set an error message for a step */
  setStepError: (step: number, error: string) => void;
  /** Clear the error message for a step */
  clearStepError: (step: number) => void;
  /** Reset the form to initial state */
  reset: () => void;
}

/**
 * Hook for managing multi-step form state.
 *
 * @param totalSteps - Total number of steps in the form
 * @returns Object containing step state and navigation functions
 */
export function useStepForm(totalSteps: number): UseStepFormReturn {
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
 * State for a single form field.
 */
export interface FieldState {
  /** The current field value */
  value: string;
  /** Validation error message, or null if valid */
  error: string | null;
  /** Whether the field has been touched/blurred */
  touched: boolean;
  /** Whether the field value has changed from initial */
  dirty: boolean;
}

/**
 * Collection of form fields keyed by field name.
 */
export type FormFields<T extends string> = Record<T, FieldState>;

/**
 * Return type for the useFormFields hook.
 */
export interface UseFormFieldsReturn<T extends string> {
  /** The form fields state */
  fields: FormFields<T>;
  /** Set the value of a field */
  setFieldValue: (name: T, value: string) => void;
  /** Mark a field as touched */
  setFieldTouched: (name: T) => void;
  /** Set an error message for a field */
  setFieldError: (name: T, error: string | null) => void;
  /** Validate a single field */
  validateField: (name: T) => boolean;
  /** Validate all fields */
  validateAll: () => boolean;
  /** Reset all fields to initial values */
  reset: () => void;
  /** Get all field values as a plain object */
  getValues: () => Record<T, string>;
  /** Whether any field has an error */
  hasErrors: boolean;
  /** Whether any field has been modified */
  isDirty: boolean;
  /** Whether any field has been touched */
  isTouched: boolean;
}

/**
 * Hook for managing form field state with validation.
 *
 * @param initialFields - Initial field values
 * @param validators - Optional validation functions for each field
 * @returns Object containing fields state and manipulation functions
 */
export function useFormFields<T extends string>(
  initialFields: Record<T, string>,
  validators?: Record<T, (value: string) => string | null>
): UseFormFieldsReturn<T> {
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
 * State for form submission tracking.
 */
export interface SubmitState {
  /** Whether a submission is currently in progress */
  isSubmitting: boolean;
  /** Whether the form has been successfully submitted */
  isSubmitted: boolean;
  /** Number of successful submissions */
  submitCount: number;
  /** Error message from the last failed submission */
  error: string | null;
}

/**
 * Return type for the useFormSubmit hook.
 */
export interface UseFormSubmitReturn<T> {
  /** Whether a submission is currently in progress */
  isSubmitting: boolean;
  /** Whether the form has been successfully submitted */
  isSubmitted: boolean;
  /** Number of successful submissions */
  submitCount: number;
  /** Error message from the last failed submission */
  error: string | null;
  /** Function to handle form submission */
  handleSubmit: (data: T) => Promise<void>;
  /** Reset submission state */
  reset: () => void;
}

/**
 * Hook for handling form submission with loading and error states.
 *
 * @param onSubmit - The function to call with form data
 * @param options - Optional callbacks for success/error and reset behavior
 * @returns Object containing submission state and handleSubmit function
 */
export function useFormSubmit<T>(
  onSubmit: (data: T) => Promise<void>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    resetOnSuccess?: boolean;
  }
): UseFormSubmitReturn<T> {
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

/**
 * Return type for the useAutosave hook.
 */
export interface UseAutosaveReturn {
  /** Whether a save operation is currently in progress */
  isSaving: boolean;
  /** Timestamp of the last successful save */
  lastSaved: Date | null;
  /** Error message from the last failed save */
  error: string | null;
}

/**
 * Hook for automatically saving data after a debounce delay.
 *
 * @param data - The data to save
 * @param saveFn - The function that performs the save operation
 * @param delay - Debounce delay in milliseconds (default: 2000)
 * @returns Object containing save state information
 */
export function useAutosave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 2000
): UseAutosaveReturn {
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
