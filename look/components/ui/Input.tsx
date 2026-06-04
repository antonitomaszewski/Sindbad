import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus-ring-main transition ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;