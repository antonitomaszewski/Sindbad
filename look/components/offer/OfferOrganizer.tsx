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
        <div className="space-y-3">
          <p className="text-gray font-medium">{organizerName || 'Ładowanie...'}</p>
          <Link 
            href={`/organizator/${organizerId}`}
            className="text-main hover:text-green-dark font-medium text-sm"
          >
            {OFFER_MESSAGES.VIEW_ORGANIZER}
          </Link>
        </div>
      )}
    </Card>
  );
}