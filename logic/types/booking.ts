export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  offer_id: string;
  status: BookingStatus;
  message?: string;
  created: string;
  updated: string;
}