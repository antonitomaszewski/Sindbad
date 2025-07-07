interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray">{message}</p>
        </div>
      </div>
    </div>
  );
}