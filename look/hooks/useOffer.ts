import { useState, useEffect } from 'react';
import { getOfferById } from '@/logic/lib/offers';

export function useOffer(id: string) {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const offerData = await getOfferById(id);
        setOffer(offerData);
      } catch (err) {
        setError('Nie udało się załadować oferty');
        console.error('Błąd pobierania oferty:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  return { offer, loading, error };
}