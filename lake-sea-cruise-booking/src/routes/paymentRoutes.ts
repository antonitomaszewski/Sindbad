import { Router } from 'express';
import PaymentController from '../controllers/paymentController';

const router = Router();

router.post('/create', PaymentController.createPayment);
router.get('/status/:paymentId', PaymentController.getPaymentStatus);
router.post('/refund/:paymentId', PaymentController.refundPayment);

export default router;