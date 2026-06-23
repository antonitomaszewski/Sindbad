// Hook pobierający oferty dla mapy.

import { useEffect, useState } from 'react';
import { getOffers } from '@/logic/lib/offers';
import type { Offer } from '@/logic/types/offer';

export function useMapOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadOffers() {
      try {
        setLoading(true);
        setError('');
        const data = await getOffers();
        if (!cancelled) setOffers(data);
      } catch {
        if (!cancelled) setError('Nie udało się pobrać ofert do mapy.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  return { offers, loading, error };
}