// fullcalendar używa start i end, dlatego potrzebne jest mapowanie
export function mapOffersToCalendarEvents(offers: any[]) {
  return offers.map((offer: any) => ({
    id: offer.id,
    title: offer.title,
    start: offer.date_from,
    end: offer.date_to,
    description: offer.description
  }));
}