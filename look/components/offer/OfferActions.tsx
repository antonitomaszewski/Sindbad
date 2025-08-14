import { Card } from '@/look/components/ui/Card';
import { Button } from '@/look/components/ui/Button';
import { OFFER_LABELS, OFFER_MESSAGES } from '@/look/constants/offer';

interface OfferActionsProps {
  onReservation: () => void;
  onContact: () => void;
}

export function OfferActions({ onReservation, onContact }: OfferActionsProps) {
  return (
    <Card>
      <div className="flex gap-4">
        <Button onClick={onReservation} variant="primary">
          {OFFER_LABELS.SEND_RESERVATION}
        </Button>
        <Button onClick={onContact} variant="secondary">
          {OFFER_LABELS.ASK_QUESTION}
        </Button>
      </div>
    </Card>
  );
}