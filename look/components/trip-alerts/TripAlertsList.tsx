'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/logic/lib/users';
import { deleteTripAlert, getUserTripAlerts } from '@/logic/lib/tripAlerts';
import type { TripAlert } from '@/logic/types/tripAlert';
import { Card } from '@/look/components/ui/Card';
import { TripAlertCard } from './TripAlertCard';

export function TripAlertsList() {
  const currentUser = getCurrentUser();
  const [alerts, setAlerts] = useState<TripAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserTripAlerts(currentUser.id);
        setAlerts(data);
      } catch (err) {
        setError('Nie udało się pobrać alertów.');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [currentUser?.id]);

  const handleDelete = async (alertId: string) => {
    setDeletingId(alertId);
    setError('');

    try {
      await deleteTripAlert(alertId);
      setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    } catch (err: any) {
      setError(err?.message || 'Nie udało się usunąć alertu.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!currentUser?.id) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Alerty rejsów</h2>
        <p className="text-sm text-gray-600">Powiadomimy Cię, gdy pojawią się podobne rejsy.</p>
      </div>

      {loading && (
        <Card className="mb-0">
          <p className="text-sm text-gray-600">Ładowanie alertów...</p>
        </Card>
      )}

      {error && (
        <Card className="mb-0">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {!loading && alerts.length === 0 && (
        <Card className="mb-0">
          <p className="text-sm text-gray-600">Nie masz jeszcze zapisanych alertów.</p>
        </Card>
      )}

      {alerts.map((alert) => (
        <TripAlertCard
          key={alert.id}
          alert={alert}
          onDelete={handleDelete}
          deleting={deletingId === alert.id}
        />
      ))}
    </div>
  );
}