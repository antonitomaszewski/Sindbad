import { Router } from 'express';
import { addReview, getReviewsForCruise } from '../controllers/reviewController';

const router = Router();

router.post('/', addReview);
router.get('/:cruiseId', getReviewsForCruise);

export default router;