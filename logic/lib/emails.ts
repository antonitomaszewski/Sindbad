'use server';

import { Resend } from 'resend';
import type {Offer} from '../types/offer'
import type {BookingStatus} from '../types/booking';
import {formatDateRange} from './dates';
import {
  newBookingTemplate,
  bookingConfirmationTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
} from './emailTemplates';
import pb from './pocketbase';
import type {GuestBookingData} from '../types/booking';
import {getUser} from './users';

const resend = new Resend(process.env.RESEND_API_KEY);

// const FROM_EMAIL = 'noreply@sindbad.pl';
const FROM_EMAIL = 'noreply@resend.dev';

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
  booking: any;
  offer: Offer;
  status: BookingStatus;
}) {
  const guestEmail = booking.guest_email;

  if (!guestEmail) {
    return;
  }

  const guestName =
    booking.guest_name || 'Rezerwujący';

  const dateRange = formatDateRange(
    offer.date_from,
    offer.date_to
  );

  if (status === 'confirmed') {
    await sendEmail({
      to: guestEmail,
      subject: `✓ Rezerwacja potwierdzona: ${offer.title}`,
      html: bookingConfirmedTemplate({
        recipientName: guestName,
        offerTitle: offer.title,
        offerDate: dateRange,
      }),
    });

    return;
  }

  if (status === 'cancelled') {
    await sendEmail({
      to: guestEmail,
      subject: `✗ Rezerwacja odrzucona: ${offer.title}`,
      html: bookingRejectedTemplate({
        recipientName: guestName,
        offerTitle: offer.title,
        offerDate: dateRange,
      }),
    });
  }
}

export async function sendBookingEmails({
  offer,
  offerId,
  message,
  guestData,
}: {
  offer: Offer;
  offerId: string;
  message?: string;
  guestData?: GuestBookingData;
}) {
  const guestEmail =
    guestData?.email ||
    pb.authStore.record?.email;

  const guestName =
    guestData?.name ||
    pb.authStore.record?.name;

  const dateRange = formatDateRange(
    offer.date_from,
    offer.date_to
  );

  if (guestEmail) {
    await sendEmail({
      to: guestEmail,
      subject: `Rezerwacja wysłana: ${offer.title}`,
      html: bookingConfirmationTemplate({
        recipientName: guestName,
        offerTitle: offer.title,
        offerDate: dateRange,
      }),
    });
  }

    // Mail do organizatora
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