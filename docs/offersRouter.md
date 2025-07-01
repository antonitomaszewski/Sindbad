import pb from './pocketbase';
import { Offer } from '../types/offer';

export async function getOffers(): Promise<Offer[]> {
  const result = await pb.collection('offers').getFullList();
  return result as Offer[];
}

export async function createOffer(data: Partial<Offer>) {
  return await pb.collection('offers').create(data);
}

// Pobierz szczegóły oferty po ID
export async function getOfferById(id: string): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').getOne(id);
    return record as Offer;
  } catch (error) {
    return null;
  }
}

// Edytuj ofertę (organizator)
export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').update(id, data);
    return record as Offer;
  } catch (error) {
    return null;
  }
}

// Usuń ofertę (organizator)
export async function deleteOffer(id: string): Promise<boolean> {
  try {
    await pb.collection('offers').delete(id);
    return true;
  } catch (error) {
    return false;
  }
}