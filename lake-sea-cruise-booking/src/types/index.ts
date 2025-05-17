export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Organizer {
    id: string;
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Offer {
    id: string;
    organizerId: string;
    title: string;
    description: string;
    location: string;
    date: Date;
    price: number;
    availableSeats: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Booking {
    id: string;
    userId: string;
    offerId: string;
    numberOfSeats: number;
    status: 'confirmed' | 'canceled' | 'pending';
    createdAt: Date;
    updatedAt: Date;
}

export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    status: 'completed' | 'failed' | 'pending';
    createdAt: Date;
    updatedAt: Date;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

export interface Rating {
    id: string;
    userId: string;
    offerId: string;
    score: number;
    comment?: string;
    createdAt: Date;
}