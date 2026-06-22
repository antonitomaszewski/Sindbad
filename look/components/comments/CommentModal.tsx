// to formularz dodawania edycji komentarza
// używany na stronie oferty
// wyświetlany w sekcji komentarzy, gdy klikniemy dodaj/edytuj komentarz

'use client';

import { useState } from 'react';

interface CommentModalProps {
  initialRating?: number;
  initialContent?: string;
  onClose: () => void;
  onSave: (data: { rating: number; content: string }) => Promise<void>;
}

export function CommentModal({
  initialRating = 5,
  initialContent = '',
  onClose,
  onSave,
}: CommentModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave({ rating, content });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Nie udało się zapisać komentarza');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Dodaj opinię
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ocena
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
            >
              <option value={5}>5 - Świetnie</option>
              <option value={4}>4 - Bardzo dobrze</option>
              <option value={3}>3 - Dobrze</option>
              <option value={2}>2 - Słabo</option>
              <option value={1}>1 - Bardzo słabo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treść opinii
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
              placeholder="Podziel się swoją opinią o rejsie"
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
              {loading ? 'Zapisywanie...' : 'Zapisz komentarz'}
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
