// funkcje do działania na ofertach rejsów
// każda okraszona komentarzem
// tworzenie ofert, aktualizacje rezerwacji na nich, pobieranie do filtrów wyszukiwania

import pb from './pocketbase';
import type { Offer, OfferFormData } from '../types/offer';
import type { BookingStatus } from '../types/booking';
import { sendTripAlertNotifications } from './tripAlerts';
import { todayIso } from '../../look/utils/dateFormatter';
import { format } from 'date-fns';

export async function getOffers(): Promise<Offer[]> {
  const result = await pb.collection('offers').getFullList();
  return result as unknown as Offer[];
}

// tworzenie oferty w formularzu
// przez to ze mamy alerty o rejsach nadchodzacych, to własnie wywołyujemy je tutaj
// jak komus wpadnie rejs, na który miał ochotę - to dostanie maila
export async function createOffer(data: Partial<Offer>): Promise<Offer> {
  const record = await pb.collection('offers').create(data);
  const offer = record as unknown as Offer;
  sendTripAlertNotifications(offer).catch((err) => {
    console.warn('sendTripAlertNotifications failed:', err);
  });

  return offer;
}

// funkcja do pobierania danej oferty, w wielu miejscach w logice uzywana
export async function getOfferById(id: string): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').getOne(id);
    return record as unknown as Offer;
  } catch (error) {
    return null;
  }
}

// Pobierz rejsy organizatora
// wyswietlamy je na UserProfile "Rejsy organizowane"
export async function getTripsByOrganizer(organizerId: string) {
  try {
    const records: any[] = await (pb.collection('offers') as any).getFullList(
      { filter: `organizer_id = "${organizerId}"`, sort: '-date_from' },
      200
    );
    return records;
  } catch (err) {
    console.error('getTripsByOrganizer error', err);
    return [];
  }
}

// funkcja do wyswietlania wszystkich zakończonych rejsow na stronie głównej
// getList(1,1, to paginacja pocketbase, jedna strona, 1 rekord na stronie)
export async function getFinishedOffersCount() {
  return pb.collection('offers').getList(1, 1, {filter: `date_to < "${todayIso()}"`})
  
}

// pobieram wszystkie oferty i filtruję je wedle tego co tam uzytkownik wyklikał 
export async function searchOffers(params: { 
  dateFrom?: string; 
  dateTo?: string; 
  onlyFuture?: boolean;
}) {

  try {
    const records: any[] = await (pb.collection('offers') as any).getFullList({ 
      sort: '-date_from',
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
      results = results.filter((o: any) => {
        if (!o.date_from) return false;
        return o.date_from.slice(0, 10) >= todayIso();
      });
    }

    return results;
  } catch (err) {
    console.error('searchOffers error', err);
    return [];
  }
}

// Edytuj ofertę - jedyne co zmieniamy w trakcie trwania oferty, to jej liczba miejsc
// wykonywana przy zmianach w rezerwacjach
// nie ma panelu zmian w ofertcie dla organizatora
export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
  try {
    const record = await pb.collection('offers').update(id, data);
    return record as unknown as Offer;
  } catch (error) {
    return null;
  }
}

// tutaj był problem z cofaniem się daty o jeden dzień
// bo przechodziłem na utc, a potem na PL.
// i godzina się cofała
// fotmatowanie z ta biblioteką jest lepsze
// po kolei przechodze przez wszystkie dane z formularza,
// waliduję współrzędne jakby ktoś se chciał wpisać 10k
// używane przy tworzeniu ofert
export function convertFormDataToOffer(
  formData: OfferFormData,
  organizerId: string
): Partial<Offer> {
  const offer: any = {
    organizer_id: organizerId,
    title: formData.title.trim(),
    date_from: format(formData.date_from!, 'yyyy-MM-dd'),
    date_to: format(formData.date_to!, 'yyyy-MM-dd'),
    country: formData.country,
    port: formData.port.trim(),
    currency: formData.currency,
  };

  if (formData.yacht_name?.trim()){
    offer.yacht_name = formData.yacht_name.trim();
  }
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

// czy zalogowany jest organizatorem danej oferty
// uzywamy by wyświetlać panel organizatora
export function isCurrentUserOrganizer(offer: Offer): boolean {
  return pb.authStore.record?.id === offer.organizer_id;
}

// sprawdzamy czy mamy dostępne miejsca - by dokonać rezerwacji, uzywamy przy zmianach statusów
export function validateSeatsAvailable(offer: Offer) {
  if (offer.seats_available !== undefined && offer.seats_available <= 0) {
    throw new Error('Brak dostępnych miejsc');
  }
}


// prz zmianie statusu zmieniamy liczbę dostępnych miejsc
// czyli +/- 1 bo na takich przypadkach operujemy
// jeśli był confirmed lub jest confirmed
export async function updateAvailableSeats({
  offer,
  previousStatus,
  newStatus
}: {
  offer: Offer;
  previousStatus: BookingStatus;
  newStatus: BookingStatus;
  bookingUserId?: string;
}) {
  const updateData: any = {};

  if (
    newStatus === 'confirmed' &&
    previousStatus !== 'confirmed' && offer.seats_available
  ) {
    updateData.seats_available = offer.seats_available - 1;
  }

  if (
    previousStatus === 'confirmed' &&
    newStatus !== 'confirmed' && offer.seats_available
  ) {
    updateData.seats_available = offer.seats_available + 1;
  }

  await updateOffer(offer.id, updateData);
}