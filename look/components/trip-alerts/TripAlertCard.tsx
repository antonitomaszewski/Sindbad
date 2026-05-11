'use client';

import { useUser } from '@/look/hooks/useUser';
import { Card } from '@/look/components/ui/Card';
import { Button } from '@/look/components/ui/Button';
import { formatDateRange } from '@/logic/lib/dates';
import { getCountryName } from '@/logic/constants/countries';
import type { TripAlert } from '@/logic/types/tripAlert';

interface TripAlertCardProps {
  alert: TripAlert;
  onDelete: (alertId: string) => void;
  deleting?: boolean;
}

export function TripAlertCard({ alert, onDelete, deleting = false }: TripAlertCardProps) {
  const { user: organizer } = useUser(alert.organizer_id || null);
  const term = formatDateRange(alert.date_from, alert.date_to);

  return (
    <Card className="mb-0">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
            {alert.country ? getCountryName(alert.country) : 'Dowolny kraj'}
            </h3>
            <p className="text-sm text-gray-500">
              Powiadom mnie o podobnych rejsach
            </p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${alert.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {alert.active ? 'Aktywny' : 'Nieaktywny'}
          </span>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Termin:</span> {term || 'Dowolny'}
          </p>
          <p>
            <span className="font-medium">Organizator:</span> {organizer?.name || alert.organizer_id || 'Dowolny'}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => onDelete(alert.id)}
            variant="secondary"
            className="!flex-none !py-2 !px-4"
            disabled={deleting}
          >
            {deleting ? 'Usuwanie...' : 'Usuń'}
          </Button>
        </div>
      </div>
    </Card>
  );
}