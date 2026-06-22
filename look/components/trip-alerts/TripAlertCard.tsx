// kafelki TripAlertCard wyświetlane są na TripAlertList
// na profil/id
// tu pojedynczy kafelek
// możemy je edytować i usuwać
'use client';

import { useUser } from '@/look/hooks/useUser';
import { Card } from '@/look/components/ui/Card';
import { Button } from '@/look/components/ui/Button';
import { formatDateRange } from '@/look/utils/dateFormatter';
import { getCountryName } from '@/logic/constants/countries';
import type { TripAlert } from '@/logic/types/tripAlert';

interface TripAlertCardProps {
  alert: TripAlert;
  onDelete: (alertId: string) => void;
  onEdit: (alert: TripAlert) => void;
  deleting?: boolean;
}

export function TripAlertCard({ alert, onDelete, onEdit, deleting = false }: TripAlertCardProps) {
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
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Termin:</span> {term || 'Dowolny'}
          </p>
          <p>
            <span className="font-medium">Organizator:</span> {organizer?.name || alert.organizer_id || 'Dowolny'}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onEdit(alert)}
            variant="secondary"
            className="!flex-none !py-2 !px-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Edytuj
          </Button>
          <Button
            onClick={() => onDelete(alert.id)}
            variant="secondary"
            className="!flex-none !py-2 !px-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            disabled={deleting}
          >
            {deleting ? 'Usuwanie...' : 'Usuń'}
          </Button>
        </div>
      </div>
    </Card>
  );
}