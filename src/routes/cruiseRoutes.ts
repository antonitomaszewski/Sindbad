import { Router } from 'express';
import { addCruise, getCruises } from '../controllers/cruiseController';

const router = Router();

router.post('/', addCruise);
router.get('/', getCruises);

export default router;