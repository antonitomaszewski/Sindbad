export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  user_id?: string; // optional dla gości
  offer_id: string;
  status: BookingStatus;
  message?: string;
  // Pola dla niezalogowanych gości
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  created: string;
  updated: string;
}