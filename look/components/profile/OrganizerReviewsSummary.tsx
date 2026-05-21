'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/look/components/ui/Card';
import type { OrganizerReviewRatingFilter, OrganizerReviewsSummary as OrganizerReviewsSummaryData } from '@/logic/types/comment';
import { getOrganizerReviewsSummary } from '@/logic/lib/comments';

const FILTER_OPTIONS: Array<{ value: OrganizerReviewRatingFilter; label: string }> = [
  { value: 'all', label: 'Wszystkie' },
  { value: 5, label: '5 gwiazdek' },
  { value: 4, label: '4 gwiazdki' },
  { value: 3, label: '3 gwiazdki' },
  { value: 2, label: '2 gwiazdki' },
  { value: 1, label: '1 gwiazdka' },
];

function stars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating));
}

export function OrganizerReviewsSummary({ organizerId }: { organizerId: string }) {
  const [ratingFilter, setRatingFilter] = useState<OrganizerReviewRatingFilter>('all');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<OrganizerReviewsSummaryData>({
    averageRating: 0,
    totalReviews: 0,
    lowRatingsCount: 0,
    reviews: [],
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const data = await getOrganizerReviewsSummary({ organizerId, ratingFilter });
      if (!mounted) return;
      setSummary(data);
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [organizerId, ratingFilter]);

  return (
    <Card className="mb-0">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">Opinie o organizatorze</h3>
          <select
            value={String(ratingFilter)}
            onChange={(e) => {
              const value = e.target.value;
              setRatingFilter(value === 'all' ? 'all' : Number(value) as 1 | 2 | 3 | 4 | 5);
            }}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
            ))}
          </select>
        </div>

        {loading && <p className="text-sm text-gray-600">Ładowanie opinii...</p>}

        {!loading && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-gray-200 p-2">
              <p className="text-xs text-gray-500">Średnia</p>
              <p className="text-lg font-bold text-gray-900">{summary.averageRating || '-'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-2">
              <p className="text-xs text-gray-500">Liczba opinii</p>
              <p className="text-lg font-bold text-gray-900">{summary.totalReviews}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-2">
              <p className="text-xs text-gray-500">Oceny &lt;= 3</p>
              <p className="text-lg font-bold text-gray-900">{summary.lowRatingsCount}</p>
            </div>
          </div>
        )}

        {!loading && summary.reviews.length === 0 && (
          <p className="text-sm text-gray-600">Brak opinii dla zakończonych rejsów.</p>
        )}

        {!loading && summary.reviews.length > 0 && (
          <div className="space-y-3">
            {summary.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/profil/${review.user_id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-main"
                  >
                    {review.author_name || 'Użytkownik'}
                  </Link>
                  <p className="text-sm text-yellow-600">{stars(review.rating)}</p>
                </div>
                {review.offer_title && (
                  <p className="text-xs text-gray-500 mt-1">
                    Rejs:{' '}
                    <Link href={`/oferta/${review.offer_id}`} className="hover:text-main underline-offset-2 hover:underline">
                      {review.offer_title}
                    </Link>
                  </p>
                )}
                <p className="text-sm text-gray-700 mt-2 line-clamp-3">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
