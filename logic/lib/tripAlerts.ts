// mamy tutaj powiadomienia o rejsach
// jak pojawi się rejs, który nas interesuje to dostajemy powiadomienie email
// ustawianie rejsów które nas interesują jest na 2 sposoby:
// 1. na profilu uzytkownika w sekcji powiadomien
// 2. na ofercie - u dołu sa 3 przyciski: rezerwacja, zapytanie, utworzenie alertu
// zawsze mozemy powiadmoenia usuwać i edytować
// ogólnie sa to wszystko proste funkcje, każda z komentarzem
import pb from './pocketbase';
import type { TripAlert } from '../types/tripAlert';
import type { Offer } from '../types/offer';
import { sendEmail } from './emails';
import {buildTripAlertEmail} from './emailTemplates';
import {getUserEmail} from './users';

const ALERTS_COLLECTION = 'trip_alerts';
const NOTIFICATIONS_COLLECTION = 'trip_alert_notifications';

// tworzenie alertu
// mamy uzytkownika i cechy filtrowania: kraj, organizator, zakres dat od do
export async function createTripAlert(
  userId: string,
  data: {
    country?: string;
    date_from?: string;
    date_to?: string;
    organizer_id?: string;
  }
): Promise<TripAlert> {
  return await pb.collection(ALERTS_COLLECTION).create({
     user_id: userId,
     country: data.country || '',
     date_from: data.date_from || '',
     date_to: data.date_to || '',
     organizer_id: data.organizer_id || '',
   });
}

// powiadomienia możemy altualizować - tu zwykły więc update
export async function updateTripAlert(
  alertId: string,
  data: {
    country?: string;
    date_from?: string;
    date_to?: string;
    organizer_id?: string;
  }
): Promise<TripAlert> {
  return await pb.collection(ALERTS_COLLECTION).update(alertId, {
      country: data.country ?? '',
      date_from: data.date_from ?? '',
      date_to: data.date_to ?? '',
      organizer_id: data.organizer_id ?? '',
    });
}

// pobieram powiadomienia uzytkownika, by wyswietlic je u jego na profilu
// potem moze sobie je wybrac do edycji
// używane w TripAlertsList (komponent na Profilu)
export async function getUserTripAlerts(userId: string): Promise<TripAlert[]> {
  return await pb.collection(ALERTS_COLLECTION).getFullList({
      filter: `user_id = "${userId}"`,
    });
}

// usuwamy powiadomienie
export async function deleteTripAlert(alertId: string): Promise<void> {
  await pb.collection(ALERTS_COLLECTION).delete(alertId);
}

// sprawdzamy czy dany alert ma filtry odpowiadające cechom oferty
// mamy do sprawdzenia: kraj, organizatora i zakres dat
// w sumie tu mam warunek tylko jak obie daty są wypełnione, a nie tylko jedna
// czyli jak uzupełnimy datę po 2027. to nawet rejs w 2026 moze wpaść
// ale no trudno
export function doesAlertMatchOffer(alert: TripAlert, offer: Offer): boolean {
  if (alert.country && alert.country !== offer.country) {
    return false;
  }
  if (alert.organizer_id && alert.organizer_id !== offer.organizer_id) {
    return false;
  }
  if (alert.date_from && alert.date_to && offer.date_from && offer.date_to) {
    const alertFrom = new Date(alert.date_from);
    const alertTo = new Date(alert.date_to);
    const offerFrom = new Date(offer.date_from);
    const offerTo = new Date(offer.date_to);

    if (alertTo < offerFrom || alertFrom > offerTo) {
      return false;
    }
  }
  return true;
}


// znajdowanie dopasowania oferta - alerty
// bierzemy wszystkie powiadomienia, i filtrujemy po cechach oferty
// czy ma to sens, że nie wykluczamy tutaj samego organizatora z filtrów?
// nie wiem, jest mi to pod względem logicznym obojętne
// pod względem praktycznym to może być spoko - widzimy, ze sie wysyłają powiadomienia "że to nie jest ściema"
export async function findMatchingAlerts(offer: Offer): Promise<TripAlert[]> {
    const allAlerts = await pb.collection(ALERTS_COLLECTION).getFullList({
    }) as TripAlert[];

    const matching = allAlerts.filter((alert) =>
      doesAlertMatchOffer(alert, offer)
    );

    return matching;
}


// w trip_alert_notifications zapisujemy wszystkie wysłane alerty
// tu filtrujemy po tej kolekcji, czy dla danej pary już poszlo powiadomienie.
// mogłoby się obyć bez
async function hasNotificationBeenSent(alertId: string, offerId: string): Promise<boolean> {
    const list = await pb.collection(NOTIFICATIONS_COLLECTION).getList(1, 1, {
      filter: `alert_id = "${alertId}" && offer_id = "${offerId}"`,
    });

    return list.totalItems > 0;
}
// zapisujemy do tablei t_a_n
async function recordNotification(alertId: string, offerId: string): Promise<void> {
  await pb.collection(NOTIFICATIONS_COLLECTION).create({
      alert_id: alertId,
      offer_id: offerId,
    });
}
// wysyłanie powiadomeń po utworzeniu ofety
// naturalnie wykorzystywane w CreateOffer
// w pętli dla wszystkich osób, które się w to wpasowywują
export async function sendTripAlertNotifications(offer: Offer): Promise<void> {
  try {
    const matchingAlerts = await findMatchingAlerts(offer);

    for (const alert of matchingAlerts) {
      const alreadySent = await hasNotificationBeenSent(alert.id, offer.id);
      if (alreadySent) {
        continue;
      }
      const userEmail = await getUserEmail(alert.user_id);
      if (!userEmail) {
        continue;
      }

      await sendEmail({
        to: userEmail,
        subject: `Nowy rejs: ${offer.title}`,
        html: buildTripAlertEmail(offer),
      });

      await recordNotification(alert.id, offer.id);
    }
  } catch (err) {
    console.warn('sendTripAlertNotifications error:', err);
  }
}
