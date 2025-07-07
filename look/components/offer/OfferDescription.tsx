import { Card } from '@/look/components/ui/Card';
import { OFFER_LABELS } from '@/look/constants/offer';

interface OfferDescriptionProps {
  description: string;
}

export function OfferDescription({ description }: OfferDescriptionProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-main mb-4">{OFFER_LABELS.DESCRIPTION}</h2>
      <p className="text-gray leading-relaxed">{description}</p>
    </Card>
  );
}