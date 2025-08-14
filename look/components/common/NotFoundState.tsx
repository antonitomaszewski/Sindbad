import Link from 'next/link';

interface NotFoundStateProps {
  title: string;
  message: string;
  description: string;
  backUrl: string;
  backText: string;
}

export function NotFoundState({ title, message, description, backUrl, backText }: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray mb-4">{title}</h1>
          <h2 className="text-2xl font-bold text-main mb-4">{message}</h2>
          <p className="text-gray mb-6">{description}</p>
          <Link 
            href={backUrl}
            className="inline-block bg-main text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-dark transition-colors cursor-pointer"
          >
            {backText}
          </Link>
        </div>
      </div>
    </div>
  );
}