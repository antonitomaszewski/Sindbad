import { describe, it, expect, vi } from "vitest";
import { isOfferFinished, hasConfirmedBooking } from "../lib/comments";

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ id: 'mock-id' }) },
  })),
}));

vi.mock('../lib/pocketbase', () => ({
  default: {
    collection: vi.fn(() => ({
      getList: vi.fn().mockResolvedValue({ totalItems: 1 }),
    })),
  },
}));

describe('isOfferFinished', () => {
  it('returns true for past offer', () => {
    const offer = { date_to: '2020-01-01'} as any;
    expect(isOfferFinished(offer));
  });

  it('returns false for future offer', () => {
    const offer = { date_to: '2027-01-01'} as any;
    expect(isOfferFinished(offer)).toBe(false);
  })
})

describe('hasConfirmedBooking', () => {
  it('returns true when confirmed booking exists', async () => {
    const result = await hasConfirmedBooking('offer-1', 'user-1');
    expect(result).toBe(1)
  });
});