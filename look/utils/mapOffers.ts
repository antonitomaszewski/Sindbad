// Funkcje pomocnicze dla ofert na mapie.
// Przygotowują geo i filtrują widoczne rejsy.

import type { Offer } from '@/logic/types/offer';

export type GeoPoint = {
  lat: number;
  lon: number;
};

export type OfferWithGeo = {
  offer: Offer;
  geo: GeoPoint;
};

type MapOfferFilters = {
  offers: OfferWithGeo[];
  priceMin: number | '';
  priceMax: number | '';
  dateFrom?: string;
  dateTo?: string;
};

function parseGeo(geoRaw: unknown): GeoPoint | null {
  if (!geoRaw) return null;

  const geo = typeof geoRaw === 'string' ? JSON.parse(geoRaw) : geoRaw;
  const candidate = geo as { lat?: unknown; lon?: unknown };

  if (candidate.lat == null || candidate.lon == null) return null;

  return {
    lat: Number(candidate.lat),
    lon: Number(candidate.lon),
  };
}

function getOfferPrice(offer: Offer): number | null {
  return offer.price_per_person == null ? null : Number(offer.price_per_person);
}

export function getOffersWithGeo(offers: Offer[]): OfferWithGeo[] {
  return offers
    .map((offer) => {
      const geo = parseGeo(offer.geo);
      return geo ? { offer, geo } : null;
    })
    .filter((entry): entry is OfferWithGeo => Boolean(entry));
}

export function filterMapOffers({
  offers,
  priceMin,
  priceMax,
  dateFrom,
  dateTo,
}: MapOfferFilters): OfferWithGeo[] {
  return offers.filter(({ offer }) => {
    const offerPrice = getOfferPrice(offer);

    if ((priceMin !== '' || priceMax !== '') && offerPrice === null) return false;
    if (priceMin !== '' && offerPrice !== null && offerPrice < priceMin) return false;
    if (priceMax !== '' && offerPrice !== null && offerPrice > priceMax) return false;

    const offerStart = offer.date_from?.slice(0, 10);
    const offerEnd = offer.date_to?.slice(0, 10);

    if (dateFrom && (!offerEnd || offerEnd < dateFrom)) return false;
    if (dateTo && (!offerStart || offerStart > dateTo)) return false;

    return true;
  });
}