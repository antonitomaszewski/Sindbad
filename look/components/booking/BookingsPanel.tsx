// panel rezerwacji, dla organizatora
// może sobie klikać by zmienić status rezerwacji każdej z osób,
// jak klika - wysyłamy mail
// mozna zmienić status z zaakceptowanego na odrzucony.
// to byłoby dziwne zachowanie ze strony organizatora, ale nie blokuje go
 
'use client';
import { useState, useEffect } from 'react';
import { getOfferBookings, updateBookingStatus } from '@/logic/lib/bookings';
import { useUser } from '@/look/hooks/useUser';
import type { Booking } from '@/logic/types/booking';
import Link from 'next/link';
import {statusColors} from '@/look/constants/booking';

interface BookingsPanelProps {
  offerId: string;
}

export function BookingsPanel({ offerId }: BookingsPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, [offerId]);

  const loadBookings = async () => {
    try {
      const data = await getOfferBookings(offerId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'rejected') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Odśwież listę
      await loadBookings();
    } catch (err: any) {
      alert('Błąd: ' + err.message);
    }
  };

  if (loading) return <div className="text-gray-500">Ładowanie rezerwacji...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8 bg-main-soft border border-main-soft rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Panel organizatora - Rezerwacje ({bookings.length})
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">Brak rezerwacji dla tej oferty</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={booking}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BookingItemProps {
  booking: Booking;
  onStatusChange: (id: string, status: 'confirmed' | 'rejected') => void;
}

function BookingItem({ booking, onStatusChange }: BookingItemProps) {
  const { user } = useUser(booking.user_id || null);
  const isGuest = !booking.user_id;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {isGuest ? (
            <div>
              <p className="font-semibold text-gray-900">{booking.guest_name}</p>
              <p className="text-sm text-gray-600">
                {booking.guest_email && `📧 ${booking.guest_email}`}
              </p>
            </div>
          ) : (
            <div>
              {user ? (
                <Link 
                  href={`/profil/${booking.user_id}`}
                  className="font-semibold text-main hover:underline"
                >
                  {user.name || 'Użytkownik'}
                </Link>
              ) : (
                <p className="font-semibold text-gray-900">Ładowanie...</p>
              )}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Utworzono: {new Date(booking.created).toLocaleString('pl-PL')}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
          {booking.status === 'pending' && 'Oczekuje'}
          {booking.status === 'confirmed' && 'Potwierdzona'}
          {booking.status === 'rejected' && 'Odrzucona'}
        </span>
      </div>

      {booking.message && (
        <div className="mb-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
          <span className="font-medium">Wiadomość:</span> {booking.message}
        </div>
      )}

      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(booking.id, 'confirmed')}
            className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover-bg-success font-medium"
          >
            ✓ Potwierdź
          </button>
          <button
            onClick={() => onStatusChange(booking.id, 'rejected')}
            className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover-bg-error font-medium"
          >
            ✕ Anuluj
          </button>
        </div>
      )}

      {booking.status === 'confirmed' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Zmień status rezerwacji:</p>
          <button
            onClick={() => onStatusChange(booking.id, 'rejected')}
            className="w-full px-4 py-2 bg-error text-white rounded-lg hover-bg-error font-medium"
          >
            ✕ Cofnij potwierdzenie (odrzuć)
          </button>
        </div>
      )}

      {booking.status === 'rejected' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Zmień status rezerwacji:</p>
          <button
            onClick={() => onStatusChange(booking.id, 'confirmed')}
            className="w-full px-4 py-2 bg-success text-white rounded-lg hover-bg-success font-medium"
          >
            ✓ Przywróć i potwierdź
          </button>
        </div>
      )}
    </div>
  );
}