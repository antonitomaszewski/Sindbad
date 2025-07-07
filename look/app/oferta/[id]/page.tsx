'use client';

export default function OfertaPage({ params }: { params: { id: string } }) {
  // Hardcoded dane (jak w kalendarzu)
  const offer = {
    id: params.id,
    title: "Rejs Chorwacja",
    description: "Piękny rejs po Adriatyku z przepięknymi widokami na wyspy i krystalicznie czystą wodę. Idealna przygoda dla miłośników żeglarstwa.",
    date_from: "2025-07-12",
    date_to: "2025-07-19",
    price: "1200 zł",
    location: "Split, Chorwacja",
    organizer: "Żeglarskie Przygody Sp. z o.o."
  };

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
            <p className="text-main font-medium">{offer.date_from} - {offer.date_to}</p>
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
          <p className="text-gray">{offer.organizer}</p>
        </div>

        {/* Akcje */}
        <div className="bg-white rounded-lg shadow-sm border border-gray p-6">
          <div className="flex gap-4">
            <button 
              onClick={() => alert('Rezerwacja!')}
              className="flex-1 bg-main text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-dark transition-colors"
            >
              Wyślij rezerwację
            </button>
            <button 
              onClick={() => alert('Kontakt!')}
              className="flex-1 bg-gray text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Zadaj pytanie
            </button>
          </div>
        </div>

        {/* Powrót do kalendarza */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.href = '/kalendarz'}
            className="text-main hover:text-green-dark font-medium"
          >
            ← Powrót do kalendarza
          </button>
        </div>

      </div>
    </div>
  );
}