'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OfferBasicInfo from './OfferBasicInfo';
import OfferDatePicker from './OfferDatePicker';
import OfferLocation from './OfferLocation';
import OfferPricing from './OfferPricing';
import OfferSeats from './OfferSeats';
import OfferImageUpload from './OfferImageUpload';
import { createOffer } from '../../../logic/lib/offers';
import { uploadOfferImages } from '../../../logic/lib/images';
import { validateOfferForm } from '../../../logic/lib/validation';
import { getCurrentUser } from '../../../logic/lib/users';
import type { OfferFormData, ValidationErrors } from '../../../logic/types/offer';

interface Props {
  countries: { code: string; name: string; namePL: string }[];
}

export default function CreateOfferForm({ countries }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    description: '',
    date_from: null,
    date_to: null,
    country: '',
    port: '',
    price_per_person: '',
    currency: 'PLN',
    seats_total: '',
    seats_available: '',
    images: [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');
    setErrors({});

    // Sprawdź czy zalogowany
    const user = getCurrentUser();
    if (!user) {
      setGlobalError('Musisz być zalogowany aby dodać ofertę');
      router.push('/logowanie');
      return;
    }

    // Walidacja
    const validationErrors = validateOfferForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Konwersja formData → Offer (typy kompatybilne z API)
      const offerData: any = {
        organizer_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date_from: formData.date_from!.toISOString().split('T')[0], // "2026-07-15"
        date_to: formData.date_to!.toISOString().split('T')[0],
        country: formData.country,
        port: formData.port.trim(),
        currency: formData.currency,
      };

      // Opcjonalne pola (tylko jeśli wypełnione)
      if (formData.price_per_person) {
        offerData.price_per_person = Number(formData.price_per_person);
      }
      if (formData.seats_total) {
        offerData.seats_total = Number(formData.seats_total);
      }
      if (formData.seats_available) {
        offerData.seats_available = Number(formData.seats_available);
      }

      // Utwórz ofertę
      const newOffer = await createOffer(offerData);

      // Upload zdjęć (jeśli są)
      if (formData.images.length > 0 && newOffer.id) {
        try {
          await uploadOfferImages(newOffer.id, formData.images);
        } catch (imgError) {
          console.warn('Failed to upload images:', imgError);
          // Nie blokujemy - oferta jest już utworzona
        }
      }

      // Sukces - przekieruj do szczegółów nowo utworzonej oferty
      router.push(`/oferta/${newOffer.id}`);
    } catch (error: any) {
      console.error('Create offer error:', error);
      setGlobalError(error.message || 'Nie udało się utworzyć oferty. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Global Error */}
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {globalError}
        </div>
      )}

      {/* Sekcje formularza */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Podstawowe informacje</h2>
        <OfferBasicInfo
          title={formData.title}
          description={formData.description}
          onTitleChange={(value) => setFormData({ ...formData, title: value })}
          onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
          errors={errors}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Termin</h2>
        <OfferDatePicker
          dateFrom={formData.date_from}
          dateTo={formData.date_to}
          onDateFromChange={(date) => setFormData({ ...formData, date_from: date })}
          onDateToChange={(date) => setFormData({ ...formData, date_to: date })}
          errors={errors}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Lokalizacja</h2>
        <OfferLocation
          country={formData.country}
          port={formData.port}
          countries={countries}
          onCountryChange={(value) => setFormData({ ...formData, country: value })}
          onPortChange={(value) => setFormData({ ...formData, port: value })}
          errors={errors}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Cena</h2>
        <OfferPricing
          price={formData.price_per_person}
          currency={formData.currency}
          onPriceChange={(value) => setFormData({ ...formData, price_per_person: value })}
          onCurrencyChange={(value) => setFormData({ ...formData, currency: value })}
          errors={errors}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Miejsca</h2>
        <OfferSeats
          seatsTotal={formData.seats_total}
          seatsAvailable={formData.seats_available}
          onSeatsTotalChange={(value) => setFormData({ ...formData, seats_total: value })}
          onSeatsAvailableChange={(value) => setFormData({ ...formData, seats_available: value })}
          errors={errors}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Zdjęcia</h2>
        <OfferImageUpload
          images={formData.images}
          onImagesChange={(files) => setFormData({ ...formData, images: files })}
          errors={errors}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
        >
          {loading ? 'Tworzenie...' : 'Utwórz ofertę'}
        </button>
      </div>
    </form>
  );
}