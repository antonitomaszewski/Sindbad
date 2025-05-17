export class Offer {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public location: string,
        public date: Date,
        public price: number,
        public organizerId: string
    ) {}

    // Additional methods can be added here for business logic related to offers
}