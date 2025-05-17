import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { Offer } from '../models/Offer';

export class BookingService {
    private bookings: Booking[] = [];

    public createBooking(user: User, offer: Offer, numberOfSeats: number): Booking {
        const newBooking = new Booking(user, offer, numberOfSeats);
        this.bookings.push(newBooking);
        return newBooking;
    }

    public updateBooking(bookingId: string, updatedData: Partial<Booking>): Booking | null {
        const bookingIndex = this.bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex === -1) {
            return null;
        }
        this.bookings[bookingIndex] = { ...this.bookings[bookingIndex], ...updatedData };
        return this.bookings[bookingIndex];
    }

    public cancelBooking(bookingId: string): boolean {
        const bookingIndex = this.bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex === -1) {
            return false;
        }
        this.bookings.splice(bookingIndex, 1);
        return true;
    }

    public getBookingsByUser(userId: string): Booking[] {
        return this.bookings.filter(booking => booking.user.id === userId);
    }

    public getAllBookings(): Booking[] {
        return this.bookings;
    }
}