export class Organizer {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileDescription: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, name: string, email: string, phone: string, profileDescription: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.profileDescription = profileDescription;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateProfile(name: string, email: string, phone: string, profileDescription: string) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.profileDescription = profileDescription;
        this.updatedAt = new Date();
    }
}