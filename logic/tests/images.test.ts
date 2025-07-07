import { getOfferImages, getOfferPrimaryImage } from '../lib/images';
import { describe, it, expect } from "vitest";

describe('Images API', () => {
  it('getOfferImages returns array', async () => {
    const images = await getOfferImages('test-offer-id');
    expect(Array.isArray(images)).toBe(true);
  });

  it('getOfferPrimaryImage returns primary image', async () => {
    const primaryImage = await getOfferPrimaryImage('test-offer-id');
    expect(primaryImage?.is_primary).toBe(true);
  });
});