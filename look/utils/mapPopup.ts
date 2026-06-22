// HTML popupu po kliknięciu pinezki.

import { getCountryName } from '@/logic/constants/countries';
import type { Offer } from '@/logic/types/offer';
import { formatDateRange } from '@/look/utils/dateFormatter';

export function buildOfferPopupHtml(offer: Offer): string {
  const title = offer.title || 'Rejs';
  const port = offer.port || 'Port niepodany';
  const country = offer.country ? getCountryName(offer.country) : 'Kraj niepodany';
  const dateRange = formatDateRange(offer.date_from, offer.date_to) || '-';

  return `<div style="min-width:220px">
    <strong>${title}</strong><br/>
    <span>${port}, ${country}</span><br/>
    <span>${dateRange}</span><br/>
    <a href="/oferta/${offer.id}" style="display:inline-block;margin-top:8px;color:#2563eb">Zobacz ofertę</a>
  </div>`;
}