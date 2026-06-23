// Wspólny komponent div.
// Daje białe tło, zaokrąglenie, cień, obramowanie i odstępy.

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 ${className}`}>
      {children}
    </div>
  );
}