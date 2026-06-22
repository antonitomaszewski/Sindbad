'use client';
import Link from 'next/link';
import {formatDate} from '@/look/utils/dateFormatter';
import { Offer } from '../../../logic/types/offer';
import { CalendarIcon, LocationIcon, UsersIcon, UserIcon } from './Icons';
import { getCountryName } from '../../../logic/constants/countries';

interface OfferCardProps {
  offer: Offer;
  coverUrl: string | null;
  organizerName: string;
}

export default function OfferCard({ offer, coverUrl, organizerName }: OfferCardProps) {
  const dateFrom = formatDate(offer.date_from);
  const dateTo = formatDate(offer.date_to);
  const date = dateFrom ? `${dateFrom}${dateTo && dateTo !== dateFrom ? ' – ' + dateTo : ''}` : '';
  const currency = offer.currency || 'zł';
  const price = offer.price_per_person ? `${offer.price_per_person} ${currency}` : '—';
  const seatsInfo = offer.seats_available != null && offer.seats_total 
    ? `${offer.seats_available} z ${offer.seats_total}` 
    : '—';

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <div className="h-44 bg-gray-100">
        {coverUrl ? (
          <img src={coverUrl} alt={offer.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Brak zdjęcia
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-1">{offer.title}</h3>

        <div className="text-sm text-gray-600 flex items-center gap-1">
          <LocationIcon />
          <span className="line-clamp-1">
            {offer.port ?? '—'} • {offer.country ? getCountryName(offer.country) : '—'}
          </span>
        </div>

        {date && (
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <CalendarIcon />
            <span>{date}</span>
          </div>
        )}

        <div className="text-sm text-gray-600 flex items-center gap-1">
          <UsersIcon />
          <span>Wolne miejsca: {seatsInfo}</span>
        </div>

        {organizerName && (
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <UserIcon />
            <span className="line-clamp-1">{organizerName}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-main font-semibold text-lg">{price}</div>
          <Link 
            href={`/oferta/${offer.id}`} 
            className="bg-main text-white px-4 py-2 rounded hover-bg-main transition-colors"
          >
            Szczegóły
          </Link>
        </div>
      </div>
    </div>
  );
}