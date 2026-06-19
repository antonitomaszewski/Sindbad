export type BookingStatus = 'pending' | 'confirmed' | 'rejected';

export interface Booking {
  id: string;
  user_id?: string;
  offer_id: string;
  status: BookingStatus;
  message?: string;
  guest_name?: string;
  guest_email?: string;
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
}