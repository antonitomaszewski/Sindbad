'use client';
import OfferCard from './OfferCard';
import { Offer } from '../../../logic/types/offer';
// plik z wyświetlaniem kafelków wyszukiwania
// zazwyczaj 3xN

interface SearchResultsProps {
  results: Offer[];
  loading: boolean;
  offerImages: Map<string, string>;
  organizers: Map<string, string>;
}

export default function SearchResults({ results, loading, offerImages, organizers }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Ładowanie...</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Brak wyników wyszukiwania.</div>
      </div>
    );
  }

  return (
    // działa także na telefon
    // na małym ekranie 1 kolumn
    // potem 2
    // potem 3
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          coverUrl={offerImages.get(offer.id) ?? null}
          organizerName={organizers.get(offer.organizer_id ?? '') ?? ''}
        />
      ))}
    </div>
  );
}