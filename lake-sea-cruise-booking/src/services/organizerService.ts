import { Organizer } from '../models/Organizer';

export class OrganizerService {
    private organizers: Organizer[] = [];

    public createOrganizer(organizerData: Partial<Organizer>): Organizer {
        const newOrganizer = new Organizer(organizerData);
        this.organizers.push(newOrganizer);
        return newOrganizer;
    }

    public getOrganizerById(id: string): Organizer | undefined {
        return this.organizers.find(organizer => organizer.id === id);
    }

    public updateOrganizer(id: string, updatedData: Partial<Organizer>): Organizer | undefined {
        const organizer = this.getOrganizerById(id);
        if (organizer) {
            Object.assign(organizer, updatedData);
            return organizer;
        }
        return undefined;
    }

    public deleteOrganizer(id: string): boolean {
        const index = this.organizers.findIndex(organizer => organizer.id === id);
        if (index !== -1) {
            this.organizers.splice(index, 1);
            return true;
        }
        return false;
    }

    public getAllOrganizers(): Organizer[] {
        return this.organizers;
    }
}