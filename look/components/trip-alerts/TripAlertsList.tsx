// lista powiadomień utworzona na profilu użytkownika

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/logic/lib/users';
import { deleteTripAlert, getUserTripAlerts } from '@/logic/lib/tripAlerts';
import type { TripAlert } from '@/logic/types/tripAlert';
import { Card } from '@/look/components/ui/Card';
import { TripAlertCard } from './TripAlertCard';
import { TripAlertForm } from './TripAlertForm';

const EMPTY_ALERT_VALUES = {
  country: '',
  date_from: '',
  date_to: '',
  organizer_id: '',
};

export function TripAlertsList() {
  const currentUser = getCurrentUser();
  const [alerts, setAlerts] = useState<TripAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<TripAlert | null>(null);

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

  const handleCreateClick = () => {
    setEditingAlert(null);
    setIsModalOpen(true);
  };

  const handleEdit = (alert: TripAlert) => {
    setEditingAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlert(null);
  };

  const handleSaved = async () => {
    handleCloseModal();
    if (!currentUser?.id) return;

    try {
      const data = await getUserTripAlerts(currentUser.id);
      setAlerts(data);
    } catch {
      setError('Nie udało się pobrać alertów.');
    }
  };

  if (!currentUser?.id) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alerty rejsów</h2>
          <p className="text-sm text-gray-600">Powiadomimy Cię, gdy pojawią się podobne rejsy.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-main/40"
        >
          Dodaj alert rejsu
        </button>
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
          onEdit={handleEdit}
          deleting={deletingId === alert.id}
        />
      ))}

      {isModalOpen && currentUser?.id && (
        <div className="fixed inset-0 z-50 bg-black/30 px-4 py-10 overflow-y-auto">
          <div className="mx-auto max-w-lg">
            <Card className="mb-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingAlert ? 'Edytuj alert rejsu' : 'Dodaj alert rejsu'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingAlert
                      ? 'Zmień warunki powiadomienia i zapisz zmiany.'
                      : 'Zapisz nowy alert, aby dostawać powiadomienia o podobnych rejsach.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-xl text-gray-500 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              <TripAlertForm
                userId={currentUser.id}
                alert={editingAlert ?? undefined}
                initialValues={editingAlert ? undefined : EMPTY_ALERT_VALUES}
                onSaved={handleSaved}
                onCancel={handleCloseModal}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}