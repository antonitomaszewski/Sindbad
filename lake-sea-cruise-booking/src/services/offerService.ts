import { Offer } from '../models/Offer';

export class OfferService {
    private offers: Offer[] = [];

    public createOffer(offer: Offer): Offer {
        this.offers.push(offer);
        return offer;
    }

    public updateOffer(id: string, updatedOffer: Partial<Offer>): Offer | null {
        const index = this.offers.findIndex(offer => offer.id === id);
        if (index === -1) return null;

        this.offers[index] = { ...this.offers[index], ...updatedOffer };
        return this.offers[index];
    }

    public deleteOffer(id: string): boolean {
        const index = this.offers.findIndex(offer => offer.id === id);
        if (index === -1) return false;

        this.offers.splice(index, 1);
        return true;
    }

    public getOfferById(id: string): Offer | null {
        return this.offers.find(offer => offer.id === id) || null;
    }

    public searchOffers(criteria: Partial<Offer>): Offer[] {
        return this.offers.filter(offer => {
            return Object.keys(criteria).every(key => 
                offer[key as keyof Offer] === criteria[key as keyof Offer]
            );
        });
    }
}