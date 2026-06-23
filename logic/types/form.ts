export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface FormState<T> {
  data: T;
  errors: ValidationErrors;
  loading: boolean;
  globalError: string;
}