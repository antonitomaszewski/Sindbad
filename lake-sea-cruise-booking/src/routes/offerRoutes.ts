import { Router } from 'express';
import OfferController from '../controllers/offerController';

const router = Router();
const offerController = new OfferController();

// Route to create a new offer
router.post('/', offerController.createOffer);

// Route to get all offers
router.get('/', offerController.getAllOffers);

// Route to get an offer by ID
router.get('/:id', offerController.getOfferById);

// Route to update an offer by ID
router.put('/:id', offerController.updateOffer);

// Route to delete an offer by ID
router.delete('/:id', offerController.deleteOffer);

// Route to search offers
router.get('/search', offerController.searchOffers);

export default router;