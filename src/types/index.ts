export interface User {
    email: string;
    password: string;
}
export interface Cruise {
    id: string;
    name: string;
    description: string;
    date: string; // ISO string
    location: string;
    availableSeats: number;
    organizerEmail: string;
}

export interface Booking {
    id: string;
    cruiseId: string;
    userEmail: string;
    seats: number;
    createdAt: string; // ISO string
}

export interface Review {
    id: string;
    cruiseId: string;
    userEmail: string;
    rating: number; // np. 1-5
    comment: string;
    createdAt: string; // ISO string
}