'use client';
import { useState } from 'react';
import { createBooking } from '@/logic/lib/bookings';

interface BookingModalProps {
  offerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ offerId, onClose, onSuccess }: BookingModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createBooking(offerId, message);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Nie udało się wysłać rezerwacji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Wyślij rezerwację
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wiadomość dla organizatora (opcjonalnie)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
              placeholder="Np. Mam pytanie o..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-main text-white hover:bg-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Wysyłanie...' : 'Potwierdź'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-3 px-6 rounded-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}