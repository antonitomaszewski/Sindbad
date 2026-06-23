// wysyłanie emaili
// mamy 3 rodzaje:
// 1. zmiana statusu rezerwacji: do załoganta
// 2. nowa rezerwacja: do załoganta i do organizaotra
// 3. nowe zapytanie: -||-
'use server';
import { Resend } from 'resend';
import type { Offer } from '../types/offer';
import type { BookingStatus, GuestBookingData, Booking } from '../types/booking';
import { formatDateRange } from '@/look/utils/dateFormatter';
import {
  newBookingTemplate,
  bookingConfirmationTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
  questionToOrganizerTemplate,
  questionConfirmationTemplate,
} from './emailTemplates';
import { getUser } from './users';
import pb from './pocketbase';
import { getOfferById } from './offers';

const resend = new Resend(process.env.RESEND_API_KEY);
// zostawiam noreply@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM || 'noreply@resend.dev';
const DEFAULT_BOOKING_NAME = 'Rezerwujący';
const DEFAULT_ASKER_NAME = 'Użytkowniku';

// funkcja wysyłająca email, nadawca to zawsze RESEND_FROM - my
// ustawiamy adresata, tytuł, treść
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!to || !to.includes('@')) {
    return { success: false, error: 'Invalid email' };
  }
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (error) {
    return { success: false, error: 'Failed to send email' };
  }
}

// funkcja używana przy zmianie statusu rezerwacji
// pobieramy: adresata, szablon wiadomości (potwierdzona lub odrzucona)
// dane do szablonu
export async function sendBookingStatusEmail({
  booking,
  offer,
  status,
}: {
  booking: Booking;
  offer: Offer;
  status: BookingStatus;
}) {
  if (status !== 'confirmed' && status !== 'rejected') {
    return;
  }

  let recipientEmail = booking.guest_email || null;
  let recipientName = booking.guest_name || DEFAULT_BOOKING_NAME;

  if (!recipientEmail && booking.user_id) {
    const user = await getUser(booking.user_id);
    recipientEmail = user?.email || null;
    recipientName = booking.guest_name || user?.name || DEFAULT_BOOKING_NAME;
  }

  if (!recipientEmail) {
    return;
  }

  const dateRange = formatDateRange(offer.date_from, offer.date_to);

  if (status === 'confirmed') {
    await sendEmail({
      to: recipientEmail,
      subject: `✓ Rezerwacja potwierdzona: ${offer.title}`,
      html: bookingConfirmedTemplate({
        recipientName,
        offerTitle: offer.title,
        offerDate: dateRange,
      }),
    });

    return;
  }

  await sendEmail({
    to: recipientEmail,
    subject: `✗ Rezerwacja odrzucona: ${offer.title}`,
    html: bookingRejectedTemplate({
      recipientName,
      offerTitle: offer.title,
      offerDate: dateRange,
    }),
  });
}

// mail rezerwacji
export async function sendBookingEmails({
  offer,
  offerId,
  message,
  guestData,
  bookingRecipient,
}: {
  offer: Offer;
  offerId: string;
  message?: string;
  guestData?: GuestBookingData;
  bookingRecipient?: {
    email?: string;
    name?: string;
  };
}) {
  const recipientEmail =
    guestData?.email || bookingRecipient?.email;
  const recipientName =
    guestData?.name || bookingRecipient?.name || DEFAULT_BOOKING_NAME;
  const dateRange = formatDateRange(offer.date_from, offer.date_to);

  if (recipientEmail) {
    await sendEmail({
      to: recipientEmail,
      subject: `Rezerwacja wysłana: ${offer.title}`,
      html: bookingConfirmationTemplate({
        recipientName,
        offerTitle: offer.title,
        offerDate: dateRange,
      }),
    });
  }

  const organizer = await getUser(offer.organizer_id);

  if (organizer?.email) {
    await sendEmail({
      to: organizer.email,
      subject: `Nowa rezerwacja: ${offer.title}`,
      html: newBookingTemplate({
        recipientName: organizer.name || 'Organizatorze',
        offerTitle: offer.title,
        offerDate: dateRange,
        message,
        bookingLink: `${process.env.NEXT_PUBLIC_BASE_URL}/oferta/${offerId}`,
      }),
    });
  }
}

// mail zapytania
export async function sendOfferQuestionEmails({
  offer,
  question,
  askerEmail,
  askerName,
}: {
  offer: Offer;
  question: string;
  askerEmail: string;
  askerName?: string;
}) {
  const organizer = await getUser(offer.organizer_id);
  const dateRange = formatDateRange(offer.date_from, offer.date_to);
  const offerLink = `${process.env.NEXT_PUBLIC_BASE_URL}/oferta/${offer.id}`;

  if (organizer?.email) {
    await sendEmail({
      to: organizer.email,
      subject: `Nowe pytanie do oferty: ${offer.title}`,
      html: questionToOrganizerTemplate({
        recipientName: organizer.name || 'Organizatorze',
        offerTitle: offer.title,
        offerDate: dateRange,
        askerEmail,
        question,
        offerLink,
      }),
    });
  }

  await sendEmail({
    to: askerEmail,
    subject: `Potwierdzenie wysłania pytania: ${offer.title}`,
    html: questionConfirmationTemplate({
      recipientName: askerName || DEFAULT_ASKER_NAME,
      offerTitle: offer.title,
      offerDate: dateRange,
      askerEmail,
      question,
      offerLink,
    }),
  });
}


// uzywane w miejscu oferty, gdy zalogowany uzytkownik / lub niezalogowany uzytkownik
// chce zadac pytanie do organizatora, nie dokonując rezerwacji
// bierzemy treśc wiadomości oraz email i wysyłamy na adres organizatora oferty
export async function sendOfferQuestion({
  offerId,
  email,
  message,
}: {
  offerId: string;
  email: string;
  message: string;
}): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedMessage = message.trim();

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Podaj poprawny email');
  }

  if (!trimmedMessage) {
    throw new Error('Podaj treść pytania');
  }

  const offer = await getOfferById(offerId);

  if (!offer) {
    throw new Error('Oferta nie istnieje');
  }

  await sendOfferQuestionEmails({
    offer,
    question: trimmedMessage,
    askerEmail: normalizedEmail,
    askerName: pb.authStore.record?.name || DEFAULT_ASKER_NAME,
  });
}
