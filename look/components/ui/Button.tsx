interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  disabled = false 
}: ButtonProps) {
  const baseStyles = "flex-1 py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer";
  const variants = {
    primary: "bg-main text-white hover:bg-green-dark",
    secondary: "bg-white border-2 border-gray text-gray hover:bg-gray hover:text-white"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}