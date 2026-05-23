import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Offer } from '../types/offer';

const {
  mockGetOfferById,
  bookingsGetList,
  commentsGetFullList,
  commentsGetList,
  commentsCreate,
  commentsUpdate,
  commentsGetOne,
  offersGetFullList,
  pbMock,
} = vi.hoisted(() => {
  const mockGetOfferById = vi.fn();

  const bookingsGetList = vi.fn();
  const commentsGetFullList = vi.fn();
  const commentsGetList = vi.fn();
  const commentsCreate = vi.fn();
  const commentsUpdate = vi.fn();
  const commentsGetOne = vi.fn();
  const offersGetFullList = vi.fn();

  const pbMock = {
    authStore: {
      record: null as { id?: string } | null,
    },
    collection: vi.fn((name: string) => {
      if (name === 'bookings') {
        return {
          getList: bookingsGetList,
        };
      }

      if (name === 'offer_comments') {
        return {
          getFullList: commentsGetFullList,
          getList: commentsGetList,
          create: commentsCreate,
          update: commentsUpdate,
          getOne: commentsGetOne,
        };
      }

      if (name === 'offers') {
        return {
          getFullList: offersGetFullList,
        };
      }

      throw new Error(`Unknown collection: ${name}`);
    }),
  };

  return {
    mockGetOfferById,
    bookingsGetList,
    commentsGetFullList,
    commentsGetList,
    commentsCreate,
    commentsUpdate,
    commentsGetOne,
    offersGetFullList,
    pbMock,
  };
});

vi.mock('../lib/pocketbase', () => ({
  default: pbMock,
}));

vi.mock('../lib/offers', () => ({
  getOfferById: mockGetOfferById,
}));

import {
  canCurrentUserAddOfferComment,
  getOrganizerReviewsSummary,
  isOfferFinished,
  upsertCurrentUserOfferComment,
} from '../lib/comments';

function makeOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'offer-1',
    organizer_id: 'organizer-1',
    title: 'Rejs testowy',
    country: 'PL',
    date_from: '2020-06-01',
    date_to: '2020-06-07',
    port: 'Gdańsk',
    currency: 'PLN',
    created: '2020-01-01T00:00:00.000Z',
    updated: '2020-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('comments lib', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pbMock.authStore.record = null;
  });

  describe('isOfferFinished', () => {
    it('returns true for past offers', () => {
      const offer = makeOffer({ date_to: '2020-01-10' });
      expect(isOfferFinished(offer)).toBe(true);
    });

    it('returns false for future offers', () => {
      const offer = makeOffer({ date_to: '2099-01-10' });
      expect(isOfferFinished(offer)).toBe(false);
    });
  });

  describe('canCurrentUserAddOfferComment', () => {
    it('returns false when user is not logged in', async () => {
      const result = await canCurrentUserAddOfferComment('offer-1');
      expect(result).toBe(false);
    });

    it('returns false when current user is organizer', async () => {
      pbMock.authStore.record = { id: 'organizer-1' };
      mockGetOfferById.mockResolvedValue(makeOffer({ organizer_id: 'organizer-1' }));

      const result = await canCurrentUserAddOfferComment('offer-1');
      expect(result).toBe(false);
    });

    it('returns true for confirmed participant on past offer', async () => {
      pbMock.authStore.record = { id: 'user-1' };
      mockGetOfferById.mockResolvedValue(makeOffer({ organizer_id: 'organizer-1', date_to: '2020-01-10' }));
      bookingsGetList.mockResolvedValue({ totalItems: 1 });

      const result = await canCurrentUserAddOfferComment('offer-1');
      expect(result).toBe(true);
      expect(bookingsGetList).toHaveBeenCalled();
    });
  });

  describe('upsertCurrentUserOfferComment', () => {
    it('creates comment when it does not exist yet', async () => {
      pbMock.authStore.record = { id: 'user-1' };
      mockGetOfferById.mockResolvedValue(makeOffer({ organizer_id: 'organizer-2', date_to: '2020-01-10' }));
      bookingsGetList.mockResolvedValue({ totalItems: 1 });
      commentsGetList.mockResolvedValue({ totalItems: 0, items: [] });
      commentsCreate.mockResolvedValue({ id: 'comment-1' });
      commentsGetOne.mockResolvedValue({
        id: 'comment-1',
        offer_id: 'offer-1',
        user_id: 'user-1',
        rating: 5,
        content: 'Super rejs',
        created: '2020-01-01T00:00:00.000Z',
        updated: '2020-01-01T00:00:00.000Z',
        expand: {
          user_id: { name: 'Jan' },
          offer_id: { title: 'Rejs testowy' },
        },
      });

      const saved = await upsertCurrentUserOfferComment({
        offerId: 'offer-1',
        rating: 5,
        content: '  Super rejs  ',
      });

      expect(commentsCreate).toHaveBeenCalledWith({
        offer_id: 'offer-1',
        user_id: 'user-1',
        rating: 5,
        content: 'Super rejs',
      });
      expect(saved.id).toBe('comment-1');
      expect(saved.author_name).toBe('Jan');
    });

    it('updates comment when user already has one for offer', async () => {
      pbMock.authStore.record = { id: 'user-1' };
      mockGetOfferById.mockResolvedValue(makeOffer({ organizer_id: 'organizer-2', date_to: '2020-01-10' }));
      bookingsGetList.mockResolvedValue({ totalItems: 1 });
      commentsGetList
        .mockResolvedValueOnce({
          totalItems: 1,
          items: [
            {
              id: 'comment-old',
              offer_id: 'offer-1',
              user_id: 'user-1',
              rating: 4,
              content: 'Było ok',
              created: '2020-01-01T00:00:00.000Z',
              updated: '2020-01-01T00:00:00.000Z',
              expand: {},
            },
          ],
        })
        .mockResolvedValueOnce({
          totalItems: 1,
          items: [
            {
              id: 'comment-old',
              offer_id: 'offer-1',
              user_id: 'user-1',
              rating: 3,
              content: 'Po edycji',
              created: '2020-01-01T00:00:00.000Z',
              updated: '2020-01-02T00:00:00.000Z',
              expand: {},
            },
          ],
        });
      commentsUpdate.mockResolvedValue({ id: 'comment-old' });
      commentsGetOne.mockResolvedValue({
        id: 'comment-old',
        offer_id: 'offer-1',
        user_id: 'user-1',
        rating: 3,
        content: 'Po edycji',
        created: '2020-01-01T00:00:00.000Z',
        updated: '2020-01-02T00:00:00.000Z',
        expand: {},
      });

      const saved = await upsertCurrentUserOfferComment({
        offerId: 'offer-1',
        rating: 3,
        content: 'Po edycji',
      });

      expect(commentsUpdate).toHaveBeenCalledWith('comment-old', {
        offer_id: 'offer-1',
        user_id: 'user-1',
        rating: 3,
        content: 'Po edycji',
      });
      expect(saved.id).toBe('comment-old');
    });

    it('throws when rating is outside 1-5', async () => {
      pbMock.authStore.record = { id: 'user-1' };
      mockGetOfferById.mockResolvedValue(makeOffer({ organizer_id: 'organizer-2', date_to: '2020-01-10' }));
      bookingsGetList.mockResolvedValue({ totalItems: 1 });

      await expect(
        upsertCurrentUserOfferComment({
          offerId: 'offer-1',
          rating: 6,
          content: 'test',
        })
      ).rejects.toThrow('Ocena musi być w zakresie 1-5');
    });
  });

  describe('getOrganizerReviewsSummary', () => {
    it('filters reviews by exact stars', async () => {
      offersGetFullList.mockResolvedValue([
        { id: 'offer-1', date_from: '2020-01-01', date_to: '2020-01-02' },
      ]);
      commentsGetFullList.mockResolvedValue([
        {
          id: 'c1',
          offer_id: 'offer-1',
          user_id: 'u1',
          rating: 5,
          content: 'Świetnie',
          created: '2020-01-10T00:00:00.000Z',
          updated: '2020-01-10T00:00:00.000Z',
          expand: { user_id: { name: 'A' }, offer_id: { title: 'R1' } },
        },
        {
          id: 'c2',
          offer_id: 'offer-1',
          user_id: 'u2',
          rating: 3,
          content: 'OK',
          created: '2020-01-09T00:00:00.000Z',
          updated: '2020-01-09T00:00:00.000Z',
          expand: { user_id: { name: 'B' }, offer_id: { title: 'R1' } },
        },
      ]);

      const summary = await getOrganizerReviewsSummary({
        organizerId: 'organizer-1',
        ratingFilter: 3,
      });

      expect(summary.totalReviews).toBe(2);
      expect(summary.lowRatingsCount).toBe(1);
      expect(summary.reviews).toHaveLength(1);
      expect(summary.reviews[0].rating).toBe(3);
    });
  });
});
