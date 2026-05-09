import pb from './pocketbase';
import type { Offer, OfferFormData } from '../types/offer';

export async function getOffers(): Promise<Offer[]> {
  const result = await pb.collection('offers').getFullList();
  return result as unknown as Offer[];
}

export async function createOffer(data: Partial<Offer>) {
  return await pb.collection('offers').create(data);
}

export async function getOfferById(id: string): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').getOne(id);
    return record as unknown as Offer;
  } catch (error) {
    return null;
  }
}

// Helper do mapowania oferty na trip (dla kompatybilności z master)
function mapOfferToTrip(t: any) {
  return {
    id: t.id,
    title: t.title ?? t.name ?? 'Rejs',
    date: t.date_from ?? t.date_to ?? undefined,
  } as { id: string; title?: string; date?: string };
}

// Pobierz rejsy organizatora
export async function getTripsByOrganizer(organizerId: string) {
  try {
    const records: any[] = await (pb.collection('offers') as any).getFullList(
      { filter: `organizer_id = "${organizerId}"`, sort: '-date_from' },
      200
    );
    return records.map(mapOfferToTrip);
  } catch (err) {
    console.error('getTripsByOrganizer error', err);
    return [];
  }
}

// Pobierz rejsy uczestnika
export async function getTripsByParticipant(userId: string) {
  try {
    const serverRecords: any[] = await (pb.collection('offers') as any).getFullList(
      { filter: `participants = "${userId}"`, sort: '-date_from' },
      200
    );
    if (serverRecords.length) {
      return serverRecords.map(mapOfferToTrip);
    }

    // Fallback: pobierz wszystkie i filtruj lokalnie
    const all: any[] = await (pb.collection('offers') as any).getFullList({}, 200);
    const filtered = all.filter((t: any) => {
      if (Array.isArray(t.participants)) return t.participants.map(String).includes(String(userId));
      if (Array.isArray(t.expand?.participants)) return t.expand.participants.map((p: any) => String(p.id)).includes(String(userId));
      return false;
    });
    return filtered.map(mapOfferToTrip);
  } catch (err) {
    console.error('getTripsByParticipant error', err);
    return [];
  }
}

// Wyszukaj oferty (nowa funkcja z brancha szukaj)
export async function searchOffers(params: { 
  q?: string; 
  dateFrom?: string; 
  dateTo?: string; 
  onlyFuture?: boolean;
}) {
  const parts: string[] = [];
  
  if (params.q) {
    parts.push(`(title ~= "${params.q}" || description ~= "${params.q}")`);
  }

  const filter = parts.length ? parts.join(' && ') : undefined;

  try {
    const records: any[] = await (pb.collection('offers') as any).getFullList({ 
      filter, 
      sort: '-date_from',
      requestKey: 'search-offers',
    });
    
    let results = records.map((t) => ({
      id: t.id,
      organizer_id: t.organizer_id,
      title: t.title ?? 'Rejs',
      description: t.description,
      date_from: t.date_from,
      date_to: t.date_to,
      location: t.location,
      geo: t.geo,
      port: t.port,
      country: t.country,
      price_per_person: t.price_per_person,
      currency: t.currency,
      seats_total: t.seats_total,
      seats_available: t.seats_available,
      created: t.created,
      updated: t.updated,
    }));

    // Filtruj daty lokalnie (unikamy problemów UTC)
    if (params.dateFrom) {
      results = results.filter((o: any) => {
        if (!o.date_from) return false;
        return o.date_from.slice(0, 10) >= params.dateFrom!;
      });
    }
    
    if (params.dateTo) {
      results = results.filter((o: any) => {
        if (!o.date_to) return false;
        return o.date_to.slice(0, 10) <= params.dateTo!;
      });
    }

    if (params.onlyFuture) {
      const now = new Date().toISOString().slice(0, 10);
      results = results.filter((o: any) => {
        if (!o.date_from) return false;
        return o.date_from.slice(0, 10) >= now;
      });
    }

    return results;
  } catch (err) {
    console.error('searchOffers error', err);
    return [];
  }
}

// Edytuj ofertę
export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').update(id, data);
    return record as unknown as Offer;
  } catch (error) {
    return null;
  }
}

// Usuń ofertę
export async function deleteOffer(id: string): Promise<boolean> {
  try {
    await pb.collection('offers').delete(id);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Konwertuj dane formularza do formatu API
 */
export function convertFormDataToOffer(
  formData: OfferFormData,
  organizerId: string
): Partial<Offer> {
  const offer: any = {
    organizer_id: organizerId,
    title: formData.title.trim(),
    date_from: formData.date_from!.toISOString().split('T')[0],
    date_to: formData.date_to!.toISOString().split('T')[0],
    country: formData.country,
    port: formData.port.trim(),
    currency: formData.currency,
  };

  // Opcjonalne pola
  if (formData.description?.trim()) {
    offer.description = formData.description.trim();
  }
  if (formData.price_per_person) {
    offer.price_per_person = Number(formData.price_per_person);
  }
  if (formData.seats_total) {
    offer.seats_total = Number(formData.seats_total);
  }
  if (formData.seats_available) {
    offer.seats_available = Number(formData.seats_available);
  }

  return offer;
}

export function isCurrentUserOrganizer(offer: Offer): boolean {
  return pb.authStore.record?.id === offer.organizer_id;
}