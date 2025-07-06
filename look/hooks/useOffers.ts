// look/hooks/useOffers.ts
import { useState, useEffect } from 'react';
import { getOffers } from '@/logic/lib/offers';

export function useOffers() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offers = await getOffers();
        const calendarEvents = offers.map((offer: any) => ({
          id: offer.id,
          title: offer.title,
          // date: offer.date_from,
          start: offer.date_from,    // ← Data początkowa
          end: offer.date_to,  
          allDay: true,
          backgroundColor: 'var(--green-main)',
          borderColor: 'var(--green-main)',
        }));
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Błąd pobierania ofert:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { events, loading };
}