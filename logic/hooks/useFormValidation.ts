// szablon walidacji
// używamy go w walidowaniu komponentów formularzy:
// 1. tworzenie oferty
// 2. edycja profilu uzytkownika
import { useState } from 'react';
import type { ValidationErrors } from '../types/form';

export function useFormValidation<T>(
  validateFn: (data: T) => ValidationErrors
) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  function validate(data: T): boolean {
    const validationErrors = validateFn(data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  function clearErrors() {
    setErrors({});
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }

  return { errors, validate, clearErrors, clearError };
}