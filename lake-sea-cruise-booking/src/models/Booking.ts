export class Booking {
    constructor(
        public userId: string,
        public offerId: string,
        public status: 'pending' | 'confirmed' | 'canceled',
        public bookingDate: Date,
        public numberOfGuests: number
    ) {}

    // Additional methods related to booking can be added here
}