// ...existing code...
import Link from 'next/link';
import { Card } from '@/look/components/ui/Card';
import type { Trip } from '@/logic/types/offer';

export default function TripHistory({
  trips,
  title = 'Historia rejsów',
}: {
  trips: Trip[];
  title?: string;
}) {
  return (
    <Card className="mb-0">
      <h3 className="text-lg font-medium mb-3">{title}</h3>

      {trips.length === 0 ? (
        <p className="text-gray-600 text-sm">Brak zarejestrowanych rejsów.</p>
      ) : (
        <ul className="space-y-3">
          {trips.map((t) => (
            <li key={t.id} className="flex justify-between items-center">
              <Link href={`/oferta/${t.id}`} className="text-main hover:underline">
                <span className="font-medium">{t.title ?? 'Szczegóły rejsu'}</span>
              </Link>
              <span className="text-sm text-gray-500">
                {t.date_from
                  ? new Intl.DateTimeFormat('pl-PL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }).format(new Date(t.date_from))
                  : '-'}
                {t.date_to && ` – ${new Intl.DateTimeFormat('pl-PL', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(t.date_to))}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
// ...existing code...