import { Card } from '@/look/components/ui/Card';
import { OFFER_LABELS } from '@/look/constants/offer';
import { formatDateRange } from '@/look/utils/dateFormatter';

interface OfferHeaderProps {
  title: string;
  location: string;
  price: string;
  dateFrom: string;
  dateTo: string;
}

export function OfferHeader({ title, location, price, dateFrom, dateTo }: OfferHeaderProps) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-main mb-2">{title}</h1>
          <p className="text-gray">{location}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-main">{price}</div>
          <div className="text-sm text-gray">{OFFER_LABELS.PER_PERSON}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray mb-2">{OFFER_LABELS.TERM}</h3>
        <p className="text-main font-medium">{formatDateRange(dateFrom, dateTo)}</p>
      </div>
    </Card>
  );
}