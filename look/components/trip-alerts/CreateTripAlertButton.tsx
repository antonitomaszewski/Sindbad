'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/logic/lib/users';
import type { Offer } from '@/logic/types/offer';
import { Card } from '@/look/components/ui/Card';
import { TripAlertForm } from './TripAlertForm';

interface CreateTripAlertButtonProps {
  offer: Offer;
  label?: string;
  showIcon?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function CreateTripAlertButton({
  offer,
  label = 'Powiadom o podobnych rejsach',
  showIcon = true,
  className = '',
  fullWidth = false,
}: CreateTripAlertButtonProps) {
  const currentUser = getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpen = () => {
    if (!currentUser?.id) {
      setMessage('Zaloguj się, aby zapisać alert.');
      return;
    }

    setMessage('');
    setIsOpen(true);
  };

  return (
    <>
      <div className={fullWidth ? 'flex-1' : 'mt-6'}>
        <button
          type="button"
          onClick={handleOpen}
          className={`inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 ${fullWidth ? 'w-full' : ''} ${className}`}
        >
          {showIcon ? `🔔 ${label}` : label}
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>

      {isOpen && currentUser?.id && (
        <div className="fixed inset-0 z-50 bg-black/30 px-4 py-10 overflow-y-auto">
          <div className="mx-auto max-w-lg">
            <Card className="mb-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Powiadom mnie o podobnych rejsach</h2>
                  <p className="text-sm text-gray-600 mt-1">Zapisz prosty alert na bazie tej oferty.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xl text-gray-500 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <TripAlertForm
                userId={currentUser.id}
                initialValues={{
                  country: offer.country,
                  date_from: offer.date_from,
                  date_to: offer.date_to,
                  organizer_id: offer.organizer_id,
                }}
                onSaved={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
              />
            </Card>
          </div>
        </div>
      )}
    </>
  );
}