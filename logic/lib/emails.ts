'use server';

import { Resend } from 'resend';
import type { Offer } from '../types/offer';
import type { BookingStatus, GuestBookingData } from '../types/booking';
import { formatDateRange } from './dates';
import {
  newBookingTemplate,
  bookingConfirmationTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
  questionToOrganizerTemplate,
  questionConfirmationTemplate,
} from './emailTemplates';
import pb from './pocketbase';
import { getUser } from './users';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM || 'noreply@resend.dev';
const DEFAULT_BOOKING_NAME = 'Rezerwujący';
const DEFAULT_ASKER_NAME = 'Użytkowniku';

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
    console.warn(`Invalid email: ${to}`);
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
      console.error('Email send error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Email sent:', {
      to,
      subject,
      id: result.data?.id,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendBookingStatusEmail({
  booking,
  offer,
  status,
}: {
  booking: {
    id?: string;
    user_id?: string;
    guest_email?: string;
    guest_name?: string;
  };
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
    guestData?.email || bookingRecipient?.email || pb.authStore.record?.email;
  const recipientName =
    guestData?.name || bookingRecipient?.name || pb.authStore.record?.name || DEFAULT_BOOKING_NAME;
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
      question,
      offerLink,
    }),
  });
}