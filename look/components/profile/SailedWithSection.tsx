import Link from 'next/link';
import { Card } from '@/look/components/ui/Card';
import type { UserContact } from '@/logic/types/booking';

interface SailedWithSectionProps {
  contacts: UserContact[];
}

export function SailedWithSection({ contacts }: SailedWithSectionProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Żeglował z...</h3>
        {contacts.length > 0 && (
          <span className="text-xs text-gray-500">{contacts.length} kontaktów</span>
        )}
      </div>

      {contacts.length === 0 && (
        <p className="text-gray-600">Brak wspólnych rejsów z innymi użytkownikami.</p>
      )}

      {contacts.length > 0 && (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li key={contact.userId} className="rounded-lg px-3 py-2 border border-gray-100 bg-white">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/profil/${contact.userId}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {contact.name}
                </Link>

                <span className="text-xs text-gray-500">
                  {contact.trips.length} {contact.trips.length === 1 ? 'rejs' : 'rejsy'}
                </span>
              </div>

              {contact.trips.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800 select-none">
                    Pokaż wspólne rejsy
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4 list-disc">
                    {contact.trips.map((trip) => (
                      <li key={`${contact.userId}-${trip.offerId}`} className="text-sm text-gray-700">
                        <Link href={`/oferta/${trip.offerId}`} className="text-blue-600 hover:underline">
                          {trip.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}