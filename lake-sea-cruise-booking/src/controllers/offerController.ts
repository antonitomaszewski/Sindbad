export class OfferController {
    constructor(private offerService: OfferService) {}

    async createOffer(req, res) {
        try {
            const offerData = req.body;
            const newOffer = await this.offerService.createOffer(offerData);
            res.status(201).json(newOffer);
        } catch (error) {
            res.status(500).json({ message: 'Error creating offer', error });
        }
    }

    async updateOffer(req, res) {
        try {
            const offerId = req.params.id;
            const offerData = req.body;
            const updatedOffer = await this.offerService.updateOffer(offerId, offerData);
            res.status(200).json(updatedOffer);
        } catch (error) {
            res.status(500).json({ message: 'Error updating offer', error });
        }
    }

    async deleteOffer(req, res) {
        try {
            const offerId = req.params.id;
            await this.offerService.deleteOffer(offerId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting offer', error });
        }
    }

    async getOffers(req, res) {
        try {
            const offers = await this.offerService.getOffers();
            res.status(200).json(offers);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving offers', error });
        }
    }

    async searchOffers(req, res) {
        try {
            const searchCriteria = req.query;
            const offers = await this.offerService.searchOffers(searchCriteria);
            res.status(200).json(offers);
        } catch (error) {
            res.status(500).json({ message: 'Error searching offers', error });
        }
    }
}