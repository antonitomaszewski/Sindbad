import Link from 'next/link';
import { Card } from '@/look/components/ui/Card';
import type { OfferParticipant } from '@/logic/types/booking';

interface OfferParticipantsProps {
  participants: OfferParticipant[];
  isLoading: boolean;
}

export function OfferParticipants({ participants, isLoading }: OfferParticipantsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-main mb-3">Zapisani użytkownicy</h3>

      {isLoading && <p className="text-gray-500">Ładowanie uczestników...</p>}

      {!isLoading && participants.length === 0 && (
        <p className="text-gray-600">Brak potwierdzonych uczestników.</p>
      )}

      {!isLoading && participants.length > 0 && (
        <ul className="space-y-2">
          {participants.map((participant) => (
            <li key={participant.userId}>
              <Link
                href={`/profil/${participant.userId}`}
                className="text-main hover:underline font-medium"
              >
                {participant.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}