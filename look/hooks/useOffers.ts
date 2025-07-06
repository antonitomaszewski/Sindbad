import { useState, useEffect } from 'react';
import { getOffers } from '@/logic/lib/offers';
import { mapOffersToCalendarEvents } from '@/look/utils/eventMapper';
import { CALENDAR_TEXTS } from '@/look/constants/calendar';
import { CalendarEvent } from '@/look/types/calendar';

export function useOffers() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offers = await getOffers();
        const calendarEvents = mapOffersToCalendarEvents(offers);
        setEvents(calendarEvents);
      } catch (error) {
        console.error(CALENDAR_TEXTS.ERROR_LOADING, error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { events, loading };
}