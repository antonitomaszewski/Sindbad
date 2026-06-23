import { describe, it, expect, vi } from "vitest";
import { isOfferFinished } from "../lib/comments";

vi.mock('../lib/emails', () => ({
  sendBookingEmails: vi.fn().mockResolvedValue(undefined),
  sendBookingStatusEmail: vi.fn().mockResolvedValue(undefined),
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
    expect(isOfferFinished(offer)).toBe(true);
  });

  it('returns false for future offer', () => {
    const offer = { date_to: '2027-01-01'} as any;
    expect(isOfferFinished(offer)).toBe(false);
  })
})
