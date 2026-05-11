import pb from './pocketbase';
import type { TripAlert, TripAlertNotification } from '../types/tripAlert';
import type { Offer } from '../types/offer';
import { sendEmail } from './emails';

const ALERTS_COLLECTION = 'trip_alerts';
const NOTIFICATIONS_COLLECTION = 'trip_alert_notifications';

/**
 * Stwórz nowy alert o rejsach
 */
export async function createTripAlert(
  userId: string,
  data: {
    country?: string;
    date_from?: string;
    date_to?: string;
    organizer_id?: string;
  }
): Promise<TripAlert> {
  try {
    const record = await pb.collection(ALERTS_COLLECTION).create({
      user_id: userId,
      country: data.country || '',
      date_from: data.date_from || '',
      date_to: data.date_to || '',
      organizer_id: data.organizer_id || '',
      active: true,
    });

    return record as unknown as TripAlert;
  } catch (err: any) {
    throw new Error(err?.response?.message || 'Nie udało się utworzyć alertu');
  }
}

/**
 * Pobierz alerty użytkownika
 */
export async function getUserTripAlerts(userId: string): Promise<TripAlert[]> {
  try {
    const records = await pb.collection(ALERTS_COLLECTION).getFullList({
      filter: `user_id = "${userId}"`,
      sort: '-created',
    });

    return records as unknown as TripAlert[];
  } catch (err) {
    console.warn('getUserTripAlerts error:', err);
    return [];
  }
}

/**
 * Usuń alert
 */
export async function deleteTripAlert(alertId: string): Promise<void> {
  try {
    await pb.collection(ALERTS_COLLECTION).delete(alertId);
  } catch (err: any) {
    throw new Error('Nie udało się usunąć alertu');
  }
}

/**
 * Sprawdź czy alert pasuje do oferty
 */
export function doesAlertMatchOffer(alert: TripAlert, offer: Offer): boolean {
  // Country match (jeśli alert ma ustawiony country)
  if (alert.country && alert.country !== offer.country) {
    return false;
  }

  // Organizer match (jeśli alert ma ustawionego organizatora)
  if (alert.organizer_id && alert.organizer_id !== offer.organizer_id) {
    return false;
  }

  // Date overlap (jeśli alert ma zakresy dat)
  if (alert.date_from && alert.date_to && offer.date_from && offer.date_to) {
    const alertFrom = new Date(alert.date_from);
    const alertTo = new Date(alert.date_to);
    const offerFrom = new Date(offer.date_from);
    const offerTo = new Date(offer.date_to);

    // Brak overlap jeśli alert kończy się przed ofertą lub zaczyna się po ofercie
    if (alertTo < offerFrom || alertFrom > offerTo) {
      return false;
    }
  }

  return true;
}

/**
 * Znajdź wszystkie alerty pasujące do oferty
 */
export async function findMatchingAlerts(offer: Offer): Promise<TripAlert[]> {
  try {
    const allAlerts = await pb.collection(ALERTS_COLLECTION).getFullList({
      filter: 'active = true',
    });

    const matching = (allAlerts as unknown as TripAlert[]).filter((alert) =>
      doesAlertMatchOffer(alert, offer)
    );

    return matching;
  } catch (err) {
    console.warn('findMatchingAlerts error:', err);
    return [];
  }
}

/**
 * Sprawdź czy już wysłaliśmy powiadomienie dla tej pary (alert, offer)
 */
async function hasNotificationBeenSent(alertId: string, offerId: string): Promise<boolean> {
  try {
    const list = await pb.collection(NOTIFICATIONS_COLLECTION).getList(1, 1, {
      filter: `alert_id = "${alertId}" && offer_id = "${offerId}"`,
    });

    return list.totalItems > 0;
  } catch (err) {
    console.warn('hasNotificationBeenSent error:', err);
    return false;
  }
}

/**
 * Zapamiętaj że wysłaliśmy powiadomienie
 */
async function recordNotification(alertId: string, offerId: string): Promise<void> {
  try {
    await pb.collection(NOTIFICATIONS_COLLECTION).create({
      alert_id: alertId,
      offer_id: offerId,
    });
  } catch (err) {
    console.warn('recordNotification error:', err);
  }
}

/**
 * Pobierz email użytkownika
 */
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const user = await pb.collection('users').getOne(userId);
    return user.email || null;
  } catch (err) {
    console.warn('getUserEmail error:', err);
    return null;
  }
}

/**
 * Wyślij notyfikacje maila dla pasujących alertów
 */
export async function sendTripAlertNotifications(offer: Offer): Promise<void> {
  try {
    const matchingAlerts = await findMatchingAlerts(offer);

    for (const alert of matchingAlerts) {
      // Sprawdź czy już wysłaliśmy powiadomienie
      const alreadySent = await hasNotificationBeenSent(alert.id, offer.id);
      if (alreadySent) {
        continue;
      }

      // Pobierz email użytkownika
      const userEmail = await getUserEmail(alert.user_id);
      if (!userEmail) {
        continue;
      }

      // Wyślij email
      await sendEmail({
        to: userEmail,
        subject: `Nowy rejs: ${offer.title}`,
        html: buildTripAlertEmail(offer),
      });

      // Zapamiętaj że wysłaliśmy powiadomienie
      await recordNotification(alert.id, offer.id);
    }
  } catch (err) {
    console.warn('sendTripAlertNotifications error:', err);
  }
}

/**
 * Prosty szablon emaila
 */
function buildTripAlertEmail(offer: Offer): string {
  const dateFrom = offer.date_from ? new Date(offer.date_from).toLocaleDateString('pl-PL') : '?';
  const dateTo = offer.date_to ? new Date(offer.date_to).toLocaleDateString('pl-PL') : '?';
  const offerUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/oferta/${offer.id}`;

  return `
    <h2>${offer.title}</h2>
    <p><strong>Termin:</strong> ${dateFrom} - ${dateTo}</p>
    <p><strong>Lokalizacja:</strong> ${offer.country || '?'}, ${offer.port || '?'}</p>
    <p><strong>Cena:</strong> ${offer.price_per_person || 0} ${offer.currency || 'PLN'}/os</p>
    <p>
      <a href="${offerUrl}" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
        Zobacz szczegóły
      </a>
    </p>
  `;
}
