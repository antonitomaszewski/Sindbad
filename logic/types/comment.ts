export interface OfferComment {
  id: string;
  offer_id: string;
  user_id: string;
  rating: number;
  content: string;
  created: string;
  updated: string;
  author_name?: string;
  offer_title?: string;
}

export type OrganizerReviewRatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

export interface OrganizerReviewsSummary {
  averageRating: number;
  totalReviews: number;
  lowRatingsCount: number;
  reviews: OfferComment[];
}
