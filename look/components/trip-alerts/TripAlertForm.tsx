'use client';

import { useEffect, useState } from 'react';
import { createTripAlert } from '@/logic/lib/tripAlerts';
import { getAllOrganizers } from '@/logic/lib/users';
import { COUNTRIES } from '@/logic/constants/countries';
import { Button } from '@/look/components/ui/Button';

interface TripAlertFormProps {
  userId: string;
  initialValues?: {
    country?: string;
    date_from?: string;
    date_to?: string;
    organizer_id?: string;
  };
  onCreated?: () => void;
  onCancel?: () => void;
}

interface Organizer {
  id: string;
  name: string;
}

export function TripAlertForm({
  userId,
  initialValues,
  onCreated,
  onCancel,
}: TripAlertFormProps) {
  const [country, setCountry] = useState(initialValues?.country || '');
  const [dateFrom, setDateFrom] = useState(initialValues?.date_from || '');
  const [dateTo, setDateTo] = useState(initialValues?.date_to || '');
  const [organizerId, setOrganizerId] = useState(initialValues?.organizer_id || '');
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAllOrganizers().then((list) => setOrganizers(list));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!country) {
        setError('Wybierz kraj dla alertu.');
        setLoading(false);
        return;
      }

      await createTripAlert(userId, {
        country,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        organizer_id: organizerId || undefined,
      });

      setSuccess('Alert został zapisany.');
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Nie udało się utworzyć alertu';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kraj <span className="text-red-500">*</span>
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
          required
        >
          <option value="">Wybierz kraj</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.namePL}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Od kiedy
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do kiedy
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organizator (opcjonalnie)
        </label>
        <select
          value={organizerId}
          onChange={(e) => setOrganizerId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
        >
          <option value="">Wszyscy organizatorzy</option>
          {organizers.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <div className="flex gap-3">
        <Button className="justify-center" disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Zapisz alert'}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer bg-white border-2 border-gray text-gray hover:bg-gray hover:text-white disabled:opacity-50"
            disabled={loading}
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
}