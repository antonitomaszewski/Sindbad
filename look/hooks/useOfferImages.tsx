// look/hooks/useOfferImages.ts
import { useState, useEffect } from 'react';
import { getOfferImages } from '@/logic/lib/images';
import { OfferImage } from '@/logic/types/image';

export function useOfferImages(offerId: string | null) {
  const [images, setImages] = useState<OfferImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!offerId) {
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        setLoading(true);
        const imagesList = await getOfferImages(offerId);
        setImages(imagesList);
        setError(null);
      } catch (err) {
        console.error('Błąd ładowania zdjęć:', err);
        setError('Nie udało się załadować zdjęć');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [offerId]);

  return { images, loading, error };
}