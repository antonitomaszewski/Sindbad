import { Card } from '@/look/components/ui/Card';
import { OFFER_LABELS } from '@/look/constants/offer';
import { formatDateRange, getDuration } from '@/look/utils/dateFormatter';
import { getCountryName } from '@/logic/constants/countries';

interface OfferHeaderProps {
  title: string;
  location: string;
  price: string;
  dateFrom: string;
  dateTo: string;
  country?: string;
  port?: string;
  seatsAvailable?: number;
  yachtName?: string;
}

export function OfferHeader({ 
  title, 
  location, 
  price, 
  dateFrom, 
  dateTo, 
  country,
  port,
  seatsAvailable,
  yachtName
}: OfferHeaderProps) {
  const getSeatsLabel = (available?: number) => {
    if (available === undefined) return '';
    if (available === 0) return 'Brak dostepnych miejsc';
    if (available === 1) return '1 dostępne miejsce';
    if (available <= 4) return `${available} dostępne miejsca`;
    return `${available} dostępnych miejsc`;
  };

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
      
      <div className={`grid ${yachtName ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-4`}>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray mb-2">{OFFER_LABELS.TERM}</h3>
          <p className="text-main font-medium">{formatDateRange(dateFrom, dateTo)}</p>
          <p className="text-main font-medium">{getDuration(dateFrom, dateTo)} Dni</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray mb-2">{OFFER_LABELS.LOCATION}</h3>
          <div className="text-main">
            {country && <p>{getCountryName(country)}</p>}
            {port && <p>{port}</p>}
          </div>
        </div>

        {yachtName && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray mb-2">Jacht</h3>
            <p className="text-main font-medium">{yachtName}</p>
          </div>
        )}
      </div>

      {seatsAvailable !== undefined && (
        <div className="bg-main-soft border border-main-soft rounded-lg p-4">
          <p className="text-main font-medium">
            {getSeatsLabel(seatsAvailable)}
          </p>
        </div>
      )}
    </Card>
  );
}