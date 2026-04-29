import { Offer } from '../types/offer';
import { getOfferImages, getImageUrl } from './images';
import { getUser } from './users';

export async function loadOfferImages(offers: Offer[]): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();

  for (const offer of offers) {
    try {
      const images = await getOfferImages(offer.id);
      if (images.length > 0) {
        const url = getImageUrl(images[0]);
        if (url) imageMap.set(offer.id, url);
      }
    } catch (err) {
      console.warn('Failed to load image for offer', offer.id);
    }
  }

  return imageMap;
}

export async function loadOrganizerNames(offers: Offer[]): Promise<Map<string, string>> {
  const organizerMap = new Map<string, string>();
  const uniqueOrganizerIds = [...new Set(offers.map(o => o.organizer_id).filter(Boolean))];

  for (const organizerId of uniqueOrganizerIds) {
    try {
      const user = await getUser(organizerId!);
      if (user) {
        organizerMap.set(organizerId!, user.name || user.email || 'Organizator');
      }
    } catch (err) {
      console.warn('Failed to load organizer', organizerId);
    }
  }

  return organizerMap;
}