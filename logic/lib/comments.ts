import pb from './pocketbase';
import { getOfferById } from './offers';
import type { Offer } from '../types/offer';
import type {
  OfferComment,
  OrganizerReviewRatingFilter,
  OrganizerReviewsSummary,
} from '../types/comment';
import { todayIso } from '../../look/utils/dateFormatter';

const COMMENTS_COLLECTION = 'offer_comments';

function mapRecordToComment(record: any): OfferComment {
  const expandedUser = Array.isArray(record.expand?.user_id)
    ? record.expand.user_id[0]
    : record.expand?.user_id;
  const expandedOffer = Array.isArray(record.expand?.offer_id)
    ? record.expand.offer_id[0]
    : record.expand?.offer_id;

  return {
    id: String(record.id),
    offer_id: String(record.offer_id),
    user_id: String(record.user_id),
    rating: Number(record.rating || 0),
    content: String(record.content || ''),
    created: String(record.created),
    updated: String(record.updated),
    author_name: String(expandedUser?.name || expandedUser?.email || 'Użytkownik'),
    offer_title: expandedOffer?.title ? String(expandedOffer.title) : undefined,
  };
}

export function isOfferFinished(offer: Offer): boolean {
  const end = (offer.date_to || offer.date_from || '').slice(0, 10);
  return Boolean(end) && end < todayIso();
}

async function hasConfirmedBooking(offerId: string, userId: string): Promise<boolean> {
  const list = await pb.collection('bookings').getList(1, 1, {
    filter: `offer_id = "${offerId}" && user_id = "${userId}" && status = "confirmed"`,
  });

  return list.totalItems > 0;
}

async function canUserComment(offer: Offer, userId: string): Promise<boolean> {
  if (!isOfferFinished(offer)) return false;

  // Organizator nie może komentować własnego rejsu
  if (offer.organizer_id === userId) return false;

  return hasConfirmedBooking(offer.id, userId);
}

export async function getOfferComments(offerId: string): Promise<OfferComment[]> {
  const offer = await getOfferById(offerId);
  if (!offer || !isOfferFinished(offer)) {
    return [];
  }

  try {
    const records = await pb.collection(COMMENTS_COLLECTION).getFullList({
      filter: `offer_id = "${offerId}"`,
      expand: 'user_id,offer_id',
      sort: '-created',
    });

    return records.map(mapRecordToComment);
  } catch (err) {
    console.warn('getOfferComments error:', err);
    return [];
  }
}

export async function canCurrentUserAddOfferComment(offerId: string): Promise<boolean> {
  const userId = pb.authStore.record?.id;
  if (!userId) return false;

  const offer = await getOfferById(offerId);
  if (!offer) return false;

  return canUserComment(offer, userId);
}

export async function getCurrentUserOfferComment(offerId: string): Promise<OfferComment | null> {
  const userId = pb.authStore.record?.id;
  if (!userId) return null;

  try {
    const list = await pb.collection(COMMENTS_COLLECTION).getList(1, 1, {
      filter: `offer_id = "${offerId}" && user_id = "${userId}"`,
      expand: 'user_id,offer_id',
    });

    if (list.totalItems === 0 || !list.items[0]) {
      return null;
    }

    return mapRecordToComment(list.items[0]);
  } catch (err) {
    console.warn('getCurrentUserOfferComment error:', err);
    return null;
  }
}

export async function upsertCurrentUserOfferComment({
  offerId,
  rating,
  content,
}: {
  offerId: string;
  rating: number;
  content: string;
}): Promise<OfferComment> {
  const userId = pb.authStore.record?.id;

  if (!userId) {
    throw new Error('Zaloguj się, aby dodać komentarz');
  }

  const offer = await getOfferById(offerId);
  if (!offer) {
    throw new Error('Oferta nie istnieje');
  }

  const canComment = await canUserComment(offer, userId);
  if (!canComment) {
    throw new Error('Nie masz uprawnień do komentowania tego rejsu');
  }

  const normalizedContent = content.trim();
  if (!normalizedContent) {
    throw new Error('Podaj treść komentarza');
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Ocena musi być w zakresie 1-5');
  }

  const existing = await getCurrentUserOfferComment(offerId);

  const payload = {
    offer_id: offerId,
    user_id: userId,
    rating,
    content: normalizedContent,
  };

  const record = existing
    ? await pb.collection(COMMENTS_COLLECTION).update(existing.id, payload)
    : await pb.collection(COMMENTS_COLLECTION).create(payload);

  const withExpand = await pb.collection(COMMENTS_COLLECTION).getOne(record.id, {
    expand: 'user_id,offer_id',
  });

  return mapRecordToComment(withExpand);
}

export async function getOrganizerReviewsSummary({
  organizerId,
  ratingFilter,
}: {
  organizerId: string;
  ratingFilter: OrganizerReviewRatingFilter;
}): Promise<OrganizerReviewsSummary> {
  try {
    const offers = await pb.collection('offers').getFullList({
      filter: `organizer_id = "${organizerId}"`,
      fields: 'id,date_from,date_to',
    });

    const pastOfferIds = offers
      .filter((o: any) => {
        const end = String(o.date_to || o.date_from || '').slice(0, 10);
        return Boolean(end) && end < todayIso();
      })
      .map((o: any) => String(o.id));

    if (pastOfferIds.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        lowRatingsCount: 0,
        reviews: [],
      };
    }

    const offerFilter = pastOfferIds.map((id) => `offer_id = "${id}"`).join(' || ');
    const records = await pb.collection(COMMENTS_COLLECTION).getFullList({
      filter: offerFilter,
      expand: 'user_id,offer_id',
      sort: '-created',
    });

    const comments = records.map(mapRecordToComment);
    const totalReviews = comments.length;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    const averageRating = totalReviews ? Number((sum / totalReviews).toFixed(2)) : 0;
    const lowRatingsCount = comments.filter((c) => c.rating <= 3).length;

    const filtered = ratingFilter === 'all'
      ? comments
      : comments.filter((c) => c.rating === ratingFilter);

    const ordered = [...filtered].sort((a, b) => b.created.localeCompare(a.created));

    return {
      averageRating,
      totalReviews,
      lowRatingsCount,
      reviews: ordered,
    };
  } catch (err) {
    console.warn('getOrganizerReviewsSummary error:', err);
    return {
      averageRating: 0,
      totalReviews: 0,
      lowRatingsCount: 0,
      reviews: [],
    };
  }
}
