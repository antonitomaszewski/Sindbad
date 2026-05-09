import Link from 'next/link';
import type { BookingWithOffer } from '@/logic/types/booking';

const statusLabels = {
  pending: 'Oczekuje',
  confirmed: 'Potwierdzona',
  cancelled: 'Anulowana',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function MyBookingsList({ bookings }: { bookings: BookingWithOffer[] }) {
  if (bookings.length === 0) {
    return (
      <section className="bg-white border border-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Moje rezerwacje</h3>
        <p className="text-gray-600 text-sm">Brak nadchodzących rezerwacji.</p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-100 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-3">Moje rezerwacje</h3>
      <ul className="space-y-3">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex justify-between items-center">
            <div>
              <Link
                href={`/oferta/${booking.offer_id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {booking.offer?.title ?? 'Rejs'}
              </Link>
              {booking.offer?.date_from && (
                <p className="text-xs text-gray-500">
                  {new Date(booking.offer.date_from).toLocaleDateString('pl-PL')}
                  {booking.offer.date_to && ` – ${new Date(booking.offer.date_to).toLocaleDateString('pl-PL')}`}
                </p>
            )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
