"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/look/components/ui/Card';
import type { UserContact } from '@/logic/types/booking';

interface SailedWithSectionProps {
  contacts: UserContact[];
  commonContactIds?: string[];
}

export function SailedWithSection({ contacts, commonContactIds = [] }: SailedWithSectionProps) {
  const [onlyCommon, setOnlyCommon] = useState(false);

  const commonIdsSet = useMemo(() => new Set(commonContactIds), [commonContactIds]);
  const hasCommonContacts = commonContactIds.length > 0;

  const visibleContacts = useMemo(() => {
    if (!onlyCommon) {
      return contacts;
    }

    return contacts.filter((contact) => commonIdsSet.has(contact.userId));
  }, [contacts, onlyCommon, commonIdsSet]);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Żeglował z...</h3>
        {visibleContacts.length > 0 && (
          <span className="text-xs text-gray-500">{visibleContacts.length} kontaktów</span>
        )}
      </div>

      {hasCommonContacts && (
        <label className="mb-3 inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyCommon}
            onChange={(e) => setOnlyCommon(e.target.checked)}
            className="h-4 w-4 rounded border border-gray-300 text-blue-600"
          />
          Pokaż tylko wspólne kontakty
        </label>
      )}

      {visibleContacts.length === 0 && (
        <p className="text-gray-600">Brak wspólnych rejsów z innymi użytkownikami.</p>
      )}

      {visibleContacts.length > 0 && (
        <ul className="space-y-2">
          {visibleContacts.map((contact) => (
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