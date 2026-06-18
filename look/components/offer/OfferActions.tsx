import { Card } from '@/look/components/ui/Card';
import { Button } from '@/look/components/ui/Button';
import { OFFER_LABELS } from '@/look/constants/offer';
import { CreateTripAlertButton } from '@/look/components/trip-alerts/CreateTripAlertButton';
import type { Offer } from '@/logic/types/offer';

interface OfferActionsProps {
  onReservation: () => void;
  onContact: () => void;
  offer: Offer;
  canReserve?: boolean;
}

export function OfferActions({ onReservation, onContact, offer, canReserve = true }: OfferActionsProps) {
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
        <CreateTripAlertButton
          offer={offer}
          label={OFFER_LABELS.NOTIFY_SIMILAR}
          showIcon={false}
          fullWidth
          className="border-2 border-gray text-gray hover:bg-gray hover:text-white font-semibold"
        />
      </div>
    </Card>
  );
}