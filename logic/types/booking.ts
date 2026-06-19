export type BookingStatus = 'pending' | 'confirmed' | 'rejected';

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

export interface BookingWithOffer extends Booking {
  offer?: {
    id: string;
    title: string;
    date_from?: string;
    date_to?: string;
  };
}

// używam do wyświetlania osób na ofercie
export interface OfferParticipant {
  userId: string;
  name: string;
}

export interface UserContact {
  userId: string;
  name: string;
  trips: {
    offerId: string;
    title: string;
    date_from?: string;
    date_to?: string;
  }[];
}

export interface GuestBookingData {
  name: string;
  email?: string;
  phone?: string;
}