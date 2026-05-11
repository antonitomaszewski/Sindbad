'use client';

import { useState } from 'react';
import { createTripAlert } from '@/logic/lib/tripAlerts';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!country.trim()) {
        setError('Wybierz kraj dla alertu.');
        setLoading(false);
        return;
      }

      await createTripAlert(userId, {
        country: country.trim(),
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        organizer_id: organizerId.trim() || undefined,
      });

      setSuccess('Alert został zapisany.');
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || 'Nie udało się utworzyć alertu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kraj
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
          placeholder="Np. Grecja"
          required
        />
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
          Organizator ID
        </label>
        <input
          type="text"
          value={organizerId}
          onChange={(e) => setOrganizerId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
          placeholder="Opcjonalnie"
        />
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