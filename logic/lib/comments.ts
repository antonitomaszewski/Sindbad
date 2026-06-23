// obsługa komentarzy:
// sprawdzanie czy mozemy dodawac/edytowac
// edycja i pobieranie komentarzy do wyswietlenia: 
// na stronie oferty,
// na profilu użytkownika 
import pb from './pocketbase';
import { getOfferById } from './offers';
import type { Offer } from '../types/offer';
import type {
  OfferComment,
  OrganizerReviewRatingFilter,
  OrganizerReviewsSummary,
} from '../types/comment';
import { todayIso } from '../../look/utils/dateFormatter';
import {hasConfirmedBookingForOffer} from './bookings';
import {getCurrentUserId, getCurrentUser} from './users';

const COMMENTS_COLLECTION = 'offer_comments';

// możemy dodawać komentarze po zakończonym rejsie
export function isOfferFinished(offer: Offer): boolean {
  const end = (offer.date_to || offer.date_from || '').slice(0, 10);
  return Boolean(end) && end < todayIso();
}

// sprawdzamy czy możemy komentować:
// 1. rejs musi być skończony
// 2. chłop musiał być w załodze
async function canUserComment(offer: Offer, userId: string): Promise<boolean> {
  if (!isOfferFinished(offer)) return false;

  // Organizator nie może komentować własnego rejsu
  if (offer.organizer_id === userId) return false;

  return hasConfirmedBookingForOffer(offer.id, userId);
}


// można dodawać i wyświetlac jedynie opinie po rejsie
// wyświetlamy je po rejsie 
export async function getOfferComments(offerId: string): Promise<OfferComment[]> {
  const offer = await getOfferById(offerId);
  if (!offer || !isOfferFinished(offer)) {
    return [];
  }
  const records = await pb.collection(COMMENTS_COLLECTION).getFullList({
      filter: `offer_id = "${offerId}"`,
    });
  return records as unknown as OfferComment[];
}
// używane na widoku oferrty do sprawdzenia czy mozemy dodać komentarz
// w OfferCommentsSection 
export async function canCurrentUserAddOfferComment(offerId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId)
    return false;

  const offer = await getOfferById(offerId);
  if (!offer) return false;

  return canUserComment(offer, userId);
}

// jesli już gościu dodałe komentarz - to go tutaj zwracamy
// używane na widoku oferty, do wyświetlania komentarzy
export async function getCurrentUserOfferComment(offerId: string): Promise<OfferComment | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    return await pb.collection(COMMENTS_COLLECTION).getFirstListItem(`offer_id = "${offerId}" && user_id = "${userId}"`);
  } catch {
    return null;
  }
}


// jak ktoś już dodał komentarz - to go aktualizujemy
// a jak nowy - to tworzymy
// używane na stronie oferty w komponencie komentarzy
// biorę offerId, bo pochodzi to właśnie z widoku oferty
export async function updateOrCreateComment({
  offerId,
  rating,
  content,
}: {
  offerId: string;
  rating: number;
  content: string;
}): Promise<OfferComment> {
  // zalogowany użytkownik dodaje komentarze
  const userId = await getCurrentUserId();
  const user = getCurrentUser();

  const offer = await getOfferById(offerId);
  offer.title
  
  const canComment = await canUserComment(offer, userId);
  if (!canComment) {
    throw new Error('Nie masz uprawnień do komentowania tego rejsu');
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Ocena musi być w zakresie 1-5');
  }

  const existing = await getCurrentUserOfferComment(offerId);

  const payload = {
    rating,
    content: content.trim(),
    offer_title: offer.title,
    author_name: user?.name
  };

  const record = existing
    ? await pb.collection(COMMENTS_COLLECTION).update(existing.id, payload)
    : await pb.collection(COMMENTS_COLLECTION).create(payload);

  const comments = await pb.collection(COMMENTS_COLLECTION).getOne(record.id);

  return comments as unknown as OfferComment;
}

// wyświetlam to na stronie profilu użytkwnika
// do wglądu w opinie z rejsów
// organizatorId -> oferty -> komentarze
// zwracamy komentarze + statystki
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

    if (offers.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        lowRatingsCount: 0,
        reviews: [],
      };
    }

    const filter = offers.map((offer) => `offer_id = "${offer.id}"`).join(' || ');
    const comments = await pb.collection(COMMENTS_COLLECTION).getFullList({
      filter: filter
    });

    const totalReviews = comments.length;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    const averageRating = totalReviews ? Number((sum / totalReviews).toFixed(2)) : 0;
    const lowRatingsCount = comments.filter((c) => c.rating <= 3).length;

    const filtered = ratingFilter === 'all'
      ? comments
      : comments.filter((c) => c.rating === ratingFilter);

    return {
      averageRating,
      totalReviews,
      lowRatingsCount,
      reviews: filtered as unknown as OfferComment[],
    };
  } catch (err) {
    return {
      averageRating: 0,
      totalReviews: 0,
      lowRatingsCount: 0,
      reviews: [],
    };
  }
}
