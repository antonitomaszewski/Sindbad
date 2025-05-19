import { Cruise } from '../types/index';

export class CruiseModel implements Cruise {
    id: string;
    name: string;
    description: string;
    date: string; // ISO string
    location: string;
    availableSeats: number;
    organizerEmail: string;

    constructor(id: string, name: string, description: string, date: string, location: string, availableSeats: number, organizerEmail: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.location = location;
        this.availableSeats = availableSeats;
        this.organizerEmail = organizerEmail;

    }
}