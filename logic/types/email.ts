export interface BookingEmailData {
  recipientName: string;
  offerTitle: string;
  offerDate: string;
  organizerName?: string;
  message?: string;
  bookingLink?: string;
}

export interface QuestionEmailData {
  recipientName: string;
  offerTitle: string;
  offerDate: string;
  askerEmail: string;
  question: string;
  offerLink?: string;
}