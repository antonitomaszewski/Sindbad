import { CALENDAR_CONFIG } from '@/look/constants/calendar';

export function mapOffersToCalendarEvents(offers: any[]) {
  return offers.map((offer: any) => ({
    id: offer.id,
    title: offer.title,
    start: offer.date_from,
    end: offer.date_to,
    allDay: true,
    backgroundColor: CALENDAR_CONFIG.EVENT_COLORS.BACKGROUND,
    borderColor: CALENDAR_CONFIG.EVENT_COLORS.BORDER,
  }));
}