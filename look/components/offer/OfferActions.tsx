import { Card } from '@/look/components/ui/Card';
import { Button } from '@/look/components/ui/Button';
import { OFFER_LABELS, OFFER_MESSAGES } from '@/look/constants/offer';

interface OfferActionsProps {
  onReservation: () => void;
  onContact: () => void;
  canReserve?: boolean;
}

export function OfferActions({ onReservation, onContact, canReserve = true }: OfferActionsProps) {
  return (
    <Card>
      <div className="flex gap-4">
        <Button
          onClick={onReservation}
          variant="primary"
          disabled={!canReserve}
          className={!canReserve ? 'opacity-50 cursor-not-allowed hover:bg-main' : ''}
        >
          {OFFER_LABELS.SEND_RESERVATION}
        </Button>
        <Button onClick={onContact} variant="secondary">
          {OFFER_LABELS.ASK_QUESTION}
        </Button>
      </div>
    </Card>
  );
}