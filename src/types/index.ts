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