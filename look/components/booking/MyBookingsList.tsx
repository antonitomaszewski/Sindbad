"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BookingWithOffer, BookingStatus } from '@/logic/types/booking';
import { Card } from '@/look/components/ui/Card';

const statusLabels = {
  pending: 'Oczekuje',
  confirmed: 'Potwierdzona',
  rejected: 'Odrzucona',
} as const;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
} as const;

const statusOptions: Array<{ value: 'all' | BookingStatus; label: string }> = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'pending', label: 'Oczekuje' },
  { value: 'confirmed', label: 'Potwierdzona' },
  { value: 'rejected', label: 'Odrzucona' },
];

export default function MyBookingsList({ bookings: initialBookings }: { bookings: BookingWithOffer[] }) {
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') {
      return initialBookings;
    }

    return initialBookings.filter((booking) => booking.status === statusFilter);
  }, [initialBookings, statusFilter]);

  if (initialBookings.length === 0) {
    return (
      <Card className="mb-0">
        <h3 className="text-lg font-medium mb-3">Moje rezerwacje</h3>
        <p className="text-gray-600 text-sm">Brak rezerwacji.</p>
      </Card>
    );
  }

  return (
    <Card className="mb-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-medium">Moje rezerwacje</h3>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BookingStatus)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-gray-600 text-sm">Brak rezerwacji dla wybranego statusu.</p>
      ) : (
        <ul className="space-y-3">
          {filteredBookings.map((booking) => (
            <li key={booking.id} className="flex justify-between items-center">
              <div>
                <Link
                  href={`/oferta/${booking.offer_id}`}
                  className="font-medium text-main hover:underline"
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
      )}
    </Card>
  );
}
