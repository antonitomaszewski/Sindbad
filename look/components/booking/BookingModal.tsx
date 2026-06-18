'use client';
import { useState } from 'react';
import { createBooking } from '@/logic/lib/bookings';
import pb from '@/logic/lib/pocketbase';

const MAX_MESSAGE_LENGTH = 200;

interface BookingModalProps {
  offerId: string;
  onClose: () => void;
  onSuccess: () => void;
  canReserve?: boolean;
}

export default function BookingModal({ offerId, onClose, onSuccess, canReserve = true }: BookingModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pola dla gości
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const isLoggedIn = pb.authStore.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canReserve) {
      setError('Rezerwacja jest niedostępna dla tego rejsu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLoggedIn) {
        await createBooking(offerId, message);
      } else {
        if (!guestName) {
          setError('Podaj imię i nazwisko');
          setLoading(false);
          return;
        }
        if (!guestEmail && !guestPhone) {
          setError('Podaj email lub telefon');
          setLoading(false);
          return;
        }

        if (remaining < 0) {
          setError('Zbyt długa wiadomość');
          setLoading(false);
          return
        }
        await createBooking(offerId, message, {
          name: guestName,
          email: guestEmail || undefined,
          phone: guestPhone || undefined,
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Nie udało się wysłać rezerwacji');
    } finally {
      setLoading(false);
    }
  };

   const remaining = MAX_MESSAGE_LENGTH - message.length;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Wyślij rezerwację
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoggedIn && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                  placeholder="Jan Kowalski"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                  placeholder="+48 123 456 789"
                />
              </div>

              <p className="text-xs text-gray-500">* Podaj email lub telefon</p>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wiadomość dla organizatora (opcjonalnie)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
              placeholder="Np. Mam pytanie o..."
            />
            <p className={
  remaining < 20
    ? "text-red-500"
    : "text-gray-500"
}>
              {message.length} / {MAX_MESSAGE_LENGTH}
            </p>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !canReserve}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-main text-white hover:bg-green-dark disabled:opacity-50"
            >
              {loading ? 'Wysyłanie...' : canReserve ? 'Potwierdź' : 'Rezerwacja niedostępna'}
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