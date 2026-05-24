'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OfferBasicInfo from './OfferBasicInfo';
import OfferDatePicker from './OfferDatePicker';
import OfferLocation from './OfferLocation';
import OfferPricing from './OfferPricing';
import OfferSeats from './OfferSeats';
import OfferImageUpload from './OfferImageUpload';
import { createOffer, convertFormDataToOffer } from '../../../logic/lib/offers';
import { uploadOfferImages } from '../../../logic/lib/images';
import { getCurrentUser } from '../../../logic/lib/users';
import { useFormValidation } from '../../../logic/hooks/useFormValidation';
import { validateOfferForm } from '../../../logic/lib/validation';
import type { OfferFormData } from '../../../logic/types/offer';

interface Props {
  countries: { code: string; name: string; namePL: string }[];
}

const INITIAL_FORM_DATA: OfferFormData = {
  title: '',
  description: '',
  date_from: null,
  date_to: null,
  country: '',
  port: '',
  geo_lat: '',
  geo_lon: '',
  price_per_person: '',
  currency: 'PLN',
  seats_total: '',
  seats_available: '',
  images: [],
};

export default function CreateOfferForm({ countries }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<OfferFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const { errors, validate, clearErrors } = useFormValidation(validateOfferForm);

  function updateField<K extends keyof OfferFormData>(
    field: K,
    value: OfferFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');
    clearErrors();

    // Check authentication
    const user = getCurrentUser();
    if (!user) {
      setGlobalError('Musisz być zalogowany aby dodać ofertę');
      router.push('/logowanie');
      return;
    }

    // Validate
    if (!validate(formData)) {
      return;
    }

    setLoading(true);

    try {
      // Convert and create offer
      const offerData = convertFormDataToOffer(formData, user.id);
      const newOffer = await createOffer(offerData);

      // Upload images (non-blocking)
      if (formData.images.length > 0 && newOffer.id) {
        try {
          await uploadOfferImages(newOffer.id, formData.images);
        } catch (imgError) {
          console.warn('Failed to upload images:', imgError);
        }
      }

      // Success
      router.push(`/oferta/${newOffer.id}`);
    } catch (error: any) {
      console.error('Create offer error:', error);
      setGlobalError(
        error.message || 'Nie udało się utworzyć oferty. Spróbuj ponownie.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {globalError}
        </div>
      )}

      <FormSection title="Podstawowe informacje">
        <OfferBasicInfo
          title={formData.title}
          description={formData.description}
          onTitleChange={(value) => updateField('title', value)}
          onDescriptionChange={(value) => updateField('description', value)}
          errors={errors}
        />
      </FormSection>

      <FormSection title="Termin">
        <OfferDatePicker
          dateFrom={formData.date_from}
          dateTo={formData.date_to}
          onDateFromChange={(date) => updateField('date_from', date)}
          onDateToChange={(date) => updateField('date_to', date)}
          errors={errors}
        />
      </FormSection>

      <FormSection title="Lokalizacja">
        <OfferLocation
          country={formData.country}
          port={formData.port}
          geoLat={formData.geo_lat}
          geoLon={formData.geo_lon}
          countries={countries}
          onCountryChange={(value) => updateField('country', value)}
          onPortChange={(value) => updateField('port', value)}
          onGeoLatChange={(value) => updateField('geo_lat', value)}
          onGeoLonChange={(value) => updateField('geo_lon', value)}
          errors={errors}
        />
      </FormSection>

      <FormSection title="Cena">
        <OfferPricing
          price={formData.price_per_person}
          currency={formData.currency}
          onPriceChange={(value) => updateField('price_per_person', value)}
          onCurrencyChange={(value) => updateField('currency', value)}
          errors={errors}
        />
      </FormSection>

      <FormSection title="Miejsca">
        <OfferSeats
          seatsTotal={formData.seats_total}
          seatsAvailable={formData.seats_available}
          onSeatsTotalChange={(value) => updateField('seats_total', value)}
          onSeatsAvailableChange={(value) => updateField('seats_available', value)}
          errors={errors}
        />
      </FormSection>

      <FormSection title="Zdjęcia">
        <OfferImageUpload
          images={formData.images}
          onImagesChange={(files) => updateField('images', files)}
          errors={errors}
        />
      </FormSection>

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

// Helper component for sections
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}