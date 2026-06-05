import Link from 'next/link';
import { Card } from '@/look/components/ui/Card';
import { OFFER_LABELS, OFFER_MESSAGES } from '@/look/constants/offer';

interface OfferOrganizerProps {
  organizerId: string;
  organizerName?: string;
  isLoading: boolean;
}

export function OfferOrganizer({ organizerId, organizerName, isLoading }: OfferOrganizerProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-main mb-4">{OFFER_LABELS.ORGANIZER}</h2>
      {isLoading ? (
        <p className="text-gray">{OFFER_MESSAGES.ORGANIZER_LOADING}</p>
      ) : (
        <Link
          href={`/profil/${organizerId}`}
          className="text-gray-900 font-medium hover:underline"
        >
          {organizerName || 'Ładowanie...'}
        </Link>
      )}
    </Card>
  );
}