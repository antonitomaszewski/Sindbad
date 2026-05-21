'use client';

import { useEffect, useState } from 'react';
import { createTripAlert, updateTripAlert } from '@/logic/lib/tripAlerts';
import { getAllOrganizers } from '@/logic/lib/users';
import { COUNTRIES_BY_NAME_PL } from '@/logic/constants/countries';
import { Button } from '@/look/components/ui/Button';
import { DateRangePicker } from '@/look/components/ui/DateRangePicker';
import type { TripAlert } from '@/logic/types/tripAlert';

interface TripAlertFormProps {
  userId: string;
  alert?: TripAlert;
  initialValues?: {
    country?: string;
    date_from?: string;
    date_to?: string;
    organizer_id?: string;
  };
  onSaved?: () => void;
  onCreated?: () => void;
  onCancel?: () => void;
}

interface Organizer {
  id: string;
  name: string;
}

export function TripAlertForm({
  userId,
  alert,
  initialValues,
  onSaved,
  onCreated,
  onCancel,
}: TripAlertFormProps) {
  const sourceValues = alert ?? initialValues;
  const [country, setCountry] = useState(sourceValues?.country || '');
  const [dateFrom, setDateFrom] = useState(parseDate(sourceValues?.date_from));
  const [dateTo, setDateTo] = useState(parseDate(sourceValues?.date_to));
  const [organizerId, setOrganizerId] = useState(sourceValues?.organizer_id || '');
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
        return;
      }

      const payload = {
        country,
        date_from: formatDate(dateFrom),
        date_to: formatDate(dateTo),
        organizer_id: organizerId || undefined,
      };

      if (alert) {
        await updateTripAlert(alert.id, payload);
      } else {
        await createTripAlert(userId, payload);
      }

      setSuccess(alert ? 'Alert został zaktualizowany.' : 'Alert został zapisany.');
      onSaved?.();
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
          {COUNTRIES_BY_NAME_PL.map((c) => (
            <option key={c.code} value={c.code}>
              {c.namePL}
            </option>
          ))}
        </select>
      </div>

      <DateRangePicker
        startLabel="Od kiedy"
        endLabel="Do kiedy"
        startDate={dateFrom}
        endDate={dateTo}
        onStartDateChange={setDateFrom}
        onEndDateChange={setDateTo}
      />

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
          {loading ? 'Zapisywanie...' : alert ? 'Zapisz zmiany' : 'Zapisz alert'}
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

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value: Date | null): string | undefined {
  return value ? value.toISOString().split('T')[0] : undefined;
}