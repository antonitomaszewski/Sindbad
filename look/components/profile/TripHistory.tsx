// ...existing code...
import Link from 'next/link';

type Trip = {
  id: string;
  title?: string;
  date?: string;
};

export default function TripHistory({
  trips,
  title = 'Historia rejsów',
}: {
  trips: Trip[];
  title?: string;
}) {
  return (
    <section className="bg-white border border-gray-100 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-3">{title}</h3>

      {trips.length === 0 ? (
        <p className="text-gray-600 text-sm">Brak zarejestrowanych rejsów.</p>
      ) : (
        <ul className="space-y-3">
          {trips.map((t) => (
            <li key={t.id} className="flex justify-between items-center">
              <Link href={`/oferta/${t.id}`} className="text-blue-600 hover:underline">
                <span className="font-medium">{t.title ?? 'Szczegóły rejsu'}</span>
              </Link>
              <span className="text-sm text-gray-500">{t.date ?? ''}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
// ...existing code...