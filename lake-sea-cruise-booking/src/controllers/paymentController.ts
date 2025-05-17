import { Request, Response } from 'express';
import PaymentService from '../services/paymentService';

class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    public async processPayment(req: Request, res: Response): Promise<void> {
        try {
            const paymentData = req.body;
            const result = await this.paymentService.processPayment(paymentData);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error processing payment', error });
        }
    }

    public async getPaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const { paymentId } = req.params;
            const status = await this.paymentService.getPaymentStatus(paymentId);
            res.status(200).json(status);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching payment status', error });
        }
    }
}

export default PaymentController;