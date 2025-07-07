'use client';
import { useOffer } from '@/look/hooks/useOffer';
import { useUser } from '@/look/hooks/useUser';
import { use } from 'react';
import Link from 'next/link';

export default function OfertaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { offer, loading, error } = useOffer(id);
  const { user: organizer, loading: organizerLoading } = useUser(offer?.organizer_id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray">Ładowanie oferty...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray mb-4">404</h1>
          <h2 className="text-2xl font-bold text-main mb-4">Oferta nie została znaleziona</h2>
          <p className="text-gray mb-6">Sprawdź czy adres jest poprawny lub wybierz inną ofertę z kalendarza.</p>
          <button 
            onClick={() => window.location.href = '/kalendarz'}
            className="bg-main text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-dark transition-colors"
          >
            Powrót do kalendarza
          </button>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Header sekcja */}
        <div className="bg-white rounded-lg shadow-sm border border-gray p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">{offer.title}</h1>
              <p className="text-gray">{offer.location}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-main">{offer.price}</div>
              <div className="text-sm text-gray">za osobę</div>
            </div>
          </div>
          
          {/* Daty */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray mb-2">Termin:</h3>
            <p className="text-main font-medium">{new Date(offer.date_from).toLocaleDateString()} - {new Date(offer.date_to).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Opis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray p-6 mb-6">
          <h2 className="text-xl font-bold text-main mb-4">Opis</h2>
          <p className="text-gray leading-relaxed">{offer.description}</p>
        </div>

        {/* Organizator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray p-6 mb-6">
          <h2 className="text-xl font-bold text-main mb-4">Organizator</h2>
          {organizerLoading ? (
            <p className="text-gray">Ładowanie danych organizatora...</p>
          ) : (
            <div className="space-y-3">
              <p className="text-gray font-medium">{organizer?.name || 'Ładowanie...'}</p>
              <Link 
                href={`/organizator/${offer.organizer_id}`}
                className="text-main hover:text-green-dark font-medium text-sm"
              >
                → Przejdź do profilu organizatora
              </Link>
            </div>
          )}
        </div>

        {/* Akcje */}
        <div className="bg-white rounded-lg shadow-sm border border-gray p-6">
          <div className="flex gap-4">
            <button 
              onClick={() => alert('Rezerwacja!')}
              className="flex-1 bg-main text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-dark transition-colors cursor-pointer"
            >
              Wyślij rezerwację
            </button>
            <button 
              onClick={() => alert('Kontakt!')}
              className="flex-1 bg-white border-2 border-gray text-gray py-3 px-6 rounded-lg font-semibold hover:bg-gray hover:text-white transition-colors cursor-pointer"
            >
              Zadaj pytanie
            </button>
          </div>
        </div>

        {/* Powrót do kalendarza */}
        <div className="mt-6 text-center">
          <Link 
            href="/kalendarz"
            className="text-main hover:text-green-dark font-medium"
          >
            ← Powrót do kalendarza
          </Link>
        </div>

      </div>
    </div>
  );
}