// modal do zadawania pytań  do rejsu, trochę jak booking modal
// używany na oferta/[id]
'use client';

import { useState } from 'react';
import pb from '@/logic/lib/pocketbase';
import { sendOfferQuestion } from '@/logic/lib/emails';

interface QuestionModalProps {
  offerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuestionModal({ offerId, onClose, onSuccess }: QuestionModalProps) {
  const [email, setEmail] = useState(pb.authStore.record?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendOfferQuestion({ offerId, email, message });
      onSuccess();
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : 'Nie udało się wysłać pytania';
      setError(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Zadaj pytanie
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twój email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
              placeholder="jan@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treść pytania
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
              placeholder="Np. Czy są miejsca dla początkujących?"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-main text-white hover:bg-green-dark disabled:opacity-50"
            >
              {loading ? 'Wysyłanie...' : 'Wyślij pytanie'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-3 px-6 rounded-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}