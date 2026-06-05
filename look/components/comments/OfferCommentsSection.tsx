'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Offer } from '@/logic/types/offer';
import type { OfferComment } from '@/logic/types/comment';
import {
  canCurrentUserAddOfferComment,
  getCurrentUserOfferComment,
  getOfferComments,
  isOfferFinished,
  upsertCurrentUserOfferComment,
} from '@/logic/lib/comments';
import { Card } from '@/look/components/ui/Card';
import { CommentModal } from './CommentModal';

function stars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating));
}

export function OfferCommentsSection({ offer }: { offer: Offer }) {
  const [comments, setComments] = useState<OfferComment[]>([]);
  const [canComment, setCanComment] = useState(false);
  const [myComment, setMyComment] = useState<OfferComment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const finished = isOfferFinished(offer);

  useEffect(() => {
    if (!finished) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [list, can, mine] = await Promise.all([
          getOfferComments(offer.id),
          canCurrentUserAddOfferComment(offer.id),
          getCurrentUserOfferComment(offer.id),
        ]);

        if (!mounted) return;

        setComments(list);
        setCanComment(can);
        setMyComment(mine);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [offer.id, finished]);

  const handleSave = async ({ rating, content }: { rating: number; content: string }) => {
    await upsertCurrentUserOfferComment({
      offerId: offer.id,
      rating,
      content,
    });

    const [list, mine] = await Promise.all([
      getOfferComments(offer.id),
      getCurrentUserOfferComment(offer.id),
    ]);

    setComments(list);
    setMyComment(mine);
  };

  if (!finished) {
    return null;
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-main">Komentarze i opinie</h3>
            <p className="text-sm text-gray-600">Komentarze są publiczne dla zakończonych rejsów.</p>
          </div>
          {canComment && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              {myComment ? 'Edytuj komentarz' : 'Dodaj komentarz'}
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-600">Ładowanie komentarzy...</p>}

        {!loading && comments.length === 0 && (
          <p className="text-sm text-gray-600">Brak komentarzy dla tego rejsu.</p>
        )}

        {!loading && comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={`/profil/${comment.user_id}`}
                    className="font-semibold text-gray-900 hover:underline"
                  >
                    {comment.author_name || 'Użytkownik'}
                  </Link>
                  <p className="text-sm text-yellow-600">{stars(comment.rating)}</p>
                </div>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <CommentModal
            initialRating={myComment?.rating ?? 5}
            initialContent={myComment?.content ?? ''}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </Card>
  );
}
