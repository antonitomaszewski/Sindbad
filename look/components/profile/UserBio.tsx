import { Card } from '@/look/components/ui/Card';

export default function UserBio({ bio }: { bio?: string }) {
  return (
    <Card className="mb-0">
      <h2 className="text-lg font-medium mb-2">O mnie</h2>
      <p className="text-gray-700 text-sm">{bio ?? 'Użytkownik nie dodał opisu.'}</p>
    </Card>
  );
}