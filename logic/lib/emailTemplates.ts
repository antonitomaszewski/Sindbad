interface BookingEmailData {
  recipientName: string;
  offerTitle: string;
  offerDate: string;
  organizerName?: string;
  message?: string;
  bookingLink?: string;
}

interface QuestionEmailData {
  recipientName: string;
  offerTitle: string;
  offerDate: string;
  askerEmail: string;
  question: string;
  offerLink?: string;
}

export function newBookingTemplate({
  recipientName,
  offerTitle,
  offerDate,
  message,
  bookingLink,
}: BookingEmailData) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Nowa rezerwacja: ${offerTitle}</h2>
      <p>Cześć ${recipientName},</p>
      <p>Ktoś zarezerwował Twoją ofertę:</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Nazwa rejsu:</strong> ${offerTitle}<br>
        <strong>Data:</strong> ${offerDate}<br>
        ${message ? `<strong>Wiadomość:</strong> ${message}` : ''}
      </div>
      
      ${bookingLink ? `<a href="${bookingLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Zarządzaj rezerwacją</a>` : ''}
      
      <p style="color: #666; font-size: 12px; margin-top: 40px;">Sindbad - Giełda Sportów Wodnych</p>
    </div>
  `;
}

export function bookingConfirmationTemplate({
  recipientName,
  offerTitle,
  offerDate,
}: BookingEmailData) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Rezerwacja wysłana! ✓</h2>
      <p>Cześć ${recipientName},</p>
      <p>Twoja rezerwacja została pomyślnie wysłana:</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Nazwa rejsu:</strong> ${offerTitle}<br>
        <strong>Data:</strong> ${offerDate}<br>
      </div>
      
      <p>Organizator skontaktuje się z Tobą wkrótce aby potwierdzić rezerwację.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 40px;">Sindbad - Giełda Sportów Wodnych</p>
    </div>
  `;
}

export function bookingConfirmedTemplate({
  recipientName,
  offerTitle,
  offerDate,
}: BookingEmailData) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>✓ Rezerwacja potwierdzona!</h2>
      <p>Cześć ${recipientName},</p>
      <p>Twoja rezerwacja na rejs <strong>${offerTitle}</strong> została potwierdzona!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Nazwa rejsu:</strong> ${offerTitle}<br>
        <strong>Data:</strong> ${offerDate}<br>
      </div>

      <h3 style="margin-top: 30px; color: #333;">💳 Szczegóły wpłaty</h3>
      <p style="margin: 10px 0;">Prosimy o dokonanie wpłaty na poniższe konto w ciągu <strong>7 dni</strong>:</p>
      
      <div style="background: #fff9e6; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0;">
      // tu brakuje danych organizatora: numer konta bankowego, kwota do płatności i imię i nazwisko
        <strong>Numer konta:</strong> PL61109010140000071219812874<br>
        <strong>Imię i nazwisko:</strong> Jan Kowalski<br>
        <strong>Kwota:</strong> 150,00 PLN<br>
        <strong>Tytuł przelewu:</strong> Rezerwacja rejsu - ${offerTitle}
      </div>

      <p style="color: #d32f2f; font-weight: bold;">⚠️ Rezerwacja będzie ważna do wpłaty środków na wskazane konto.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 40px;">Sindbad - Giełda Sportów Wodnych</p>
    </div>
  `;
}

export function bookingRejectedTemplate({
  recipientName,
  offerTitle,
  offerDate,
}: BookingEmailData) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>✗ Rezerwacja odrzucona</h2>
      <p>Cześć ${recipientName},</p>
      <p>Niestety, Twoja rezerwacja na rejs <strong>${offerTitle}</strong> została odrzucona.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Nazwa rejsu:</strong> ${offerTitle}<br>
        <strong>Data:</strong> ${offerDate}
      </div>

      <p>Możesz przeglądać inne dostępne rejsy w naszej aplikacji:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/szukaj" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Przeglądaj rejsy</a>
      
      <p style="color: #666; font-size: 12px; margin-top: 40px;">Sindbad - Giełda Sportów Wodnych</p>
    </div>
  `;
}

export function questionToOrganizerTemplate({
  recipientName,
  offerTitle,
  offerDate,
  askerEmail,
  question,
  offerLink,
}: QuestionEmailData) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Nowe pytanie do oferty: ${offerTitle}</h2>
      <p>Cześć ${recipientName},</p>
      <p>Otrzymałeś nowe pytanie od użytkownika zainteresowanego Twoją ofertą.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Nazwa rejsu:</strong> ${offerTitle}<br>
        <strong>Data:</strong> ${offerDate}<br>
        <strong>Email pytającego:</strong> ${askerEmail}<br>
        <strong>Treść pytania:</strong><br>
        <div style="margin-top: 8px; white-space: pre-wrap;">${question}</div>
      </div>

      ${offerLink ? `<a href="${offerLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Zobacz ofertę</a>` : ''}

      <p style="color: #666; font-size: 12px; margin-top: 40px;">Sindbad - Giełda Sportów Wodnych</p>
    </div>
  `;
}

export function questionConfirmationTemplate({
  recipientName,
  offerTitle,
  offerDate,
  question,
  offerLink,
}: Omit<QuestionEmailData, 'askerEmail'>) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Pytanie zostało wysłane ✓</h2>
      <p>Cześć ${recipientName},</p>
      <p>Twoje pytanie do oferty zostało przekazane do organizatora.</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Nazwa rejsu:</strong> ${offerTitle}<br>
        <strong>Data:</strong> ${offerDate}<br>
        <strong>Twoja wiadomość:</strong><br>
        <div style="margin-top: 8px; white-space: pre-wrap;">${question}</div>
      </div>

      ${offerLink ? `<a href="${offerLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Zobacz ofertę</a>` : ''}

      <p style="color: #666; font-size: 12px; margin-top: 40px;">Sindbad - Giełda Sportów Wodnych</p>
    </div>
  `;
}
