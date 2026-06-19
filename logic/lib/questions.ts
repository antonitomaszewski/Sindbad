import pb from './pocketbase';
import { getOfferById } from './offers';
import { sendOfferQuestionEmails } from './emails';

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
    askerName: pb.authStore.record?.name || undefined,
  });
}
