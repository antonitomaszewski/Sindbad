// pole tekstowe do opisu rejsu na 
// oferta/nowa
import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus-ring-main transition resize-none ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;