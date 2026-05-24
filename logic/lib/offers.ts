import pb from './pocketbase';
import type { Offer, OfferFormData } from '../types/offer';
import type { BookingStatus } from '../types/booking';
import { sendTripAlertNotifications } from './tripAlerts';

export async function getOffers(): Promise<Offer[]> {
  const result = await pb.collection('offers').getFullList();
  return result as unknown as Offer[];
}

export async function createOffer(data: Partial<Offer>): Promise<Offer> {
  const record = await pb.collection('offers').create(data);

  // Wyślij powiadomienia o nowej ofercie pasującym alertom
  // Fire-and-forget, nie czekamy na wynik
  const offer = record as unknown as Offer;
  sendTripAlertNotifications(offer).catch((err) => {
    console.warn('sendTripAlertNotifications failed:', err);
  });

  return offer;
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
    date_from: t.date_from ?? undefined,
    date_to: t.date_to ?? undefined,
  } as { id: string; title?: string; date_from?: string, date_to?: string };
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

/**
 * Sprawdź czy użytkownik uczestniczy w ofercie organizowanej przez drugiego użytkownika
 * (lub vice versa)
 */
export async function haveCommonOffers(userId1: string, userId2: string): Promise<boolean> {
  try {
    // Oferowań organizowana przez userId2, w których userId1 uczestniczy
    const offersFromUser2: any[] = await (pb.collection('offers') as any).getFullList(
      { filter: `organizer_id = "${userId2}"` },
      200
    );

    const user2OfferIds = new Set(offersFromUser2.map((o) => o.id));

    // Sprawdź czy userId1 ma booking w którejś z ofert organizowanej przez userId2
    const bookingsUser1 = await (pb.collection('bookings') as any).getFullList(
      { filter: `user_id = "${userId1}"` },
      200
    );

    const hasBookingInUser2Offers = bookingsUser1.some((b: any) => user2OfferIds.has(b.offer_id));

    if (hasBookingInUser2Offers) return true;

    // Sprawdź odwrotnie: czy userId2 ma booking w ofercie organizowanej przez userId1
    const offersFromUser1: any[] = await (pb.collection('offers') as any).getFullList(
      { filter: `organizer_id = "${userId1}"` },
      200
    );

    const user1OfferIds = new Set(offersFromUser1.map((o) => o.id));
    const bookingsUser2 = await (pb.collection('bookings') as any).getFullList(
      { filter: `user_id = "${userId2}"` },
      200
    );

    const hasBookingInUser1Offers = bookingsUser2.some((b: any) => user1OfferIds.has(b.offer_id));

    return hasBookingInUser1Offers;
  } catch (err) {
    console.warn('haveCommonOffers error:', err);
    return false;
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

  const lat = Number(formData.geo_lat);
  const lon = Number(formData.geo_lon);
  if (
    formData.geo_lat &&
    formData.geo_lon &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  ) {
    offer.geo = { lat, lon };
  }

  return offer;
}

export function isCurrentUserOrganizer(offer: Offer): boolean {
  return pb.authStore.record?.id === offer.organizer_id;
}

export function validateSeatsAvailable(offer: Offer) {
  if (offer.seats_available !== undefined && offer.seats_available <= 0) {
    throw new Error('Brak dostępnych miejsc');
  }
}

export async function updateAvailableSeats({
  offer,
  previousStatus,
  newStatus,
  bookingUserId,
}: {
  offer: Offer;
  previousStatus: BookingStatus;
  newStatus: BookingStatus;
  bookingUserId?: string;
}) {
  console.log('[offers][updateAvailableSeats] start', {
    offerId: offer.id,
    previousStatus,
    newStatus,
    bookingUserId,
    seatsAvailableBefore: offer.seats_available,
    participantsBefore: Array.isArray((offer as any).participants)
      ? (offer as any).participants
      : [],
  });

  const updateData: any = {};

  if (
    newStatus === 'confirmed' &&
    previousStatus !== 'confirmed' && offer.seats_available
  ) {
    updateData.seats_available = Math.max(0, offer.seats_available - 1);
  }

  if (bookingUserId) {
    const currentParticipants = new Set<string>(
      Array.isArray((offer as any).participants)
        ? (offer as any).participants.map((id: any) => String(id)).filter(Boolean)
        : []
    );

    if (newStatus === 'confirmed' && previousStatus !== 'confirmed') {
      currentParticipants.add(bookingUserId);
      updateData.participants = Array.from(currentParticipants);
      console.log('[offers][updateAvailableSeats] add-participant', {
        offerId: offer.id,
        bookingUserId,
        participantsAfter: updateData.participants,
      });
    }

    if (previousStatus === 'confirmed' && newStatus !== 'confirmed') {
      currentParticipants.delete(bookingUserId);
      updateData.participants = Array.from(currentParticipants);
      console.log('[offers][updateAvailableSeats] remove-participant', {
        offerId: offer.id,
        bookingUserId,
        participantsAfter: updateData.participants,
      });
    }
  }

  if (Object.keys(updateData).length > 0) {
    console.log('[offers][updateAvailableSeats] applying-update', {
      offerId: offer.id,
      updateData,
    });
    await updateOffer(offer.id, updateData);
    console.log('[offers][updateAvailableSeats] update-applied', {
      offerId: offer.id,
    });
    return;
  }

  console.log('[offers][updateAvailableSeats] no-update-needed', {
    offerId: offer.id,
  });
}