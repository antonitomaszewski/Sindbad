// modal rezerwacji oferty
// wyświetla się jak na ofercie klikamy wyślij rezerwację
// user moze byc zalogowany albo nie: dwie wersje
// długość wiadomości to max 200 znaków
'use client';
import { useState } from 'react';
import { createBooking } from '@/logic/lib/bookings';
import { isUserLoggedIn } from '@/logic/lib/users';

const MAX_MESSAGE_LENGTH = 200;

interface BookingModalProps {
  offerId: string;
  onClose: () => void;
  onSuccess: () => void;
  canReserve?: boolean;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main';
const labelClass = 'block text-sm font-medium text-gray-700 mb-2';
const buttonClass = 'py-3 px-6 rounded-lg font-semibold disabled:opacity-50';
const submitButtonClass = `flex-1 ${buttonClass} bg-main text-white hover:bg-green-dark`;
const cancelButtonClass = `${buttonClass} bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50`;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={labelClass}>{children}</label>;
}

export default function BookingModal({ offerId, onClose, onSuccess, canReserve = true }: BookingModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  // const [guestPhone, setGuestPhone] = useState('');
  const onClear = () => {setGuestName(''); setMessage(''); setGuestEmail('')};

  const isLoggedIn = isUserLoggedIn();
  const remaining = MAX_MESSAGE_LENGTH - message.length;
  const counterClass = remaining < 20 ? 'text-red-500' : 'text-gray-500';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canReserve) {
      setError('Rezerwacja jest niedostępna dla tego rejsu');
      return;
    }

    if (remaining < 0) {
      setError('Zbyt długa wiadomość');
      return;
    }

    if (!isLoggedIn && !guestName) {
      setError('Podaj imię i nazwisko');
      return;
    }

    if (!isLoggedIn && !guestEmail) {
      setError('Podaj email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLoggedIn) {
        await createBooking(offerId, message);
      } else {
        await createBooking(offerId, message, {
          name: guestName,
          email: guestEmail,
        });
      }
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoggedIn && (
            <>
              <FieldLabel>Imię i nazwisko *</FieldLabel>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={inputClass}
                placeholder="Jan Kowalski"
                required
              />

              <FieldLabel>Email *</FieldLabel>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className={inputClass}
                placeholder="jan@example.com"
                required
              />
              {/* <FieldLabel>Telefon</FieldLabel>
              <input
              type='tel'
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className={inputClass}
              placeholder='+123456789'/> */}
            </>
          )}

          <div>
            <FieldLabel>Wiadomość dla organizatora (opcjonalnie)</FieldLabel>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Np. Mam pytanie o..."
            />
            <p className={counterClass}>
              {message.length} / {MAX_MESSAGE_LENGTH}
            </p>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !canReserve}
              className={submitButtonClass}
            >
              {loading ? 'Wysyłanie...' : canReserve ? 'Potwierdź' : 'Rezerwacja niedostępna'}
            </button>
            <button
            type="button"
            disabled={false}
            className={cancelButtonClass}
            onClick={onClear}>
              Wyczyść
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={cancelButtonClass}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}