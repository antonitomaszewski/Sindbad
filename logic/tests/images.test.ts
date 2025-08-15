import { getOfferImages } from '../lib/images';
import { describe, it, expect } from "vitest";

describe('Images API', () => {
  it('getOfferImages returns array', async () => {
    const images = await getOfferImages('test-offer-id');
    expect(Array.isArray(images)).toBe(true);
  });
});