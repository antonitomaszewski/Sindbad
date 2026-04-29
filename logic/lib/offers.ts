import pb from './pocketbase';
import { Offer } from '../types/offer';

export async function getOffers(): Promise<Offer[]> {
  const result = await pb.collection('offers').getFullList();
  return result as unknown as Offer[];
}

export async function createOffer(data: Partial<Offer>) {
  return await pb.collection('offers').create(data);
}

// Pobierz szczegóły oferty po ID
export async function getOfferById(id: string): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').getOne(id);
    return record as unknown as Offer;
  } catch (error) {
    return null;
  }
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 200;

function mapOfferToTrip(t: any) {
  return {
    id: t.id,
    title: t.title ?? t.name ?? 'Rejs',
    date: t.date_from ?? t.date_to ?? undefined,
  } as { id: string; title?: string; date?: string };
}

// Bezpieczny helper do pobierania listy (obsługuje perPage i zwraca [] na błąd)
async function safeGetFullList(collection: string, query: any = {}, perPage = DEFAULT_PER_PAGE) {
  try {
    // pb.collection(...).getFullList(options, perPage)
    const records: any[] = await (pb.collection(collection) as any).getFullList(query, perPage);
    return Array.isArray(records) ? records : [];
  } catch (err) {
    console.warn(`safeGetFullList ${collection} failed`, err);
    return [];
  }
}

export async function getTripsByOrganizer(organizerId: string) {
  const records = await safeGetFullList('offers', { filter: `organizer_id = "${organizerId}"`, sort: '-date_from' });
  return records.map(mapOfferToTrip);
}

export async function getTripsByParticipant(userId: string) {
  // najpierw spróbuj serwerowego filtra
  const serverRecords = await safeGetFullList('offers', { filter: `participants = "${userId}"`, sort: '-date_from' });
  if (serverRecords.length) return serverRecords.map(mapOfferToTrip);

  // fallback: pobierz wszystkie i filtruj lokalnie (bezpieczne)
  const all = await safeGetFullList('offers');
  const filtered = all.filter((t: any) => {
    if (Array.isArray(t.participants)) return t.participants.map(String).includes(String(userId));
    if (Array.isArray(t.expand?.participants)) return t.expand.participants.map((p: any) => String(p.id)).includes(String(userId));
    return false;
  });
  return filtered.map(mapOfferToTrip);
}

// Edytuj ofertę (organizator)
export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').update(id, data);
    return record as unknown as Offer;
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